import React, { useCallback } from "@rbxts/react";

import { Button, Layer } from "./components/primitive";

export function App(): React.ReactNode {
	return (
		<screengui
			IgnoreGuiInset
			ResetOnSpawn={false}
			ZIndexBehavior={Enum.ZIndexBehavior.Sibling}
		>
			<Button
			CornerRadius={new UDim(0, 8)}
				Native={{ Size: new UDim2(0, 100, 0, 100) }}
				onClick={useCallback(() => {
					print("Hello World!");
				}, [])}
			/>
			
		</screengui>
	);
}
