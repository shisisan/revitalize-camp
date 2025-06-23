import React, { useCallback } from "@rbxts/react";

import { Button, Layer } from "../components/primitive";

export function App(): React.ReactNode {
    const [count, setCount] = React.useState(0);

    const handleClick = useCallback(() => {
        setCount((prev) => prev + 1);
    }, []);

    return (
        <screengui
            IgnoreGuiInset
            ResetOnSpawn={false}
            ZIndexBehavior={Enum.ZIndexBehavior.Sibling}
        >
            <Button
                CornerRadius={new UDim(0, 8)}
                Native={{ Size: new UDim2(0, 120, 0, 100) }}
                onClick={handleClick}
            >
                <textlabel
                    BackgroundTransparency={1}
                    Size={new UDim2(1, 0, 1, 0)}
                    Text={`Count: ${count}`}
                    TextScaled={true}
                />
            </Button>
        </screengui>
    );
}