"use strict";
var core_1 = require('@angular/core');
var node_menu_service_1 = require('./node-menu.service');
var menu_events_1 = require('./menu.events');
var event_utils_1 = require('../utils/event.utils');
var NodeMenuComponent = (function () {
    function NodeMenuComponent(renderer, nodeMenuService) {
        this.renderer = renderer;
        this.nodeMenuService = nodeMenuService;
        this.menuItemSelected = new core_1.EventEmitter();
        this.availableMenuItems = [
            {
                name: 'New tag',
                action: menu_events_1.NodeMenuItemAction.NewTag,
                cssClass: 'new-tag'
            },
            {
                name: 'New folder',
                action: menu_events_1.NodeMenuItemAction.NewFolder,
                cssClass: 'new-folder'
            },
            {
                name: 'Rename',
                action: menu_events_1.NodeMenuItemAction.Rename,
                cssClass: 'rename'
            },
            {
                name: 'Remove',
                action: menu_events_1.NodeMenuItemAction.Remove,
                cssClass: 'remove'
            }
        ];
        this.disposersForGlobalListeners = [];
    }
    NodeMenuComponent.prototype.ngOnInit = function () {
        this.disposersForGlobalListeners.push(this.renderer.listenGlobal('document', 'keyup', this.closeMenu.bind(this)));
        this.disposersForGlobalListeners.push(this.renderer.listenGlobal('document', 'mousedown', this.closeMenu.bind(this)));
    };
    NodeMenuComponent.prototype.ngOnDestroy = function () {
        this.disposersForGlobalListeners.forEach(function (dispose) { return dispose(); });
    };
    NodeMenuComponent.prototype.onMenuItemSelected = function (e, selectedMenuItem) {
        if (event_utils_1.isLeftButtonClicked(e)) {
            this.menuItemSelected.emit({ nodeMenuItemAction: selectedMenuItem.action });
            this.nodeMenuService.fireMenuEvent(e.target, menu_events_1.NodeMenuAction.Close);
        }
    };
    NodeMenuComponent.prototype.closeMenu = function (e) {
        var mouseClicked = e instanceof MouseEvent;
        var containingTarget = (this.menuContainer.nativeElement !== e.target && this.menuContainer.nativeElement.contains(e.target));
        if (mouseClicked && !containingTarget || event_utils_1.isEscapePressed(e)) {
            this.nodeMenuService.fireMenuEvent(e.target, menu_events_1.NodeMenuAction.Close);
        }
    };
    NodeMenuComponent.decorators = [
        { type: core_1.Component, args: [{
                    selector: 'node-menu',
                    template: "\n    <div class=\"node-menu\">\n      <ul class=\"node-menu-content\" #menuContainer>\n        <li class=\"node-menu-item\" *ngFor=\"let menuItem of availableMenuItems\"\n          (click)=\"onMenuItemSelected($event, menuItem)\">\n          <div class=\"node-menu-item-icon {{menuItem.cssClass}}\"></div>\n          <span class=\"node-menu-item-value\">{{menuItem.name}}</span>\n        </li>\n      </ul>\n    </div>\n  "
                },] },
    ];
    NodeMenuComponent.ctorParameters = function () { return [
        { type: core_1.Renderer, decorators: [{ type: core_1.Inject, args: [core_1.Renderer,] },] },
        { type: node_menu_service_1.NodeMenuService, decorators: [{ type: core_1.Inject, args: [node_menu_service_1.NodeMenuService,] },] },
    ]; };
    NodeMenuComponent.propDecorators = {
        'menuItemSelected': [{ type: core_1.Output },],
        'menuContainer': [{ type: core_1.ViewChild, args: ['menuContainer',] },],
    };
    return NodeMenuComponent;
}());
exports.NodeMenuComponent = NodeMenuComponent;
//# sourceMappingURL=node-menu.component.js.map