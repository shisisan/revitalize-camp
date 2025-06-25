import { Modding, Reflect } from '@flamework/core';
import { RunService as Runtime } from '@rbxts/services';

import { roundDecimal } from 'shared/util/math-util';
import Log from '@rbxts/log';

/**
 * Request the required metadata for lifecycle events and dependency resolution.
 * @metadata flamework:implements flamework:parameters
 */
export const Singleton = Modding.createDecorator('Class', (descriptor) => {
    Reflect.defineMetadata(descriptor.object, 'flamework:singleton', true);
});

/**
 * Wraps the function in a `task.spawn()`
 *
 * **Note:** Voids the return value
 * */
export const SpawnTask = Modding.createDecorator('Method', (descriptor) => {
    const object = <Record<string, Callback>>(<unknown>descriptor.constructor!);
    const originalMethod = object[descriptor.property];

    if (!originalMethod) {
        throw Log.Fatal(
            `Method ${descriptor.property} not found on ${tostring(descriptor.constructor)}`
        );
    }

    object[descriptor.property] = (...args: unknown[]) => task.spawn(originalMethod, ...args);
});

/** Calls `whenInvalid` when `validator` returns false */
export const ValidateReturn = Modding.createDecorator<
    [
        validator: (returnValue: unknown) => boolean,
        whenInvalid?: (returnValue: unknown) => void,
        warnNotError?: boolean
    ]
>('Method', (descriptor, [validator, whenInvalid, warnNotError]) => {
    const object = <Record<string, Callback>>(<unknown>descriptor.constructor!);
    const originalMethod = object[descriptor.property];

    if (!originalMethod) {
        throw Log.Fatal(
            `Method ${descriptor.property} not found on ${tostring(descriptor.constructor)}`
        );
    }

    warnNotError ??= false;
    whenInvalid ??= (value) =>
        Log.Warn(
            `Invalid return value ${value} returned by ${tostring(descriptor.constructor)}.${
                descriptor.property
            }()`
        );

    object[descriptor.property] = function (...args: unknown[]) {
        const value = originalMethod(...args);
        const isValid = validator(value);
        if (!isValid) whenInvalid!(value);

        return value;
    };
});

/** Retries the function every time `retryCondition` returns true, `times` times, with `delay` seconds in between */
export const Retry = Modding.createDecorator<
    [times: number, delay?: number, retryCondition?: (fn: () => void) => boolean]
>('Method', (descriptor, [times, delay, retryCondition]) => {
    const object = <Record<string, Callback>>(<unknown>descriptor.constructor!);
    const originalMethod = object[descriptor.property];

    if (!originalMethod) {
        throw Log.Fatal(
            `Method ${descriptor.property} not found on ${tostring(descriptor.constructor)}`
        );
    }

    delay ??= 0;
    retryCondition ??= (fn) => {
        try {
            fn();
            return false;
        } catch (e) {
            Log.Fatal(
                `Failed to execute ${tostring(descriptor.constructor!)}.${
                    descriptor.property
                }(): ${e}`
            );
            return true;
        }
    };

    object[descriptor.property] = function (...args: unknown[]) {
        const wrappedMethod = (...retryArgs: unknown[]) =>
            retryArgs.size() > 0 ? originalMethod(...retryArgs) : originalMethod(...args);
        let shouldRetry = retryCondition!(wrappedMethod);
        let retries = 0;
        while (shouldRetry && retries < times) {
            retries++;
            if (delay! > 0) task.wait(delay);

            shouldRetry = retryCondition!(wrappedMethod);
        }
    };
});

/** Only allows the function to be executed once every `length` seconds */
export const Cooldown = Modding.createDecorator<[length: number]>(
    'Method',
    (descriptor, [length]) => {
        let canCall = true;
        const object = <Record<string, Callback>>(<unknown>descriptor.constructor!);
        const originalMethod = object[descriptor.property];

        if (!originalMethod) {
            throw Log.Fatal(
                `Method ${descriptor.property} not found on ${tostring(descriptor.constructor)}`
            );
        }

        object[descriptor.property] = function (...args: unknown[]) {
            if (!canCall) return;
            canCall = false;
            task.delay(length, () => (canCall = true));

            return originalMethod(...args);
        };
    }
);

/** Cache the first result the function returns and return the cached result from then on out */
export const Memoize = Modding.createDecorator<[]>('Method', (descriptor) => {
    const object = <Record<string, Callback> & { __memoizationCache: Record<string, unknown> }>(
        (<unknown>descriptor.constructor!)
    );
    const originalMethod = object[descriptor.property];

    if (!originalMethod) {
        throw Log.Fatal(
            `Method ${descriptor.property} not found on ${tostring(descriptor.constructor)}`
        );
    }

    const key = tostring(originalMethod);

    object[descriptor.property] = function (this, ...args: unknown[]) {
        this.__memoizationCache ??= {};
        if (this.__memoizationCache[key] === undefined) {
            const result = originalMethod(this, ...args);
            this.__memoizationCache[key] = result;
        }

        return this.__memoizationCache[key];
    };
});

/** Only allows the function to be executed in studio */
export const StudioOnly = Modding.createDecorator<[]>('Method', (descriptor) => {
    const object = <Record<string, Callback>>(<unknown>descriptor.constructor!);
    const originalMethod = object[descriptor.property];

    if (!originalMethod) {
        throw Log.Fatal(
            `Method ${descriptor.property} not found on ${tostring(descriptor.constructor)}`
        );
    }

    object[descriptor.property] = function (...args: unknown[]) {
        if (Runtime.IsStudio()) originalMethod(...args);
    };
});

/**
 * Benchmark how long the function takes to run
 * @metadata reflect identifier flamework:parameters
 */
export function LogBenchmark<Args extends unknown[] = unknown[]>(
    formatter?: (methodName: string, msElapsed: number, ...args: Args) => string
) {
    return (
        ctor: object,
        propertyKey: string,
        descriptor: TypedPropertyDescriptor<(this: unknown, ...args: Args) => unknown>
    ) => {
        const object = <Record<string, Callback>>ctor;
        formatter ??= (name, elapsed, ..._) =>
            `Method "${name}" took ${roundDecimal(elapsed, 2)} ms to execute.`;

        // Fix the LogBenchmark decorator as well
        const originalMethod = descriptor.value;
        if (!originalMethod) {
            Log.Fatal(`Method ${propertyKey} descriptor value is undefined`);
        }

        object[propertyKey] = function (this: unknown, ...args: Args) {
            const startTime = os.clock();
            const result = originalMethod(this, ...args);
            const endTime = os.clock();
            const elapsed = (endTime - startTime) * 1000;
            Log.Info(`Benchmark: ${propertyKey} took ${elapsed} ms`, ...args);
            return result;
        };
    };
}
