import React, { useCallback } from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { InferProps } from "@rbxts/ui-labs/src/Typing/Typing";
import { Button }  from "./components/primitive";

const controls = {
    Visible: true,
    Color: Color3.fromRGB(255, 255, 255),
    Text: "Button Text",
};

const story = {
    react: React,
    reactRoblox: ReactRoblox,
    controls: controls,
    story: (props: InferProps<typeof controls>) => {
        return (
            <Button
                            CornerRadius={new UDim(0, 8)}
                            
                            Native={{ Size: new UDim2(0, 120, 0, 100) }}
                        >
                            <textlabel
                                TextColor3={props.controls.Color}
                                BackgroundTransparency={1}
                                Size={new UDim2(1, 0, 1, 0)}
                                Text={`${props.controls.Text}`}
                                TextScaled={true}
                            />
                        </Button>
        );
    },
};

export = story;