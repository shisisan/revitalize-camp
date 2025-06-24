import React, { useEffect, useState, useCallback } from '@rbxts/react';
import { Players, RunService } from '@rbxts/services';

interface PlayerHealthBarProps {
    showPlayerName?: boolean;
    barColor?: Color3;
    backgroundColor?: Color3;
    cornerRadius?: number;
    position?: UDim2;
    size?: UDim2;
}

export function PlayerHealthBar({
    showPlayerName = true,
    barColor = Color3.fromRGB(46, 204, 113),
    backgroundColor = Color3.fromRGB(52, 73, 94),
    cornerRadius = 8,
    position = new UDim2(0, 20, 0, 20),
    size = new UDim2(0, 300, 0, 60),
}: PlayerHealthBarProps): React.ReactNode {
    const [health, setHealth] = useState(100);
    const [maxHealth, setMaxHealth] = useState(100);
    const [playerName, setPlayerName] = useState('');
    const [isAlive, setIsAlive] = useState(true);

    // Get player reference
    const player = Players.LocalPlayer;

    // Update health values
    const updateHealthData = useCallback(() => {
        if (player.Character) {
            const humanoid = player.Character.FindFirstChild('Humanoid') as Humanoid;
            if (humanoid) {
                setHealth(humanoid.Health);
                setMaxHealth(humanoid.MaxHealth);
                setIsAlive(humanoid.Health > 0);
            }
        }
        setPlayerName(player.DisplayName || player.Name);
    }, [player]);

    // Setup health monitoring
    useEffect(() => {
        let connection: RBXScriptConnection | undefined;

        const setupHealthMonitoring = () => {
            if (player.Character) {
                const humanoid = player.Character.FindFirstChild('Humanoid') as Humanoid;
                if (humanoid) {
                    // Initial update
                    updateHealthData();

                    // Listen for health changes
                    connection = humanoid.HealthChanged.Connect(() => {
                        updateHealthData();
                    });
                }
            }
        };

        // Setup immediately if character exists
        setupHealthMonitoring();

        // Listen for character respawn
        const characterConnection = player.CharacterAdded.Connect(() => {
            // Small delay to ensure humanoid is loaded
            task.wait(0.1);
            setupHealthMonitoring();
        });

        return () => {
            if (connection) {
                connection.Disconnect();
            }
            characterConnection.Disconnect();
        };
    }, [player, updateHealthData]);

    // Calculate health percentage
    const healthPercentage = maxHealth > 0 ? health / maxHealth : 0;

    // Dynamic color based on health
    const getDynamicHealthColor = useCallback(() => {
        if (healthPercentage > 0.6) {
            return Color3.fromRGB(46, 204, 113); // Green
        } else if (healthPercentage > 0.3) {
            return Color3.fromRGB(241, 196, 15); // Yellow
        } else {
            return Color3.fromRGB(231, 76, 60); // Red
        }
    }, [healthPercentage]);

    return (
        <frame
            Position={position}
            Size={size}
            BackgroundColor3={backgroundColor}
            BorderSizePixel={0}
        >
            {/* Corner Radius */}
            <uicorner CornerRadius={new UDim(0, cornerRadius)} />

            {/* Player Name (Optional) */}
            {showPlayerName && (
                <textlabel
                    Position={new UDim2(0, 10, 0, 0)}
                    Size={new UDim2(1, -20, 0, 20)}
                    BackgroundTransparency={1}
                    Text={playerName}
                    TextColor3={Color3.fromRGB(255, 255, 255)}
                    TextScaled={true}
                    TextXAlignment={Enum.TextXAlignment.Left}
                    Font={Enum.Font.GothamBold}
                />
            )}

            {/* Health Bar Container */}
            <frame
                Position={showPlayerName ? new UDim2(0, 10, 0, 25) : new UDim2(0, 10, 0, 10)}
                Size={showPlayerName ? new UDim2(1, -20, 0, 20) : new UDim2(1, -20, 1, -20)}
                BackgroundColor3={Color3.fromRGB(0, 0, 0)}
                BackgroundTransparency={0.3}
                BorderSizePixel={0}
            >
                <uicorner CornerRadius={new UDim(0, 4)} />

                {/* Health Bar Fill */}
                <frame
                    Position={new UDim2(0, 2, 0, 2)}
                    Size={new UDim2(healthPercentage, -4, 1, -4)}
                    BackgroundColor3={getDynamicHealthColor()}
                    BorderSizePixel={0}
                >
                    <uicorner CornerRadius={new UDim(0, 2)} />

                    {/* Health Bar Glow Effect */}
                    {isAlive && (
                        <frame
                            Size={new UDim2(1, 0, 1, 0)}
                            BackgroundColor3={getDynamicHealthColor()}
                            BackgroundTransparency={0.7}
                            BorderSizePixel={0}
                        >
                            <uicorner CornerRadius={new UDim(0, 2)} />
                        </frame>
                    )}
                </frame>

                {/* Health Text */}
                <textlabel
                    Size={new UDim2(1, 0, 1, 0)}
                    BackgroundTransparency={1}
                    Text={`${math.floor(health)}/${math.floor(maxHealth)}`}
                    TextColor3={Color3.fromRGB(255, 255, 255)}
                    TextScaled={true}
                    Font={Enum.Font.Gotham}
                    TextStrokeTransparency={0.5}
                    TextStrokeColor3={Color3.fromRGB(0, 0, 0)}
                />
            </frame>

            {/* Death Overlay */}
            {!isAlive && (
                <frame
                    Size={new UDim2(1, 0, 1, 0)}
                    BackgroundColor3={Color3.fromRGB(0, 0, 0)}
                    BackgroundTransparency={0.5}
                    BorderSizePixel={0}
                >
                    <uicorner CornerRadius={new UDim(0, cornerRadius)} />
                    <textlabel
                        Size={new UDim2(1, 0, 1, 0)}
                        BackgroundTransparency={1}
                        Text="WASTED"
                        TextColor3={Color3.fromRGB(231, 76, 60)}
                        TextScaled={true}
                        Font={Enum.Font.GothamBold}
                        TextStrokeTransparency={0}
                        TextStrokeColor3={Color3.fromRGB(0, 0, 0)}
                    />
                </frame>
            )}
        </frame>
    );
}
