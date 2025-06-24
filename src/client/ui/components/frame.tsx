import type { Ref } from '@rbxts/react';
import React, { forwardRef } from '@rbxts/react';

import type { BindingValue } from 'types/util/react';

export interface FrameProps<T extends Instance = Frame> extends React.PropsWithChildren {
    ref?: React.Ref<T>;
    event?: React.InstanceEvent<T>;
    change?: React.InstanceChangeEvent<T>;
    size?: UDim2 | React.Binding<UDim2>;
    position?: UDim2 | React.Binding<UDim2>;
    anchorPoint?: Vector2 | React.Binding<Vector2>;
    rotation?: number | React.Binding<number>;
    backgroundColor?: Color3 | React.Binding<Color3>;
    backgroundTransparency?: number | React.Binding<number>;
    clipsDescendants?: boolean | React.Binding<boolean>;
    visible?: boolean | React.Binding<boolean>;
    zIndex?: number | React.Binding<number>;
    layoutOrder?: number | React.Binding<number>;
    cornerRadius?: UDim | React.Binding<UDim>;
}

/**
 * A wrapper around the `Frame` component, a GuiObject that renders as a plain
 * rectangle with no other content. If you intend to use this component as a
 * container for other components, consider using the `Group` component
 * instead.
 *
 * @example
 *
 * ```tsx
 * <Frame CornerRadius={new UDim(0, 8)} Native={{ Size: new UDim2(0, 100, 0, 100) }}>
 * ```
 *
 * @note A frame defaults to being centered in the parent container (anchor point and
 * position are set to 0.5).
 *
 * @component
 *
 * @see https://create.roblox.com/docs/reference/engine/classes/Frame
 */
export const Frame = forwardRef((props: FrameProps, ref: Ref<Frame>) => {
    return (
        <frame
            ref={ref}
            Size={props.size}
            Position={props.position}
            AnchorPoint={props.anchorPoint}
            Rotation={props.rotation}
            BackgroundColor3={props.backgroundColor}
            BackgroundTransparency={props.backgroundTransparency}
            ClipsDescendants={props.clipsDescendants}
            Visible={props.visible}
            ZIndex={props.zIndex}
            LayoutOrder={props.layoutOrder}
            BorderSizePixel={0}
            Event={props.event}
            Change={props.change}
        >
            {props.children}
            {props.cornerRadius && <uicorner CornerRadius={props.cornerRadius} />}
        </frame>
    );
});
