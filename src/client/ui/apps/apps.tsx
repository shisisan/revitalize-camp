import React, { useCallback, useState } from "@rbxts/react";

import { Button, Layer } from "../components/primitive";
import { PlayerHealthBar } from "./player-healthbar/player-healthbar.ui";
import { ErrorHandler } from "../components/error-handler/error-handler";
import { PlayerInventoryUI } from "./player-inventory/player-inventory.ui";

export function App(): React.ReactNode {
    const [count, setCount] = React.useState(0);

    const handleClick = useCallback(() => {
        setCount((prev) => prev + 1);
    }, []);

    const [inventoryOpen, setInventoryOpen] = useState(false);

    return (
        <ErrorHandler>
            <Layer>
                <PlayerHealthBar />
            </Layer>
            <PlayerInventoryUI
                isOpen={inventoryOpen}
                onToggle={setInventoryOpen}
                maxSlots={30}
                gridSize={6}
                onItemSelect={(item) => {
                    print(`Selected: ${item?.name}`);
                }}
                onItemUse={(item) => {
                    print(`Used: ${item?.name}`);
                }}
                onItemDrop={(item, from, to) => {
                    print(`Moved ${item.name} from ${from} to ${to}`);
                }}
            />
            
        </ErrorHandler>
    );
}