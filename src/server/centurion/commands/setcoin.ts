import type { CommandContext } from "@rbxts/centurion";
import { CenturionType, Command, Guard, Register } from "@rbxts/centurion";

import { isAdmin } from "server/centurion/guards/is-admin";
import { LeaderstatsService } from "server/services/player-core-services/leaderstats-service";
import { store } from "server/store";

@Register()
@Guard(isAdmin)
export class SetCoinCommand {
	constructor(private readonly leaderstatsService: LeaderstatsService) {}

	@Command({
		name: "setcoin",
		description: "Set coin for a player",
		arguments: [
			{
				name: "player",
				description: "Player to set",
				type: CenturionType.Player,
			},
			{
				name: "amount",
				description: "Amount of coins to set",
				type: CenturionType.Number,
			},
		],
	})
	setcoin(ctx: CommandContext, player: Player, amount: number) {
		store.setBalance(tostring(player.UserId), amount);
		this.leaderstatsService.forceRefreshPlayer(player);
		ctx.reply(`Set ${player.Name}'s coins to ${amount}`);
	}
}
