import { useEffect } from '@rbxts/react';
import { UserInputService } from '@rbxts/services';

export function useInventoryControls(isOpen: boolean, onToggle: (isOpen: boolean) => void) {
    useEffect(() => {
        const connection = UserInputService.InputBegan.Connect((input) => {
            if (input.KeyCode === Enum.KeyCode.B) {
                onToggle(!isOpen);
            }
            if (input.KeyCode === Enum.KeyCode.Escape && isOpen) {
                onToggle(false);
            }
        });

        return () => connection.Disconnect();
    }, [isOpen, onToggle]);
}
