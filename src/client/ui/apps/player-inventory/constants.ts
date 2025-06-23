export const RARITY_COLORS = {
    common: Color3.fromRGB(157, 157, 157),
    rare: Color3.fromRGB(30, 144, 255),
    epic: Color3.fromRGB(147, 112, 219),
    legendary: Color3.fromRGB(255, 215, 0),
} as const;

export const UI_COLORS = {
    background: Color3.fromRGB(40, 40, 40),
    titleBar: Color3.fromRGB(30, 30, 30),
    slot: Color3.fromRGB(60, 60, 60),
    slotHover: Color3.fromRGB(70, 70, 70),
    slotSelected: Color3.fromRGB(52, 152, 219),
    detailsPanel: Color3.fromRGB(30, 30, 30),
    closeButton: Color3.fromRGB(231, 76, 60),
    useButton: Color3.fromRGB(46, 204, 113),
    filterActive: Color3.fromRGB(52, 152, 219),
    filterInactive: Color3.fromRGB(60, 60, 60),
} as const;

export const DEFAULT_CONFIG = {
    maxSlots: 20,
    gridSize: 4,
    slotSize: 70,
    slotPadding: 5,
    panelWidth: 600,
    panelHeight: 500,
} as const;