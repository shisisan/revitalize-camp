import { Networking } from '@flamework/networking';
import type { BroadcastAction } from '@rbxts/reflex';

import type { GamePass } from 'types/enum/mtx';

import type { SerializedSharedState } from './store';
import { PlayerData } from './constants/player-data-model';
import { createBinarySerializer } from '@rbxts/flamework-binary-serializer';

type SerializedRemote = (packet: SerializedPacket) => void;

/** Fired by client to server.

 * Defines the set of events that can be sent from the client to the server.
 *
 * @property mtx - Events related to monetization transactions, such as setting the active state of a game pass.
 * @property store - Events related to the client store, such as signaling readiness to receive data.
 * @property data - Events for data synchronization, including when data is loaded or updated.
 */
interface ClientToServerEvents {
    mtx: {
        /**
         * Sets the active state of a game pass, which is used to determine if a
         * game pass is "on" for a player. E.g. If a player has a game pass for
         * toggling increased walk speed, this would be used to turn that on or
         * off.
         *
         * @param gamePass - The game pass to set the active state of.
         * @param active - The active state to set the game pass to.
         */
        setGamePassActive: (gamePass: GamePass, active: boolean) => void;
    };
    store: {
        /**
         * Called by the client when they are ready to receive data from the
         * server.
         */
        start: () => void;
    };
    data: {
        /**
         * Initializes the client with the initial player data.
         */
        initialize: () => void;
    };
}

/** Fired by server to client. */
interface ServerToClientEvents {
    store: {
        /**
         * Sends state updates to the client.
         *
         * @param actions - The actions to send to the client.
         */
        dispatch: (actions: Array<BroadcastAction>) => void;
        hydrate: (state: SerializedSharedState) => void;
    };
    data: {
        /**
         * The `data` namespace contains remotes related to serialized data transfer between the client and server.
         *
         * @property loaded - Remote event triggered when the initial serialized data has been loaded and sent to the client.
         * @property updated - Remote event triggered when the serialized data has been updated and needs to be sent to the client.
         */
        loaded: SerializedRemote;
        updated: SerializedRemote;
    };
}

type ClientToServerFunctions = object;

export const Serializers = {
    playerData: createBinarySerializer<PlayerData>(),
};
export const GlobalEvents = Networking.createEvent<ClientToServerEvents, ServerToClientEvents>();
export const GlobalFunctions = Networking.createFunction<
    ClientToServerFunctions,
    NonNullable<unknown>
>();
