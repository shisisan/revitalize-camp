import React, { useCallback } from '@rbxts/react';
import ReactRoblox from '@rbxts/react-roblox';
import { InferProps } from '@rbxts/ui-labs/src/Typing/Typing';
import { Button } from './components';

const controls = {
    Visible: true,
    Color: Color3.fromRGB(255, 255, 255),
    Text: 'Button Text',
};

const story = {
    react: React,
    reactRoblox: ReactRoblox,
    controls: controls,
    story: (props: InferProps<typeof controls>) => {},
};

export = story;
