import React, { useCallback, useState } from '@rbxts/react';
import { SprintButton } from './sprint-button';
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
import { useSelector } from '@rbxts/react-reflex';
import { store, type RootState } from 'client/store';

export function App(): React.ReactNode {
    const [count, setCount] = React.useState(0);

    const handleClick = useCallback(() => {
        setCount((prev) => prev + 1);
    }, []);

    const isOpen = useSelector((state: RootState) => state.inventory.isOpen);

    return (
        <ErrorHandler>
            <Layer>
                <PlayerInventoryUI
                    isOpen={isOpen}
                    onToggle={store.toggleInventory}
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
            <Layer>
                <SprintButton />
            </Layer>
        </ErrorHandler>
    );
}
