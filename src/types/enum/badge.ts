import { GameId, getConfigValueForGame } from "shared/functions/game-config";

export const Badge = {
	Welcome: getConfigValueForGame({
		[GameId.Development]: "2213792712395980",
		[GameId.Production]: "2213792712395980",
	}),
} as const;

export type Badge = ValueOf<typeof Badge>;
