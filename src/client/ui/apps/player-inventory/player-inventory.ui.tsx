import React, { useEffect, useState } from "@rbxts/react";
import { useInventoryState } from "./hooks/use-inventory-state";
import { useInventoryControls } from "./hooks/use-inventory-controls";
import { InventorySlot } from "./component/inventory-slot";
import { ItemDetailsPanel } from "./component/item-details-panel";
import { InventoryItem, InventorySystemProps } from "./types";
import { UI_COLORS, DEFAULT_CONFIG } from "./constants";

export function PlayerInventoryUI({
    maxSlots = DEFAULT_CONFIG.maxSlots,
    gridSize = DEFAULT_CONFIG.gridSize,
    onItemSelect,
    onItemUse,
    onItemDrop,
    isOpen: controlledIsOpen,
    onToggle
}: InventorySystemProps): React.ReactNode {
    const [internalIsOpen, setInternalIsOpen] = useState(false);
    const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
    const handleToggle = onToggle || setInternalIsOpen;

    const {
        items,
        selectedSlot,
        hoveredSlot,
        searchQuery,
        filterType,
        draggedItem,
        filteredItems,
        setSelectedSlot,
        setHoveredSlot,
        setSearchQuery,
        setFilterType,
        setDraggedItem,
        initializeInventory,
        removeItem,
        moveItem,
    } = useInventoryState(maxSlots);

    const [currentFilterType, setCurrentFilterType] = useState("all");

    // Initialize inventory on mount
    useEffect(() => {
        initializeInventory();
    }, [initializeInventory]);

    // Setup keyboard controls
    useInventoryControls(isOpen, handleToggle);

    // Handle item selection
    const handleSlotClick = (slotIndex: number) => {
        const item = items[slotIndex];
        setSelectedSlot(slotIndex);
        onItemSelect?.(item);
    };

    // Handle item use
    const handleItemUse = (item: InventoryItem) => {
        if (item.type === "consumable" && selectedSlot !== undefined) {
            removeItem(selectedSlot, 1);
        }
        onItemUse?.(item);
    };

    // Handle drag start
    const handleDragStart = (item: InventoryItem, fromSlot: number) => {
        setDraggedItem({ item, fromSlot });
    };

    // Handle drop
    const handleDrop = (toSlot: number) => {
        if (!draggedItem) return;
        
        moveItem(draggedItem.fromSlot, toSlot);
        onItemDrop?.(draggedItem.item, draggedItem.fromSlot, toSlot);
        setDraggedItem(undefined);
    };

    if (!isOpen) return undefined;

    const selectedItem = selectedSlot !== undefined ? items[selectedSlot] : undefined;

    return (
        <screengui
            ZIndexBehavior={Enum.ZIndexBehavior.Sibling}
            ResetOnSpawn={false}
        >
            {/* Background Overlay */}
            <frame
                Size={new UDim2(1, 0, 1, 0)}
                BackgroundColor3={Color3.fromRGB(0, 0, 0)}
                BackgroundTransparency={0.3}
                BorderSizePixel={0}
            >
                {/* Main Panel */}
                <frame
                    Position={new UDim2(0.5, -DEFAULT_CONFIG.panelWidth/2, 0.5, -DEFAULT_CONFIG.panelHeight/2)}
                    Size={new UDim2(0, DEFAULT_CONFIG.panelWidth, 0, DEFAULT_CONFIG.panelHeight)}
                    BackgroundColor3={UI_COLORS.background}
                    BorderSizePixel={0}
                >
                    <uicorner CornerRadius={new UDim(0, 12)} />
                    
                    {/* Title Bar */}
                    <frame
                        Size={new UDim2(1, 0, 0, 60)}
                        BackgroundColor3={UI_COLORS.titleBar}
                        BorderSizePixel={0}
                    >
                        <uicorner CornerRadius={new UDim(0, 12)} />
                        
                        <textlabel
                            Position={new UDim2(0, 20, 0, 0)}
                            Size={new UDim2(0, 200, 1, 0)}
                            BackgroundTransparency={1}
                            Text="🎒 Player Inventory"
                            TextColor3={Color3.fromRGB(255, 255, 255)}
                            TextScaled={true}
                            Font={Enum.Font.GothamBold}
                            TextXAlignment={Enum.TextXAlignment.Left}
                        />
                        
                        {/* Close Button */}
                        <textbutton
                            Position={new UDim2(1, -50, 0, 10)}
                            Size={new UDim2(0, 40, 0, 40)}
                            BackgroundColor3={Color3.fromRGB(255, 0, 0)}
                            Text="X"
                            TextColor3={Color3.fromRGB(255, 255, 255)}
                            TextScaled={true}
                            Font={Enum.Font.GothamBold}
                            Event={{
                                MouseButton1Click: () => handleToggle(false)
                            }}
                        >
                            <uicorner CornerRadius={new UDim(0, 8)} />
                            <uistroke Thickness={2} Color={Color3.fromRGB(200, 0, 0)} />
                        </textbutton>
                    </frame>
                    
                    {/* Search and Filter Bar */}
                    <frame
                        Position={new UDim2(0, 20, 0, 80)}
                        Size={new UDim2(1, -40, 0, 40)}
                        BackgroundTransparency={1}
                    >
                        {/* Search Box */}
                        <textbox
                            Size={new UDim2(0, 200, 1, 0)}
                            BackgroundColor3={Color3.fromRGB(60, 60, 60)}
                            Text=""
                            PlaceholderText="🔍 Search items..."
                            TextColor3={Color3.fromRGB(255, 255, 255)}
                            PlaceholderColor3={Color3.fromRGB(150, 150, 150)}
                            TextScaled={true}
                            Font={Enum.Font.Gotham}
                            Event={{
                                FocusLost: (rbx) => setSearchQuery(rbx.Text)
                            }}
                        >
                            <uicorner CornerRadius={new UDim(0, 8)} />
                        </textbox>
                        
                        {/* Filter Buttons */}
                        {["all", "weapon", "consumable", "material", "tool"].map((filterCategory, index) => (
                            <textbutton
                                key={filterCategory}
                                Position={new UDim2(0, 220 + (index * 70), 0, 0)}
                                Size={new UDim2(0, 65, 1, 0)}
                                BackgroundColor3={
                                    filterType === filterCategory 
                                        ? Color3.fromRGB(52, 152, 219)
                                        : Color3.fromRGB(60, 60, 60)
                                }
                                Text={filterCategory}
                                TextColor3={Color3.fromRGB(255, 255, 255)}
                                TextScaled={true}
                                Font={Enum.Font.Gotham}
                                Event={{
                                    MouseButton1Click: () => setFilterType(filterCategory)
                                }}
                            >
                                <uicorner CornerRadius={new UDim(0, 6)} />
                            </textbutton>
                        ))}
                    </frame>
                    
                    {/* Inventory Grid */}
                    <scrollingframe
                        Position={new UDim2(0, 20, 0, 140)}
                        Size={new UDim2(1, -40, 1, selectedItem ? -260 : -160)}
                        BackgroundColor3={Color3.fromRGB(50, 50, 50)}
                        BorderSizePixel={0}
                        ScrollBarThickness={8}
                        CanvasSize={new UDim2(0, 0, 0, math.ceil(maxSlots / gridSize) * (DEFAULT_CONFIG.slotSize + DEFAULT_CONFIG.slotPadding))}
                    >
                        <uicorner CornerRadius={new UDim(0, 8)} />
                        
                        <frame
                            Size={new UDim2(1, -20, 1, 0)}
                            Position={new UDim2(0, 10, 0, 10)}
                            BackgroundTransparency={1}
                        >
                            <uigridlayout
                                CellSize={new UDim2(0, DEFAULT_CONFIG.slotSize, 0, DEFAULT_CONFIG.slotSize)}
                                CellPadding={new UDim2(0, DEFAULT_CONFIG.slotPadding, 0, DEFAULT_CONFIG.slotPadding)}
                                FillDirection={Enum.FillDirection.Horizontal}
                                HorizontalAlignment={Enum.HorizontalAlignment.Left}
                                VerticalAlignment={Enum.VerticalAlignment.Top}
                                SortOrder={Enum.SortOrder.LayoutOrder}
                            />
                            
                            {/* Render Inventory Slots */}
                            {filteredItems.map((slot, index) => (
                                <InventorySlot
                                    key={index}
                                    item={slot.item}
                                    slotIndex={slot.originalIndex}
                                    isSelected={selectedSlot === slot.originalIndex}
                                    isHovered={hoveredSlot === slot.originalIndex}
                                    onSlotClick={handleSlotClick}
                                    onDragStart={handleDragStart}
                                    onMouseEnter={setHoveredSlot}
                                    onMouseLeave={() => setHoveredSlot(undefined)}
                                />
                            ))}
                        </frame>
                    </scrollingframe>
                    
                    {/* Item Details Panel */}
                    {selectedItem && (
                        <ItemDetailsPanel
                            item={selectedItem}
                            onUse={handleItemUse}
                        />
                    )}
                </frame>
            </frame>
        </screengui>
    );
}