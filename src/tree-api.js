"use strict";
var TreeAPI = (function () {
    function TreeAPI(treeService) {
        this.treeService = treeService;
        this.components = {};
        this.idCounter = 1;
    }
    TreeAPI.prototype.push = function (treeInternalComponent) {
        if (!treeInternalComponent.tree.node.id) {
            treeInternalComponent.tree.node.id = this.idCounter;
            this.idCounter++;
        }
        this.components[treeInternalComponent.tree.node.id] = treeInternalComponent;
    };
    TreeAPI.prototype.select = function (id, e) {
        if (e === void 0) { e = new MouseEvent('click'); }
        var tree = this._findTree(id);
        if (tree && typeof tree['onNodeSelected'] === 'function') {
            tree['onNodeSelected'](e);
        }
    };
    TreeAPI.prototype.switchFoldingType = function (id) {
        var tree = this._findTree(id);
        if (tree && typeof tree['onSwitchFoldingType'] === 'function') {
            tree['onSwitchFoldingType']();
        }
    };
    TreeAPI.prototype._findTree = function (id) {
        return this.components[id];
    };
    return TreeAPI;
}());
exports.TreeAPI = TreeAPI;
//# sourceMappingURL=tree-api.js.map