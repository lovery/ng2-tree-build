"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var Rx_1 = require("rxjs/Rx");
var menu_events_1 = require("./menu.events");
var NodeMenuService = (function () {
    function NodeMenuService() {
        this.nodeMenuEvents$ = new Rx_1.Subject();
    }
    NodeMenuService.prototype.fireMenuEvent = function (sender, action) {
        var nodeMenuEvent = { sender: sender, action: action };
        this.nodeMenuEvents$.next(nodeMenuEvent);
    };
    NodeMenuService.prototype.hideMenuStream = function (treeElementRef) {
        return this.nodeMenuEvents$
            .filter(function (e) { return treeElementRef.nativeElement !== e.sender; })
            .filter(function (e) { return e.action === menu_events_1.NodeMenuAction.Close; });
    };
    NodeMenuService.prototype.hideMenuForAllNodesExcept = function (treeElementRef) {
        this.nodeMenuEvents$.next({
            sender: treeElementRef.nativeElement,
            action: menu_events_1.NodeMenuAction.Close
        });
    };
    return NodeMenuService;
}());
NodeMenuService.decorators = [
    { type: core_1.Injectable },
];
/** @nocollapse */
NodeMenuService.ctorParameters = function () { return []; };
exports.NodeMenuService = NodeMenuService;
//# sourceMappingURL=node-menu.service.js.map