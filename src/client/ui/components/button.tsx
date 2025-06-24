import React from '@rbxts/react';

import type { FrameProps } from './frame';

export interface ButtonProps extends FrameProps<TextButton> {
    /** The default properties of a `TextButton` component. */
    active?: boolean | React.Binding<boolean>;
    /** A callback that is triggered when the button is clicked. */
    onClick?: () => void;
    /**
     * A callback that is triggered when the mouse button is pressed down on the
     * button.
     */
    onMouseDown?: () => void;
    /** A callback that is triggered when the mouse enters the button. */
    onMouseEnter?: () => void;
    /** A callback that is triggered when the mouse leaves the button. */
    onMouseLeave?: () => void;
    /**
     * A callback that is triggered when the mouse button is released on the
     * button.
     */
    onMouseUp?: () => void;
}

/**
 * Button component.
 *
 * @example
 *
 * ```tsx
 * <Button
 * 	CornerRadius={new UDim(0, 8)}
 * 	Native={{ Size: new UDim2(0, 100, 0, 100) }}
 * 	onClick={useCallback(() => {
 * 		print("Hello World!");
 * 	}, [])}
 * />;
 * ```
 *
 * Button is released on the button.
 *
 * @param buttonProps - The properties of the Button component.
 * @returns The rendered Button component.
 * @component
 *
 * @see https://create.roblox.com/docs/reference/engine/classes/TextButton
 */
export function Button(props: ButtonProps) {
    const { onClick, onMouseDown, onMouseEnter, onMouseLeave, onMouseUp } = props;

    const event = {
        Activated: onClick && (() => onClick()),
        MouseButton1Down: onMouseDown && (() => onMouseDown()),
        MouseButton1Up: onMouseUp && (() => onMouseUp()),
        MouseEnter: onMouseEnter && (() => onMouseEnter()),
        MouseLeave: onMouseLeave && (() => onMouseLeave()),
        ...props.event,
    };

    return (
        <textbutton
            Active={props.active}
            Text=""
            AutoButtonColor={false}
            Size={props.size}
            Position={props.position}
            AnchorPoint={props.anchorPoint}
            BackgroundColor3={props.backgroundColor}
            BackgroundTransparency={props.backgroundTransparency}
            ClipsDescendants={props.clipsDescendants}
            Visible={props.visible}
            ZIndex={props.zIndex}
            LayoutOrder={props.layoutOrder}
            BorderSizePixel={0}
            Event={event}
            Change={props.change}
        >
            {props.children}
            {props.cornerRadius && <uicorner CornerRadius={props.cornerRadius} />}
        </textbutton>
    );
}
