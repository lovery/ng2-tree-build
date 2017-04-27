"use strict";
var TreeController = (function () {
    function TreeController(treeInternalComponent) {
        this.treeInternalComponent = treeInternalComponent;
    }
    TreeController.prototype.select = function (e) {
        if (e === void 0) { e = new MouseEvent('click'); }
        if (this.treeInternalComponent && !this.treeInternalComponent.isSelected && typeof this.treeInternalComponent.onNodeSelected === 'function') {
            this.treeInternalComponent.onNodeSelected(e);
        }
    };
    TreeController.prototype.switchFoldingType = function () {
        if (this.treeInternalComponent && typeof this.treeInternalComponent.onSwitchFoldingType === 'function') {
            this.treeInternalComponent.onSwitchFoldingType();
        }
    };
    TreeController.prototype.expand = function () {
        if (this.treeInternalComponent && this.treeInternalComponent.tree) {
            if (!this.treeInternalComponent.tree.isNodeExpanded()) {
                this.switchFoldingType();
            }
        }
    };
    TreeController.prototype.collapse = function () {
        if (this.treeInternalComponent && this.treeInternalComponent.tree) {
            if (this.treeInternalComponent.tree.isNodeExpanded()) {
                this.switchFoldingType();
            }
        }
    };
    TreeController.prototype.rename = function (newValue) {
        if (this.treeInternalComponent && this.treeInternalComponent.tree) {
            this.treeInternalComponent.tree.markAsBeingRenamed();
            this.treeInternalComponent.tree.value = newValue;
        }
    };
    TreeController.prototype.reloadChildren = function () {
    };
    return TreeController;
}());
exports.TreeController = TreeController;
//# sourceMappingURL=tree-controller.js.map