import React, { forwardRef } from '@rbxts/react';

interface GroupProps extends React.PropsWithChildren {
    ref?: React.Ref<Frame>;
    event?: React.InstanceEvent<Frame>;
    change?: React.InstanceChangeEvent<Frame>;
    size?: UDim2 | React.Binding<UDim2>;
    position?: UDim2 | React.Binding<UDim2>;
    anchorPoint?: Vector2 | React.Binding<Vector2>;
    rotation?: number | React.Binding<number>;
    clipsDescendants?: boolean | React.Binding<boolean>;
    layoutOrder?: number | React.Binding<number>;
    visible?: boolean | React.Binding<boolean>;
    zIndex?: number | React.Binding<number>;
}

/**
 * A container for grouping multiple components together.
 *
 * @example
 *
 * ```tsx
 * <Group Native={{ Position: new UDim2(0, 0, 0, 0) }}>
 * 	<TextButton Text="Button 1" />
 * 	<TextButton Text="Button 2" />
 * </Group>;
 * ```
 *
 * @note A group defaults to being centered in the parent container (anchor point and
 * position are set to 0.5).
 *
 * @component
 */
export const Group = forwardRef((props: GroupProps, ref: React.Ref<Frame>) => {
    return (
        <frame
            ref={ref}
            Size={props.size || UDim2.fromScale(1, 1)}
            Position={props.position}
            AnchorPoint={props.anchorPoint}
            Rotation={props.rotation}
            ClipsDescendants={props.clipsDescendants}
            LayoutOrder={props.layoutOrder}
            Visible={props.visible}
            ZIndex={props.zIndex}
            BackgroundTransparency={1}
            Event={props.event}
            Change={props.change}
        >
            {props.children}
        </frame>
    );
});
