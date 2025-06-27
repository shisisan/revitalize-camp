import { createProducer } from '@rbxts/reflex';

export interface InventoryState {
    isOpen: boolean;
}

const initialState: InventoryState = {
    isOpen: false,
};

export const inventorySlice = createProducer(initialState, {
    openInventory: (state): InventoryState => ({
        ...state,
        isOpen: true,
    }),
    closeInventory: (state): InventoryState => ({
        ...state,
        isOpen: false,
    }),
    toggleInventory: (state): InventoryState => ({
        ...state,
        isOpen: !state.isOpen,
    }),
});
