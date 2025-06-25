import type { OnInit } from '@flamework/core';
import { Service } from '@flamework/core';
import type { Logger } from '@rbxts/log';
import { t } from '@rbxts/t';
import { RunService } from '@rbxts/services';

import { PlayerData } from 'shared/constants/player-data-model';
import { selectPlayerData } from 'shared/store/persistent';

import { store } from 'server/store';
import type { PlayerEntity } from './player-entity';
import type { OnPlayerJoin, OnPlayerLeave } from './player-service';
import { DataService } from '../third-party/firebase-data-service';

interface LeaderstatValueTypes {
    IntValue: number;
    StringValue: string;
}

interface LeaderstatEntry<T extends keyof LeaderstatValueTypes = keyof LeaderstatValueTypes> {
    Name: Leaderstats;
    PlayerDataKey?: NestedKeyOf<PlayerData>;
    ValueType: T;
}

type Leaderstats = 'Coins' | 'Example2';

type LeaderstatValue = Instances[keyof LeaderstatValueTypes];

/**
 * A service that initializes the Roblox leaderboard stats for the game.
 * Fixed version with proper timing handling for Firebase data loading.
 */
@Service({})
export class LeaderstatsService implements OnInit, OnPlayerJoin, OnPlayerLeave {
    private readonly leaderstats = new Array<LeaderstatEntry>();
    private readonly playerToLeaderstatsMap = new Map<Player, Folder>();
    private readonly playerToValueMap = new Map<Player, Map<string, LeaderstatValue>>();
    private readonly pendingPlayers = new Set<Player>(); // Track players waiting for data

    constructor(private readonly logger: Logger, private readonly dataService: DataService) {}

    /** @ignore */
    public onInit(): void {
        this.logger.Info('Initializing LeaderstatsService...');

        this.registerStat('Coins', 'IntValue', 'coins');

        // Listen to DataService events
        this.dataService.loaded.Connect((player, data) => {
            this.logger.Info(`✅ DataService loaded for ${player.Name}`);
            this.logger.Info(`Data: ${tostring(data)}`);
            this.onPlayerDataLoaded(player, data);
        });

        this.dataService.updated.Connect((player, data) => {
            this.logger.Info(`🔄 DataService updated for ${player.Name}`);
            this.onPlayerDataUpdated(player, data);
        });

        this.logger.Info('LeaderstatsService initialized');
    }

    /**
     * Called when player joins - setup leaderstats with retry mechanism
     */
    public onPlayerJoin(player: PlayerEntity): void {
        this.logger.Info(`🎮 Player ${player.name} joined, setting up leaderstats...`);

        // Add to pending players
        this.pendingPlayers.add(player.player);

        // Try to get existing data first
        const existingData = this.dataService.get(player.player);
        if (existingData) {
            this.logger.Info(`✅ Found existing data for ${player.name}`);
            this.onPlayerDataLoaded(player.player, existingData);
            return;
        }

        // If no existing data, setup with defaults and wait for Firebase
        this.logger.Info(`⏳ No existing data for ${player.name}, setting up with defaults...`);
        this.setupDefaultLeaderstats(player.player);

        // Start retry mechanism for data loading
        this.retryDataLoading(player.player);
    }

    /**
     * Setup default leaderstats while waiting for Firebase data
     */
    private setupDefaultLeaderstats(player: Player): void {
        // Don't setup again if already exists
        if (this.playerToLeaderstatsMap.has(player)) {
            return;
        }

        this.logger.Info(`🔧 Setting up default leaderstats for ${player.Name}`);

        const leaderstats = new Instance('Folder');
        leaderstats.Name = 'leaderstats';
        leaderstats.Parent = player;

        this.playerToLeaderstatsMap.set(player, leaderstats);

        const valueMap = new Map<Leaderstats, LeaderstatValue>();

        for (const entry of this.leaderstats) {
            const stat = new Instance(entry.ValueType);
            stat.Name = entry.Name;
            stat.Parent = leaderstats;
            valueMap.set(entry.Name, stat);

            // Set default value
            stat.Value = entry.ValueType === 'IntValue' ? 0 : 'Loading...';
            this.logger.Info(`📊 Created ${entry.Name} with default value`);
        }

        this.playerToValueMap.set(player, valueMap);
    }

