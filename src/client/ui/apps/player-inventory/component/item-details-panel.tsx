import React from '@rbxts/react';
import { InventoryItem } from '../types';
import { getRarityColor, formatItemValue } from '../utils/inventory-utils';
import { UI_COLORS } from '../constants';

interface ItemDetailsPanelProps {
    item: InventoryItem;
    onUse: (item: InventoryItem) => void;
}

export function ItemDetailsPanel({ item, onUse }: ItemDetailsPanelProps): React.ReactNode {
    return (
        <frame
            Position={new UDim2(0, 20, 1, -120)}
            Size={new UDim2(1, -40, 0, 100)}
            BackgroundColor3={UI_COLORS.detailsPanel}
            BorderSizePixel={0}
        >
            <uicorner CornerRadius={new UDim(0, 8)} />

            {/* Item Name */}
            <textlabel
                Position={new UDim2(0, 10, 0, 5)}
                Size={new UDim2(0.6, -10, 0, 25)}
                BackgroundTransparency={1}
                Text={`${item.icon} ${item.name}`}
                TextColor3={getRarityColor(item.rarity)}
                TextScaled={true}
                Font={Enum.Font.GothamBold}
                TextXAlignment={Enum.TextXAlignment.Left}
            />

            {/* Item Value */}
            {item.value !== undefined && item.value !== undefined && (
                <textlabel
                    Position={new UDim2(0.6, 0, 0, 5)}
                    Size={new UDim2(0.3, -10, 0, 25)}
                    BackgroundTransparency={1}
                    Text={`💰 ${formatItemValue(item.value)}`}
                    TextColor3={Color3.fromRGB(255, 215, 0)}
                    TextScaled={true}
                    Font={Enum.Font.GothamBold}
                    TextXAlignment={Enum.TextXAlignment.Right}
                />
            )}

            {/* Item Description */}
            <textlabel
                Position={new UDim2(0, 10, 0, 30)}
                Size={new UDim2(1, -120, 0, 40)}
                BackgroundTransparency={1}
                Text={item.description}
                TextColor3={Color3.fromRGB(200, 200, 200)}
                TextWrapped={true}
                TextScaled={true}
                Font={Enum.Font.Gotham}
                TextXAlignment={Enum.TextXAlignment.Left}
                TextYAlignment={Enum.TextYAlignment.Top}
            />

            {/* Use Button */}
            <textbutton
                Position={new UDim2(1, -100, 0, 10)}
                Size={new UDim2(0, 90, 0, 30)}
                BackgroundColor3={UI_COLORS.useButton}
                Text="USE"
                TextColor3={Color3.fromRGB(255, 255, 255)}
                TextScaled={true}
                Font={Enum.Font.GothamBold}
                Event={{
                    MouseButton1Click: () => onUse(item),
                }}
            >
                <uicorner CornerRadius={new UDim(0, 6)} />
            </textbutton>

            {/* Drop Button */}
            <textbutton
                Position={new UDim2(1, -100, 0, 45)}
                Size={new UDim2(0, 90, 0, 25)}
                BackgroundColor3={Color3.fromRGB(230, 126, 34)}
                Text="DROP"
                TextColor3={Color3.fromRGB(255, 255, 255)}
                TextScaled={true}
                Font={Enum.Font.Gotham}
                Event={{
                    MouseButton1Click: () => {
                        // Handle drop logic
                        print(`Dropping ${item.name}`);
                    },
                }}
            >
                <uicorner CornerRadius={new UDim(0, 6)} />
            </textbutton>
        </frame>
    );
}
