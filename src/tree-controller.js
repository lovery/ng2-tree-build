"use strict";
var menu_events_1 = require('./menu/menu.events');
var TreeController = (function () {
    function TreeController(treeInternalComponent) {
        this.treeInternalComponent = treeInternalComponent;
        this.tree = this.treeInternalComponent.tree;
    }
    TreeController.prototype.select = function (e) {
        if (e === void 0) { e = new MouseEvent('click'); }
        if (!this.treeInternalComponent.isSelected && typeof this.treeInternalComponent.onNodeSelected === 'function') {
            this.treeInternalComponent.onNodeSelected(e);
        }
    };
    TreeController.prototype.expand = function () {
        if (!this.tree.isNodeExpanded()) {
            this.treeInternalComponent.onSwitchFoldingType();
        }
    };
    TreeController.prototype.collapse = function () {
        if (this.tree.isNodeExpanded()) {
            this.treeInternalComponent.onSwitchFoldingType();
        }
    };
    TreeController.prototype.rename = function (newValue) {
        if (this.tree) {
            this.tree.markAsBeingRenamed();
            var nodeEditableEvent = { type: 'keyup', value: newValue };
            this.treeInternalComponent.applyNewValue(nodeEditableEvent);
        }
    };
    TreeController.prototype.remove = function () {
        if (typeof this.treeInternalComponent.onMenuItemSelected === 'function') {
            this.treeInternalComponent.onMenuItemSelected({ nodeMenuItemAction: menu_events_1.NodeMenuItemAction.Remove });
        }
    };
    TreeController.prototype.reloadChildren = function () {
    };
    return TreeController;
}());
exports.TreeController = TreeController;
//# sourceMappingURL=tree-controller.js.map