    /**
     * Retry mechanism to load data from Firebase
     */
    private retryDataLoading(player: Player, attempts: number = 0): void {
        const maxAttempts = 10; // Max 10 attempts (20 seconds)
        const retryDelay = 2; // 2 seconds between attempts

        if (attempts >= maxAttempts) {
            this.logger.Warn(
                `❌ Failed to load data for ${player.Name} after ${maxAttempts} attempts`
            );
            this.pendingPlayers.delete(player);
            return;
        }

        // Check if player is still in game
        if (!player.Parent) {
            this.logger.Info(`👋 Player ${player.Name} left during data loading`);
            this.pendingPlayers.delete(player);
            return;
        }

        this.logger.Info(`🔄 Retry ${attempts + 1}/${maxAttempts} for ${player.Name}`);

        // Try to get data
        const playerData = this.dataService.get(player);
        if (playerData) {
            this.logger.Info(`✅ Got data on retry ${attempts + 1} for ${player.Name}`);
            this.onPlayerDataLoaded(player, playerData);
            return;
        }

        // Schedule next retry
        wait(retryDelay);
        this.retryDataLoading(player, attempts + 1);
    }

    /**
     * Called when player data is loaded from DataService
     */
    private onPlayerDataLoaded(player: Player, playerData: PlayerData): void {
        this.logger.Info(`📥 Processing loaded data for ${player.Name}`);
        this.logger.Info(`Data structure: ${tostring(playerData)}`);

        // Remove from pending
        this.pendingPlayers.delete(player);

        // Setup leaderstats if not already done
        if (!this.playerToLeaderstatsMap.has(player)) {
            this.setupDefaultLeaderstats(player);
        }

        // Update values with real data
        const valueMap = this.playerToValueMap.get(player);
        if (!valueMap) {
            this.logger.Warn(`❌ No value map found for ${player.Name}`);
            return;
        }

        for (const entry of this.leaderstats) {
            if (entry.PlayerDataKey === undefined) {
                continue;
            }

            const stat = valueMap.get(entry.Name);
            if (!stat) {
                continue;
            }

            const dataValue = this.getPlayerDataValue(playerData, entry.PlayerDataKey);
            const oldValue = stat.Value;
            stat.Value = dataValue;

            this.logger.Info(`📊 Updated ${entry.Name}: ${oldValue} → ${dataValue}`);
        }

        this.logger.Info(`✅ Leaderstats setup complete for ${player.Name}`);
    }

    /**
     * Called when player data is updated in DataService
     */
    private onPlayerDataUpdated(player: Player, playerData: PlayerData): void {
        this.logger.Info(`🔄 Updating leaderstats for ${player.Name}`);

        if (!this.playerToLeaderstatsMap.has(player)) {
            this.logger.Info(`Leaderstats not found for ${player.Name} on update, initializing...`);
            this.setupDefaultLeaderstats(player);
        }

        const valueMap = this.playerToValueMap.get(player);
        if (!valueMap) {
            this.logger.Warn(`❌ No value map found for ${player.Name}, skipping update`);
            return;
        }

        // Update all leaderstats with new data
        for (const entry of this.leaderstats) {
            if (entry.PlayerDataKey === undefined) {
                continue;
            }

            const stat = valueMap.get(entry.Name);
            if (!stat) {
                continue;
            }

            const oldValue = stat.Value;
            const newValue = this.getPlayerDataValue(playerData, entry.PlayerDataKey);
            stat.Value = newValue;

            this.logger.Info(`📊 Updated ${entry.Name}: ${oldValue} → ${newValue}`);
        }
    }

    /** @ignore */
    public onPlayerLeave({ player }: PlayerEntity): void {
        // Remove from pending
        this.pendingPlayers.delete(player);

        const valueMap = this.playerToValueMap.get(player);
        if (valueMap !== undefined) {
            for (const [, value] of valueMap) {
                value.Destroy();
            }
        }

        this.playerToValueMap.delete(player);

        // Destroy leaderstats on leave
        const leaderstats = this.playerToLeaderstatsMap.get(player);
        if (leaderstats !== undefined) {
            leaderstats.Destroy();
        }

        this.playerToLeaderstatsMap.delete(player);

        this.logger.Info(`🧹 Cleaned up leaderstats for ${player.Name}`);
    }

