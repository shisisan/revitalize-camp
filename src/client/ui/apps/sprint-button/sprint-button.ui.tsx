import React from '@rbxts/react';
import { UserInputService } from '@rbxts/services';
import { useSelector } from '@rbxts/react-reflex';

import { store, type RootState } from 'client/store';
import { ReactiveButton } from 'client/ui/components/reactive-button';
import { usePx } from 'client/ui/hooks/use-px';
import { Image } from 'client/ui/components';
// Import your assets - adjust the path as needed

const SPRINT_BUTTON_SIZE = 115;
const SPRINT_BUTTON_POSITION: UDim2 = new UDim2(1, -120, 1, -220);

export function SprintButton(): React.ReactNode {
    const px = usePx();

    const isSprinting = useSelector((state: RootState) => state.character.isSprinting);

    if (!UserInputService.TouchEnabled) {
        return;
    }

    return (
        <ReactiveButton
            size={new UDim2(0, px(SPRINT_BUTTON_SIZE), 0, px(SPRINT_BUTTON_SIZE))}
            position={SPRINT_BUTTON_POSITION}
            backgroundColor={
                isSprinting ? Color3.fromRGB(100, 180, 255) : Color3.fromRGB(255, 255, 255)
            }
            backgroundTransparency={3.5}
            cornerRadius={new UDim(1, 0)}
            onMouseDown={() => store.startSprinting()}
            onMouseUp={() => store.stopSprinting()}
        >
            {/* Sprint Icon Image */}
            <Image
                key="sprint-icon"
                image={'rbxassetid://118709768438655'} // Replace with your sprint icon path
                imageColor={
                    isSprinting ? Color3.fromRGB(255, 255, 255) : Color3.fromRGB(50, 50, 50)
                }
                imageTransparency={0}
                backgroundTransparency={1}
                size={new UDim2(0.6, 0, 0.6, 0)} // 60% of button size
                position={new UDim2(0.5, 0, 0.5, 0)}
                anchorPoint={new Vector2(0.5, 0.5)}
                scaleType="Fit"
            />
        </ReactiveButton>
    );
}
