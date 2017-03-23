import { EventEmitter, Renderer, OnDestroy, OnInit } from '@angular/core';
import { NodeMenuService } from './node-menu.service';
import { NodeMenuItemSelectedEvent, NodeMenuItemAction } from './menu.events';
export declare class NodeMenuComponent implements OnInit, OnDestroy {
    private renderer;
    private nodeMenuService;
    menuItemSelected: EventEmitter<NodeMenuItemSelectedEvent>;
    menuContainer: any;
    availableMenuItems: NodeMenuItem[];
    private disposersForGlobalListeners;
    constructor(renderer: Renderer, nodeMenuService: NodeMenuService);
    ngOnInit(): void;
    ngOnDestroy(): void;
    onMenuItemSelected(e: MouseEvent, selectedMenuItem: NodeMenuItem): void;
    private closeMenu(e);
}
export interface NodeMenuItem {
    name: string;
    action: NodeMenuItemAction;
    cssClass: string;
}
