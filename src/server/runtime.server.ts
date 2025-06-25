import { Flamework, Modding } from '@flamework/core';
import type { Logger } from '@rbxts/log';
import Log from '@rbxts/log';

import { GAME_NAME } from 'shared/constants/index';
import { setupLogger } from 'shared/functions/setup-logger';
import { startCenturion } from './centurion/centurion-start';

function start(): void {
    setupLogger();

    Log.Info(`${GAME_NAME} is starting up! Version: ${game.PlaceVersion}`);

    Modding.registerDependency<Logger>((ctor) => Log.ForContext(ctor));

    Flamework.addPaths('src/server');

    Log.Info('Flamework ignite!');
    Flamework.ignite();

    Log.Info("Starting Centurion...");
	startCenturion().catch(err => {
		Log.Fatal(`Error while running centurion: ${err}`);
	});
}

start();
