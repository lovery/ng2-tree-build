"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var tree_1 = require("./tree");
var tree_controller_1 = require("./tree-controller");
var node_menu_service_1 = require("./menu/node-menu.service");
var menu_events_1 = require("./menu/menu.events");
var editable_events_1 = require("./editable/editable.events");
var tree_service_1 = require("./tree.service");
var EventUtils = require("./utils/event.utils");
var _get = require("lodash/get");
var TreeInternalComponent = (function () {
    function TreeInternalComponent(nodeMenuService, treeService, element) {
        this.nodeMenuService = nodeMenuService;
        this.treeService = treeService;
        this.element = element;
        this.isSelected = false;
        this.isActive = false;
        this.isRightMenuVisible = false;
        this.isLeftMenuVisible = false;
    }
    TreeInternalComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.controller = new tree_controller_1.TreeController(this);
        if (_get(this.tree, 'node.id', '')) {
            this.treeService.setController(this.tree.node.id, this.controller);
        }
        this.settings = this.settings || { rootIsVisible: true };
        this.nodeMenuService.hideMenuStream(this.element)
            .subscribe(function () {
            _this.isRightMenuVisible = false;
            _this.isLeftMenuVisible = false;
            _this.isActive = false;
        });
        this.treeService.unselectStream(this.tree)
            .subscribe(function () { return _this.isSelected = false; });
        this.treeService.deactivateStream(this.tree)
            .subscribe(function () { return _this.isActive = false; });
        this.treeService.draggedStream(this.tree, this.element)
            .subscribe(function (e) {
            if (_this.tree.hasSibling(e.captured.tree)) {
                _this.swapWithSibling(e.captured.tree, _this.tree);
            }
            else if (_this.tree.isBranch()) {
                _this.moveNodeToThisTreeAndRemoveFromPreviousOne(e, _this.tree);
            }
            else {
                _this.moveNodeToParentTreeAndRemoveFromPreviousOne(e, _this.tree);
            }
        });
    };
    TreeInternalComponent.prototype.ngOnDestroy = function () {
        if (_get(this.tree, 'node.id', '')) {
            this.treeService.deleteController(this.tree.node.id);
        }
    };
    TreeInternalComponent.prototype.swapWithSibling = function (sibling, tree) {
        tree.swapWithSibling(sibling);
        this.treeService.fireNodeMoved(sibling, sibling.parent);
    };
    TreeInternalComponent.prototype.moveNodeToThisTreeAndRemoveFromPreviousOne = function (e, tree) {
        this.treeService.fireNodeRemoved(e.captured.tree);
        var addedChild = tree.addChild(e.captured.tree);
        this.treeService.fireNodeMoved(addedChild, e.captured.tree.parent);
    };
    TreeInternalComponent.prototype.moveNodeToParentTreeAndRemoveFromPreviousOne = function (e, tree) {
        this.treeService.fireNodeRemoved(e.captured.tree);
        var addedSibling = tree.addSibling(e.captured.tree, tree.positionInParent);
        this.treeService.fireNodeMoved(addedSibling, e.captured.tree.parent);
    };
    TreeInternalComponent.prototype.onNodeSelected = function (e) {
        if (EventUtils.isLeftButtonClicked(e)) {
            this.isSelected = true;
            this.treeService.fireNodeSelected(this.tree);
            this.onNodeActivated(e);
        }
    };
    TreeInternalComponent.prototype.onNodeActivated = function (e) {
        this.isActive = true;
        this.treeService.fireNodeActivated(this.tree);
    };
    TreeInternalComponent.prototype.showRightMenu = function (e) {
        if (!this.tree.hasRightMenu()) {
            return;
        }
        if (EventUtils.isRightButtonClicked(e)) {
            var menu = this.tree.getMenuCustomFunction();
            if (menu && typeof menu === 'function') {
                menu(e, this.tree.node);
            }
            else {
                this.isRightMenuVisible = !this.isRightMenuVisible;
            }
            this.nodeMenuService.hideMenuForAllNodesExcept(this.element);
            this.onNodeActivated(e);
        }
        e.preventDefault();
    };
    TreeInternalComponent.prototype.showLeftMenu = function (e) {
        if (!this.tree.hasLeftMenu()) {
            return;
        }
        if (EventUtils.isLeftButtonClicked(e)) {
            var menu = this.tree.getMenuCustomFunction();
            if (menu && typeof menu === 'function') {
                menu(e, this.tree.node);
            }
            else {
                this.isLeftMenuVisible = !this.isLeftMenuVisible;
                if (this.isLeftMenuVisible) {
                    e.preventDefault();
                }
            }
            this.nodeMenuService.hideMenuForAllNodesExcept(this.element);
            this.onNodeActivated(e);
        }
    };
    TreeInternalComponent.prototype.onMenuItemSelected = function (e) {
        switch (e.nodeMenuItemAction) {
            case menu_events_1.NodeMenuItemAction.NewTag:
                this.onNewSelected(e);
                break;
            case menu_events_1.NodeMenuItemAction.NewFolder:
                this.onNewSelected(e);
                break;
            case menu_events_1.NodeMenuItemAction.Rename:
                this.onRenameSelected();
                break;
            case menu_events_1.NodeMenuItemAction.Remove:
                this.onRemoveSelected();
                break;
            default:
                throw new Error("Chosen menu item doesn't exist");
        }
    };
    TreeInternalComponent.prototype.onNewSelected = function (e) {
        this.tree.createNode(e.nodeMenuItemAction === menu_events_1.NodeMenuItemAction.NewFolder);
        this.isRightMenuVisible = false;
        this.isLeftMenuVisible = false;
    };
    TreeInternalComponent.prototype.onRenameSelected = function () {
        this.tree.markAsBeingRenamed();
        this.isRightMenuVisible = false;
        this.isLeftMenuVisible = false;
    };
    TreeInternalComponent.prototype.onRemoveSelected = function () {
        this.treeService.deleteController(_get(this.tree, 'node.id', ''));
        this.treeService.fireNodeRemoved(this.tree);
    };
    TreeInternalComponent.prototype.onSwitchFoldingType = function () {
        this.tree.switchFoldingType();
        this.treeService.fireNodeSwitchFoldingType(this.tree);
    };
    TreeInternalComponent.prototype.applyNewValue = function (e) {
        if ((e.action === editable_events_1.NodeEditableEventAction.Cancel || this.tree.isNew()) && tree_1.Tree.isValueEmpty(e.value)) {
            return this.treeService.fireNodeRemoved(this.tree);
        }
        if (this.tree.isNew()) {
            this.tree.value = e.value;
            this.treeService.fireNodeCreated(this.tree, this.controller);
        }
        if (this.tree.isBeingRenamed()) {
            var oldValue = this.tree.value;
            this.tree.value = e.value;
            this.treeService.fireNodeRenamed(oldValue, this.tree);
        }
        this.tree.markAsModified();
    };
    TreeInternalComponent.prototype.shouldShowInputForTreeValue = function () {
        return this.tree.isNew() || this.tree.isBeingRenamed();
    };
    TreeInternalComponent.prototype.isRootHidden = function () {
        return this.tree.isRoot() && !this.settings.rootIsVisible;
    };
    return TreeInternalComponent;
}());
TreeInternalComponent.decorators = [
    { type: core_1.Component, args: [{
                selector: 'tree-internal',
                template: "\n  <ul class=\"tree\" *ngIf=\"tree\" [ngClass]=\"{rootless: isRootHidden()}\">\n    <li>\n      <div class=\"value-container\"\n        [ngClass]=\"{rootless: isRootHidden(), active: isActive}\"\n        [class.selected]=\"isSelected\"\n        (contextmenu)=\"showRightMenu($event)\"\n        [nodeDraggable]=\"element\"\n        [tree]=\"tree\">\n\n        <div class=\"folding\" (click)=\"onSwitchFoldingType()\" [ngClass]=\"tree.foldingCssClass\"></div>\n        <div class=\"node-value\"\n          *ngIf=\"!shouldShowInputForTreeValue()\"\n          [class.node-selected]=\"isSelected\"\n          (click)=\"onNodeSelected($event)\">\n            <div *ngIf=\"tree.nodeTemplate\" class=\"node-template\" [innerHTML]=\"tree.nodeTemplate | safeHtml\"></div>\n            <span class=\"node-name\" [innerHTML]=\"tree.value | safeHtml\"></span>\n            <span class=\"loading-children\" *ngIf=\"tree.childrenAreBeingLoaded()\"></span>\n        </div>\n\n        <input type=\"text\" class=\"node-value\"\n           *ngIf=\"shouldShowInputForTreeValue()\"\n           [nodeEditable]=\"tree.value\"\n           (valueChanged)=\"applyNewValue($event)\"/>\n\n        <div class=\"node-left-menu\" *ngIf=\"tree.hasLeftMenu()\" (click)=\"showLeftMenu($event)\" [innerHTML]=\"tree.leftMenuTemplate\">\n        </div>\n        <node-menu *ngIf=\"tree.hasLeftMenu() && isLeftMenuVisible\"\n          (menuItemSelected)=\"onMenuItemSelected($event)\">\n        </node-menu>\n      </div>\n\n      <node-menu *ngIf=\"isRightMenuVisible\" (menuItemSelected)=\"onMenuItemSelected($event)\"></node-menu>\n\n      <ng-template [ngIf]=\"tree.isNodeExpanded()\">\n        <tree-internal *ngFor=\"let child of tree.childrenAsync | async\" [tree]=\"child\"></tree-internal>\n      </ng-template>\n    </li>\n  </ul>\n  "
            },] },
];
/** @nocollapse */
TreeInternalComponent.ctorParameters = function () { return [
    { type: node_menu_service_1.NodeMenuService, decorators: [{ type: core_1.Inject, args: [node_menu_service_1.NodeMenuService,] },] },
    { type: tree_service_1.TreeService, decorators: [{ type: core_1.Inject, args: [tree_service_1.TreeService,] },] },
    { type: core_1.ElementRef, decorators: [{ type: core_1.Inject, args: [core_1.ElementRef,] },] },
]; };
TreeInternalComponent.propDecorators = {
    'tree': [{ type: core_1.Input },],
    'settings': [{ type: core_1.Input },],
};
exports.TreeInternalComponent = TreeInternalComponent;
//# sourceMappingURL=tree-internal.component.js.map