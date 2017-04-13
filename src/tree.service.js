"use strict";
var tree_events_1 = require('./tree.events');
var tree_api_1 = require('./tree-api');
var Rx_1 = require('rxjs/Rx');
var core_1 = require('@angular/core');
var node_draggable_service_1 = require('./draggable/node-draggable.service');
var TreeService = (function () {
    function TreeService(nodeDraggableService) {
        this.nodeDraggableService = nodeDraggableService;
        this.nodeMoved$ = new Rx_1.Subject();
        this.nodeRemoved$ = new Rx_1.Subject();
        this.nodeRenamed$ = new Rx_1.Subject();
        this.nodeCreated$ = new Rx_1.Subject();
        this.nodeSelected$ = new Rx_1.Subject();
        this.nodeExpanded$ = new Rx_1.Subject();
        this.nodeCollapsed$ = new Rx_1.Subject();
        this.nodeRemoved$.subscribe(function (e) { return e.node.removeItselfFromParent(); });
        this.api = new tree_api_1.TreeAPI(this);
    }
    TreeService.prototype.unselectStream = function (tree) {
        return this.nodeSelected$.filter(function (e) { return tree !== e.node; });
    };
    TreeService.prototype.fireNodeRemoved = function (tree) {
        this.nodeRemoved$.next(new tree_events_1.NodeRemovedEvent(tree));
    };
    TreeService.prototype.fireNodeCreated = function (tree) {
        this.nodeCreated$.next(new tree_events_1.NodeCreatedEvent(tree));
    };
    TreeService.prototype.fireNodeSelected = function (tree) {
        this.nodeSelected$.next(new tree_events_1.NodeSelectedEvent(tree));
    };
    TreeService.prototype.fireNodeRenamed = function (oldValue, tree) {
        this.nodeRenamed$.next(new tree_events_1.NodeRenamedEvent(tree, oldValue, tree.value));
    };
    TreeService.prototype.fireNodeMoved = function (tree, parent) {
        this.nodeMoved$.next(new tree_events_1.NodeMovedEvent(tree, parent));
    };
    TreeService.prototype.fireNodeSwitchFoldingType = function (tree) {
        if (tree.isLeaf()) {
            return;
        }
        if (tree.isNodeExpanded()) {
            this.fireNodeExpanded(tree);
        }
        else {
            this.fireNodeCollapsed(tree);
        }
    };
    TreeService.prototype.fireNodeExpanded = function (tree) {
        this.nodeExpanded$.next(new tree_events_1.NodeExpandedEvent(tree));
    };
    TreeService.prototype.fireNodeCollapsed = function (tree) {
        this.nodeCollapsed$.next(new tree_events_1.NodeCollapsedEvent(tree));
    };
    TreeService.prototype.draggedStream = function (tree, element) {
        return this.nodeDraggableService.draggableNodeEvents$
            .filter(function (e) { return e.target === element; })
            .filter(function (e) { return !e.captured.tree.hasChild(tree); });
    };
    TreeService.decorators = [
        { type: core_1.Injectable },
    ];
    TreeService.ctorParameters = function () { return [
        { type: node_draggable_service_1.NodeDraggableService, decorators: [{ type: core_1.Inject, args: [node_draggable_service_1.NodeDraggableService,] },] },
    ]; };
    return TreeService;
}());
exports.TreeService = TreeService;
//# sourceMappingURL=tree.service.js.map