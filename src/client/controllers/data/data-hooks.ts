import { PlayerData } from "shared/constants/player-data-model";

export interface OnDataUpdate {
  onDataUpdate(data: PlayerData): void;
}

export interface OnDataLoad {
  onDataLoad(data: PlayerData): void;
}