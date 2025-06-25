import { RunService } from '@rbxts/services';
import Signal from '@rbxts/rbx-better-signal';

import { $NODE_ENV } from "rbxts-transform-env";

export const GAME_NAME = 'Revitalize Camp';

export const FlameworkIgnited = new Signal();

/** Array of userIds from the developers. */
export const DEVELOPERS = [game.CreatorId];

export const IS_DEV = $NODE_ENV === "development";
/** Indicates whether the current environment is running in Roblox Studio. */
export const IS_STUDIO = RunService.IsStudio();
/** Indicates where the current environment is studio and not running. */
export const IS_EDIT = RunService.IsStudio() && !RunService.IsRunning();
/** Indicates whether the current environment is running on the client. */
export const IS_CLIENT = RunService.IsClient();