"use strict";
var menu_events_1 = require('./menu/menu.events');
var TreeController = (function () {
    function TreeController(treeInternalComponent) {
        this.treeInternalComponent = treeInternalComponent;
        this.tree = this.treeInternalComponent.tree;
    }
    Object.defineProperty(TreeController.prototype, "isSelect", {
        get: function () {
            return this.treeInternalComponent.isSelected;
        },
        enumerable: true,
        configurable: true
    });
    TreeController.prototype.select = function (e) {
        if (e === void 0) { e = new MouseEvent('click'); }
        if (!this.treeInternalComponent.isSelected && typeof this.treeInternalComponent.onNodeSelected === 'function') {
            this.treeInternalComponent.onNodeSelected(e);
        }
    };
    TreeController.prototype.expand = function () {
        if (this.tree && !this.tree.isNodeExpanded()) {
            this.treeInternalComponent.onSwitchFoldingType();
        }
    };
    Object.defineProperty(TreeController.prototype, "isExpanded", {
        get: function () {
            if (this.tree) {
                return this.tree.isNodeExpanded();
            }
        },
        enumerable: true,
        configurable: true
    });
    TreeController.prototype.collapse = function () {
        if (this.tree.isNodeExpanded()) {
            this.treeInternalComponent.onSwitchFoldingType();
        }
    };
    Object.defineProperty(TreeController.prototype, "isCollapsed", {
        get: function () {
            if (this.tree) {
                return this.tree.isNodeCollapsed();
            }
        },
        enumerable: true,
        configurable: true
    });
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
    TreeController.prototype.addChild = function (newNode) {
        if (this.tree) {
            var newTree = this.tree.createNode(Boolean(newNode.children), newNode);
            this.treeInternalComponent.treeService.fireNodeCreated(newTree, null);
        }
    };
    TreeController.prototype.changeNodeId = function (id) {
        if (!id || this.treeInternalComponent.treeService.getController(id)) {
            return;
        }
        if (this.tree) {
            this.treeInternalComponent.treeService.deleteController(this.tree.node.id);
            this.tree.node.id = id;
        }
        this.treeInternalComponent.treeService.setController(id, this);
    };
    TreeController.prototype.reloadChildren = function () {
        if (this.tree) {
            this.tree.reloadChildren();
        }
    };
    TreeController.prototype.setChildren = function (children) {
        if (this.tree && !this.tree.isLeaf()) {
            this.tree.setChildren(children);
        }
    };
    return TreeController;
}());
exports.TreeController = TreeController;
//# sourceMappingURL=tree-controller.js.map