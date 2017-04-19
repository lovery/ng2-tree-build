"use strict";
var tree_1 = require('./tree');
var TreeInternalAPI = (function () {
    function TreeInternalAPI(treeInternalComponent) {
        this.treeInternalComponent = treeInternalComponent;
    }
    TreeInternalAPI.prototype.select = function (e) {
        if (e === void 0) { e = new MouseEvent('click'); }
        if (this.treeInternalComponent && !this.treeInternalComponent['isSelected'] && typeof this.treeInternalComponent['onNodeSelected'] === 'function') {
            this.treeInternalComponent['onNodeSelected'](e);
        }
    };
    TreeInternalAPI.prototype.switchFoldingType = function () {
        if (this.treeInternalComponent && typeof this.treeInternalComponent['onSwitchFoldingType'] === 'function') {
            this.treeInternalComponent['onSwitchFoldingType']();
        }
    };
    TreeInternalAPI.prototype.expand = function () {
        if (this.treeInternalComponent && this.treeInternalComponent['tree'] instanceof tree_1.Tree) {
            if (!this.treeInternalComponent['tree']['isNodeExpanded'].call(this.treeInternalComponent['tree'])) {
                this.switchFoldingType();
            }
        }
    };
    TreeInternalAPI.prototype.collapse = function () {
        if (this.treeInternalComponent && this.treeInternalComponent['tree'] instanceof tree_1.Tree) {
            if (this.treeInternalComponent['tree']['isNodeExpanded'].call(this.treeInternalComponent['tree'])) {
                this.switchFoldingType();
            }
        }
    };
    TreeInternalAPI.prototype.rename = function (newValue) {
        if (this.treeInternalComponent && this.treeInternalComponent['tree'] instanceof tree_1.Tree) {
            this.treeInternalComponent['tree']['value'] = newValue;
        }
    };
    TreeInternalAPI.prototype.reloadChildren = function () {
    };
    return TreeInternalAPI;
}());
exports.TreeInternalAPI = TreeInternalAPI;
//# sourceMappingURL=tree-internal-api.js.map