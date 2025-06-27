import { createProducer } from "@rbxts/reflex";

export interface CharacterState {
	readonly isSprinting: boolean;
}

const initialState: CharacterState = {
	isSprinting: false,
};

export const characterSlice = createProducer(initialState, {
	startSprinting: (state): CharacterState => ({
		...state,
		isSprinting: true,
	}),
	stopSprinting: (state): CharacterState => ({
		...state,
		isSprinting: false,
	}),
}); 