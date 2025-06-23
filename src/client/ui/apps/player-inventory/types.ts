export interface InventoryItem {
    id: string;
    name: string;
    icon: string;
    quantity: number;
    rarity: "common" | "rare" | "epic" | "legendary";
    description: string;
    type: "weapon" | "consumable" | "material" | "tool";
    maxStack?: number;
    value?: number;
}

export interface InventorySlot {
    item: InventoryItem | undefined;
    originalIndex: number;
}

export interface DraggedItem {
    item: InventoryItem;
    fromSlot: number;
}

export interface InventorySystemProps {
    maxSlots?: number;
    gridSize?: number;
    onItemSelect?: (item: InventoryItem | undefined) => void;
    onItemUse?: (item: InventoryItem) => void;
    onItemDrop?: (item: InventoryItem, fromSlot: number, toSlot: number) => void;
    isOpen?: boolean;
    onToggle?: (isOpen: boolean) => void;
}