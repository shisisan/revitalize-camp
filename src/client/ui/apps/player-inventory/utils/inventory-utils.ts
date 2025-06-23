import { RARITY_COLORS } from "../constants";
import { InventoryItem } from "../types";

export const getRarityColor = (rarity: InventoryItem["rarity"]) => {
    return RARITY_COLORS[rarity];
};

export const getItemTypeEmoji = (itemType: InventoryItem["type"]) => {
    const typeEmojis = {
        weapon: "⚔️",
        consumable: "🧪",
        material: "📦",
        tool: "🔧",
    };
    return typeEmojis[itemType] || "❓";
};

export const formatItemValue = (value: number): string => {
    if (value >= 1000) {
        return `${string.format("%.1f", value / 1000)}K`;
    }
    return tostring(value);
};