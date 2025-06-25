import React, { useCallback, useState } from '@rbxts/react';

import { Button, Layer } from '../components';
import { PlayerHealthBar } from './player-healthbar/player-healthbar.ui';
import { ErrorHandler } from '../components/error-handler/error-handler';
import { PlayerInventoryUI } from './player-inventory/player-inventory.ui';
import { Alerts } from './alerts';
import { sendAlert } from 'client/alerts';
import { palette } from 'shared/constants/palette';
import { sounds } from 'shared/assets/assets';
import { Dependency } from '@flamework/core';
import type { DataService } from 'server/services/third-party/firebase-data-service';
import { Players } from '@rbxts/services';

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
                <PlayerInventoryUI
                    isOpen={inventoryOpen}
                    onToggle={setInventoryOpen}
                    maxSlots={30}
                    gridSize={6}
                    onItemSelect={(item) => {
                        print(`Selected: ${item?.name}`);
                    }}
                    onItemUse={(item) => {
                        if (item.rarity === 'epic') {
                            sendAlert({
                                emoji: '🧪',
                                color: palette.yellow,
                                message: `item Used ${item?.name} !`,
                                sound: sounds['alert_money.ogg'],
                            });
                        }
                        print(`Used: ${item?.name}`);
                    }}
                    onItemDrop={(item, from, to) => {
                        print(`Moved ${item.name} from ${from} to ${to}`);
                    }}
                />
            </Layer>

            <Layer>
                <Alerts />
            </Layer>
        </ErrorHandler>
    );
}
