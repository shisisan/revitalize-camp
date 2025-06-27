import type { OnStart } from '@flamework/core';
import { Controller } from '@flamework/core';
import type { Logger } from '@rbxts/log';
import { Icon } from '@rbxts/topbar-plus';
import { store } from 'client/store';

@Controller({})
export class TopbarController implements OnStart {
    constructor(private readonly logger: Logger) {}

    /** @ignore */
    public onStart(): void {
        this.logger.Debug('TopbarController started');
        this.initInventoryIcon();
    }

    private initInventoryIcon(): void {
        new Icon()
            .setImage('rbxassetid://109683391106182')
            .setName('Open Backpack')
            .align('Right')
            .bindEvent('deselected', () => {
                store.openInventory();
                this.logger.Debug('Inventory icon deselected');
            })
            .bindEvent('selected', () => {
                store.closeInventory();
                this.logger.Debug('Inventory icon selected');
                // Open the inventory UI here
                // Example: store.openInventory();
            });
    }
}
