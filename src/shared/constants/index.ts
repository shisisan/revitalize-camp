import { RunService } from '@rbxts/services';

export const GAME_NAME = 'Revitalize Camp';

export const IS_EDIT = RunService.IsStudio() && !RunService.IsRunning();
