import { Service } from "@flamework/core";
import type { Collection, Document } from "@rbxts/lapis";
import { createCollection, setConfig } from "@rbxts/lapis";
import DataStoreServiceMock from "@rbxts/lapis-mockdatastore";
import type { Logger } from "@rbxts/log";
import { Players, RunService } from "@rbxts/services";

import { $NODE_ENV } from "rbxts-transform-env";
import { store } from "server/store";
import type { PlayerData as ReflexPlayerData } from "shared/store/persistent";
import { defaultPlayerData, selectPlayerData } from "shared/store/persistent";
import KickCode from "types/enum/kick-reason";

import type { PlayerData as FirebasePlayerData } from "shared/constants/player-data-model";
import { DataService as FirebaseDataService } from "../third-party/firebase-data-service";
import type { PlayerRemovalService } from "../player-core-services/player-removal-service";
import { validate } from "./validate-data";

const DATA_STORE_NAME = RunService.IsStudio() ? "Development" : "Production";

const mapReflexToFirebase = (data: ReflexPlayerData): FirebasePlayerData => ({
	coins: data.balance.currency,
	purchaseHistory: data.mtx.receiptHistory,
});

const mapFirebaseToReflex = (
	firebaseData: FirebasePlayerData,
	defaultData: ReflexPlayerData,
): ReflexPlayerData => {
	const history = firebaseData.purchaseHistory;
	return {
		...defaultData,
		balance: {
			...defaultData.balance,
			currency: firebaseData.coins,
		},
		mtx: {
			...defaultData.mtx,
			receiptHistory: history ? table.clone(history) : [],
		},
	};
};

/**
 * Service for loading and saving player data. This service is responsible for
 * loading player data when a player joins the game, and hooking up reflex data
 * changes to the player's data document in the data store.
 */
@Service({})
export class PlayerDataService {
	private readonly collection: Collection<ReflexPlayerData>;

	constructor(
		private readonly logger: Logger,
		private readonly playerRemovalService: PlayerRemovalService,
		private readonly firebaseDataService: FirebaseDataService,
	) {
		if ($NODE_ENV === "development" && RunService.IsStudio()) {
			setConfig({
				dataStoreService: new DataStoreServiceMock(),
			});
		}

		this.collection = createCollection<ReflexPlayerData>(DATA_STORE_NAME, {
			defaultData: defaultPlayerData,
			validate,
		});
	}

	/**
	 * Loads the player data for the given player.
	 *
	 * @param player - The player to load data for.
	 * @returns The player data document if it was loaded successfully.
	 */
	public async loadPlayerData(player: Player): Promise<Document<ReflexPlayerData> | void> {
		try {
			// SN: Fetch from Firebase first to ensure we have the latest data.
			const firebaseData = await this.firebaseDataService.fetchAndCachePlayerData(player);
			const reflexData = mapFirebaseToReflex(firebaseData, defaultPlayerData);
			const document = await this.collection.load(`${player.UserId}`, [player.UserId]);

			if (!player.IsDescendantOf(Players)) {
				await document.close();
				return;
			}

			// SN: Load the combined data into the store.
			store.loadPlayerData(tostring(player.UserId), reflexData);

			// SN: Subscribe to changes and write to both datastores.
			const unsubscribe = store.subscribe(selectPlayerData(tostring(player.UserId)), data => {
				if (data) {
					document.write(data);
					this.firebaseDataService.set(player, mapReflexToFirebase(data));
				}
			});

			document.beforeClose(() => {
				unsubscribe();
				store.closePlayerData(tostring(player.UserId));
			});

			return document;
		} catch (err) {
			this.logger.Warn(`Failed to load data for ${player.UserId}: ${err}`);
			this.playerRemovalService.removeForBug(player, KickCode.PlayerProfileUndefined);
		}
	}
} 