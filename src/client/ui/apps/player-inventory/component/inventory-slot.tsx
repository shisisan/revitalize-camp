import React from "@rbxts/react";
import { InventoryItem } from "../types";
import { getRarityColor } from "../utils/inventory-utils";
import { UI_COLORS } from "../constants";

interface InventorySlotProps {
    item: InventoryItem | undefined;
    slotIndex: number;
    isSelected: boolean;
    isHovered: boolean;
    onSlotClick: (index: number) => void;
    onDragStart: (item: InventoryItem, fromSlot: number) => void;
    onMouseEnter: (index: number) => void;
    onMouseLeave: () => void;
}

export function InventorySlot({
    item,
    slotIndex,
    isSelected,
    isHovered,
    onSlotClick,
    onDragStart,
    onMouseEnter,
    onMouseLeave
}: InventorySlotProps): React.ReactNode {
    return (
        <frame
            BackgroundColor3={
                isSelected ? UI_COLORS.slotSelected :
                isHovered ? UI_COLORS.slotHover :
                UI_COLORS.slot
            }
            BorderSizePixel={item ? 2 : 0}
            BorderColor3={item ? getRarityColor(item.rarity) : Color3.fromRGB(0, 0, 0)}
        >
            <uicorner CornerRadius={new UDim(0, 8)} />
            
            <textbutton
                Size={new UDim2(1, 0, 1, 0)}
                BackgroundTransparency={1}
                Text={item ? item.icon : ""}
                TextScaled={true}
                Font={Enum.Font.Gotham}
                Event={{
                    MouseButton1Click: () => onSlotClick(slotIndex),
                    MouseButton1Down: item ? () => onDragStart(item, slotIndex) : undefined,
                    MouseEnter: () => onMouseEnter(slotIndex),
                    MouseLeave: onMouseLeave
                }}
            />
            
            {/* Quantity Badge */}
            {item && item.quantity > 1 && (
                <textlabel
                    Position={new UDim2(1, -20, 1, -15)}
                    Size={new UDim2(0, 18, 0, 12)}
                    BackgroundColor3={Color3.fromRGB(231, 76, 60)}
                    Text={tostring(item.quantity)}
                    TextColor3={Color3.fromRGB(255, 255, 255)}
                    TextScaled={true}
                    Font={Enum.Font.GothamBold}
                >
                    <uicorner CornerRadius={new UDim(0, 6)} />
                </textlabel>
            )}
        </frame>
    );
}