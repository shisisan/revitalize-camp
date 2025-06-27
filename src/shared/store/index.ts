import { createBinarySerializer } from '@rbxts/flamework-binary-serializer';
import type { CombineStates } from '@rbxts/reflex';

import { characterSlice } from './character';
import { persistentSlice } from './persistent/persistent-slice';
import { inventorySlice } from './inventory/inventory';

export type SharedState = CombineStates<typeof slices>;
export type SerializedSharedState = ReturnType<typeof stateSerDes.serialize>;

export const stateSerDes = createBinarySerializer<SharedState>();

export const slices = {
    character: characterSlice,
    inventory: inventorySlice,
    persistent: persistentSlice,
};
