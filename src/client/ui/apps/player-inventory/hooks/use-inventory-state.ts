import { useState, useCallback, useMemo } from "@rbxts/react";
import { InventoryItem, InventorySlot, DraggedItem } from "../types";

export function useInventoryState(maxSlots: number) {
    const [items, setItems] = useState<(InventoryItem | undefined)[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<number | undefined>();
    const [hoveredSlot, setHoveredSlot] = useState<number | undefined>();
    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState<string>("all");
    const [draggedItem, setDraggedItem] = useState<DraggedItem | undefined>();

    // Initialize inventory with sample data
    const initializeInventory = useCallback(() => {
        const emptyInventory = [];
        for (let i = 0; i < maxSlots; i++) {
            emptyInventory[i] = undefined;
        }
        const sampleItems: InventoryItem[] = [
            { id: "1", name: "Magic Sword", icon: "⚔️", quantity: 1, rarity: "legendary", description: "A powerful sword imbued with ancient magic", type: "weapon", maxStack: 1, value: 1000 },
            { id: "2", name: "Health Potion", icon: "🧪", quantity: 5, rarity: "common", description: "Restores 50 HP when consumed", type: "consumable", maxStack: 10, value: 25 },
            { id: "3", name: "Dragon Scale", icon: "🐉", quantity: 3, rarity: "epic", description: "Rare crafting material from ancient dragons", type: "material", maxStack: 99, value: 500 },
            { id: "4", name: "Grappling Hook", icon: "🪝", quantity: 1, rarity: "rare", description: "Allows traversal of difficult terrain", type: "tool", maxStack: 1, value: 200 },
            { id: "5", name: "Mana Crystal", icon: "💎", quantity: 2, rarity: "rare", description: "Restores 30 MP when used", type: "consumable", maxStack: 5, value: 150 }
        ];
        
        sampleItems.forEach((item, index) => {
            if (index < maxSlots) {
                emptyInventory[index] = item;
            }
        });
        
        setItems(emptyInventory);
    }, [maxSlots]);

    // Filter items based on search and type
    const filteredItems = useMemo((): InventorySlot[] => {
        return (items as InventoryItem[]).map((item, index) => {
            if (!item) return { item: undefined, originalIndex: index };
            
            const matchesSearch = item.name.lower().find(searchQuery.lower(), 0, true) !== undefined || 
                                item.description.lower().find(searchQuery.lower(), 0, true) !== undefined;
            const matchesType = filterType === "all" || item.type === filterType;
            
            return {
                item: matchesSearch && matchesType ? item : undefined,
                originalIndex: index
            };
        });
    }, [items, searchQuery, filterType]);

    // Add item to inventory
    const addItem = useCallback((newItem: InventoryItem): boolean => {
        let added = false;
        setItems(prev => {
            const newItems = [...prev];
            
            // Try to stack with existing items first
            for (let i = 0; i < newItems.size(); i++) {
                const existingItem = newItems[i];
                if (existingItem && 
                    existingItem.id === newItem.id && 
                    existingItem.quantity < (existingItem.maxStack || 1)) {
                    
                    const canAdd = math.min(newItem.quantity, (existingItem.maxStack || 1) - existingItem.quantity);
                    newItems[i] = { ...existingItem, quantity: existingItem.quantity + canAdd };
                    newItem.quantity -= canAdd;
                    
                    if (newItem.quantity === 0) {
                        added = true;
                        return newItems;
                    }
                }
            }
            
            // Find empty slot
            let emptyIndex = -1;
            for (let i = 0; i < newItems.size(); i++) {
                if (newItems[i] === undefined) {
                    emptyIndex = i;
                    break;
                }
            }
            if (emptyIndex !== -1) {
                newItems[emptyIndex] = newItem;
                added = true;
            }
            
            return newItems;
        });
        
        return added;
    }, []);

    // Remove item from inventory
    const removeItem = useCallback((slotIndex: number, quantity: number = 1) => {
        setItems(prev => {
            const newItems = [...prev];
            const item = newItems[slotIndex];
            
            if (item) {
                const newQuantity = item.quantity - quantity;
                newItems[slotIndex] = newQuantity > 0 ? { ...item, quantity: newQuantity } : undefined;
            }
            
            return newItems;
        });
    }, []);

    // Move item between slots
    const moveItem = useCallback((fromSlot: number, toSlot: number) => {
        setItems(prev => {
            const newItems = [...prev];
            const fromItem = newItems[fromSlot];
            const toItem = newItems[toSlot];
            
            newItems[fromSlot] = toItem;
            newItems[toSlot] = fromItem;
            
            return newItems;
        });
    }, []);

    return {
        // State
        items,
        selectedSlot,
        hoveredSlot,
        searchQuery,
        filterType,
        draggedItem,
        filteredItems,
        
        // Setters
        setSelectedSlot,
        setHoveredSlot,
        setSearchQuery,
        setFilterType,
        setDraggedItem,
        
        // Actions
        initializeInventory,
        addItem,
        removeItem,
        moveItem,
    };
}