    /**
     * Force refresh data for a player
     */
    public forceRefreshPlayer(player: Player): void {
        this.logger.Info(`🔄 Force refreshing data for ${player.Name}`);

        // Try to get fresh data
        const playerData = this.dataService.get(player);
        if (playerData) {
            this.onPlayerDataLoaded(player, playerData);
        } else {
            this.logger.Warn(`❌ No data available for force refresh of ${player.Name}`);
            // Add back to pending and retry
            this.pendingPlayers.add(player);
            this.retryDataLoading(player);
        }
    }

    /**
     * Debug method to check current status
     */
    public debugPlayer(player: Player): void {
        this.logger.Info(`🔍 DEBUG INFO FOR ${player.Name}`);
        this.logger.Info(`Has leaderstats: ${this.playerToLeaderstatsMap.has(player)}`);
        this.logger.Info(`Has value map: ${this.playerToValueMap.has(player)}`);
        this.logger.Info(`Is pending: ${this.pendingPlayers.has(player)}`);

        const playerData = this.dataService.get(player);
        this.logger.Info(`DataService has data: ${playerData !== undefined}`);

        if (playerData) {
            this.logger.Info(`Data: ${tostring(playerData)}`);
            const coinsValue = this.getPlayerDataValue(playerData, 'coins');
            this.logger.Info(`Coins value: ${coinsValue}`);
        }

        // Show current leaderstat values
        const valueMap = this.playerToValueMap.get(player);
        if (valueMap) {
            for (const [name, stat] of valueMap) {
                this.logger.Info(`Current ${name}: ${stat.Value}`);
            }
        }
    }

    /**
     * Returns a given stat object for a player
     */
    public getStatObject(player: Player, statName: Leaderstats): LeaderstatValue | undefined {
        const valueMap = this.playerToValueMap.get(player);
        if (!valueMap) {
            return;
        }

        return valueMap.get(statName);
    }

    /**
     * Manually update a specific stat for a player
     */
    public updatePlayerStat(player: Player, statName: Leaderstats, value: number | string): void {
        const stat = this.getStatObject(player, statName);
        if (stat) {
            stat.Value = value;
            this.logger.Info(`✏️ Manually updated ${statName} to ${value} for ${player.Name}`);
        }
    }

    /**
     * Registers a new stat to the leaderboard
     */
    private registerStat(
        statName: Leaderstats,
        valueType: keyof LeaderstatValueTypes,
        playerDataKey?: NestedKeyOf<PlayerData>
    ): void {
        assert(
            this.leaderstats.find((entry) => entry.Name === statName) === undefined,
            'Stat provided already exists.'
        );

        this.leaderstats.push({
            Name: statName,
            PlayerDataKey: playerDataKey,
            ValueType: valueType,
        });

        this.logger.Info(`📝 Registered stat: ${statName} → ${playerDataKey || 'no key'}`);
    }

    /**
     * Gets the value of a nested key from the player's data
     */
    private getPlayerDataValue(
        playerData: PlayerData,
        nestedKey: NestedKeyOf<PlayerData>
    ): ValueOf<LeaderstatValueTypes> {
        this.logger.Info(`🔍 Getting value for key: ${nestedKey}`);

        const keys = nestedKey.split('.');
        let value: unknown = playerData;

        for (let i = 0; i < keys.size(); i++) {
            const key = keys[i];

            if (
                key !== undefined &&
                value &&
                typeIs(value, 'table') &&
                key in (value as Record<string, unknown>)
            ) {
                value = (value as Record<string, unknown>)[key];
                this.logger.Info(`✅ Found ${key}: ${tostring(value)}`);
            } else {
                this.logger.Warn(`❌ Key '${key}' not found in: ${tostring(value)}`);
                return 0;
            }
        }

        if (t.number(value) || t.string(value)) {
            this.logger.Info(`✅ Final value for ${nestedKey}: ${value}`);
            return value;
        }

        this.logger.Warn(`❌ Invalid value type for ${nestedKey}: ${tostring(value)}`);
        return 0;
    }
}
