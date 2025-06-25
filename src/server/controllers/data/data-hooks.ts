import { PlayerData } from "shared/constants/player-data-model";

export interface OnDataUpdate {
    onDataUpdate(player: Player, data: PlayerData): void;
}

export interface OnDataLoad {
    onDataLoad(player: Player, data: PlayerData): void;
}
