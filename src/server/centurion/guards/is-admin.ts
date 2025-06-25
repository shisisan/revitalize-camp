import type { CommandGuard } from "@rbxts/centurion";

import { DEVELOPERS, IS_STUDIO } from "shared/constants/index";

export const isAdmin: CommandGuard = context => {
	if (IS_STUDIO || DEVELOPERS.includes(context.executor.UserId)) {
		return true;
	}

	context.error("Insufficient permission.");
	return false;
};