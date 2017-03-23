"use strict";
var _ = require('lodash');
var rxjs_1 = require('rxjs');
var tree_types_1 = require('./tree.types');
var ChildrenLoadingState;
(function (ChildrenLoadingState) {
    ChildrenLoadingState[ChildrenLoadingState["NotStarted"] = 0] = "NotStarted";
    ChildrenLoadingState[ChildrenLoadingState["Loading"] = 1] = "Loading";
    ChildrenLoadingState[ChildrenLoadingState["Completed"] = 2] = "Completed";
})(ChildrenLoadingState || (ChildrenLoadingState = {}));
var Tree = (function () {
    function Tree(node, parent, isBranch) {
        if (parent === void 0) { parent = null; }
        if (isBranch === void 0) { isBranch = false; }
        this._childrenLoadingState = ChildrenLoadingState.NotStarted;
        this.buildTreeFromModel(node, parent, isBranch);
    }
    Tree.prototype.buildTreeFromModel = function (model, parent, isBranch) {
        var _this = this;
        this.parent = parent;
        this.node = _.extend(_.omit(model, 'children'), {
            settings: tree_types_1.TreeModelSettings.merge(model, _.get(parent, 'node'))
        });
        if (_.isFunction(this.node.loadChildren)) {
            this._loadChildren = this.node.loadChildren;
        }
        else {
            _.forEach(_.get(model, 'children'), function (child, index) {
                _this._addChild(new Tree(child, _this), index);
            });
        }
        if (!Array.isArray(this._children)) {
            this._children = this.node.loadChildren || isBranch ? [] : null;
        }
    };
    Tree.prototype.childrenAreBeingLoaded = function () {
        return (this._childrenLoadingState === ChildrenLoadingState.Loading);
    };
    Tree.prototype.canLoadChildren = function () {
        return (this._childrenLoadingState === ChildrenLoadingState.NotStarted)
            && (this.foldingType === tree_types_1.FoldingType.Expanded)
            && (!!this._loadChildren);
    };
    Tree.prototype.childrenShouldBeLoaded = function () {
        return !!this._loadChildren;
    };
    Object.defineProperty(Tree.prototype, "children", {
        get: function () {
            return this._children;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tree.prototype, "childrenAsync", {
        get: function () {
            var _this = this;
            if (this.canLoadChildren()) {
                setTimeout(function () { return _this._childrenLoadingState = ChildrenLoadingState.Loading; });
                return new rxjs_1.Observable(function (observer) {
                    _this._loadChildren(function (children) {
                        _this._children = _.map(children, function (child) { return new Tree(child, _this); });
                        _this._childrenLoadingState = ChildrenLoadingState.Completed;
                        observer.next(_this.children);
                        observer.complete();
                    });
                });
            }
            return rxjs_1.Observable.of(this.children);
        },
        enumerable: true,
        configurable: true
    });
    Tree.prototype.createNode = function (isBranch) {
        var tree = new Tree({ value: '' }, null, isBranch);
        tree.markAsNew();
        if (this.isLeaf()) {
            return this.addSibling(tree);
        }
        else {
            return this.addChild(tree);
        }
    };
    ;
    Object.defineProperty(Tree.prototype, "value", {
        get: function () {
            return this.node.value;
        },
        set: function (value) {
            if (typeof value !== 'string' && !Tree.isRenamable(value)) {
                return;
            }
            if (Tree.isRenamable(this.value)) {
                var newValue = typeof value === 'string' ? value : _.toString(value);
                this.node.value = Tree.applyNewValueToRenamable(this.value, newValue);
            }
            else {
                this.node.value = Tree.isValueEmpty(value) ? this.node.value : _.toString(value);
            }
        },
        enumerable: true,
        configurable: true
    });
    Tree.prototype.addSibling = function (sibling, position) {
        if (_.isArray(_.get(this.parent, 'children'))) {
            return this.parent.addChild(sibling, position);
        }
        return null;
    };
    Tree.prototype.addChild = function (child, position) {
        return this._addChild(Tree.cloneTreeShallow(child), position);
    };
    Tree.prototype._addChild = function (child, position) {
        if (position === void 0) { position = _.size(this._children) || 0; }
        child.parent = this;
        if (Array.isArray(this._children)) {
            this._children.splice(position, 0, child);
        }
        else {
            this._children = [child];
        }
        return child;
    };
    Tree.prototype.swapWithSibling = function (sibling) {
        if (!this.hasSibling(sibling)) {
            return;
        }
        var siblingIndex = sibling.positionInParent;
        var thisTreeIndex = this.positionInParent;
        this.parent._children[siblingIndex] = this;
        this.parent._children[thisTreeIndex] = sibling;
    };
    Object.defineProperty(Tree.prototype, "positionInParent", {
        get: function () {
            return _.indexOf(this.parent.children, this);
        },
        enumerable: true,
        configurable: true
    });
    Tree.prototype.isStatic = function () {
        return _.get(this.node.settings, 'static', false);
    };
    Tree.prototype.hasLeftMenu = function () {
        return !_.get(this.node.settings, 'static', false) && _.get(this.node.settings, 'leftMenu', false);
    };
    Tree.prototype.hasRightMenu = function () {
        return !_.get(this.node.settings, 'static', false) && _.get(this.node.settings, 'rightMenu', false);
    };
    Tree.prototype.isLeaf = function () {
        return !this.isBranch();
    };
    Tree.prototype.isBranch = function () {
        return Array.isArray(this._children);
    };
    Tree.prototype.isRoot = function () {
        return this.parent === null;
    };
    Tree.prototype.hasSibling = function (tree) {
        return !this.isRoot() && _.includes(this.parent.children, tree);
    };
    Tree.prototype.hasChild = function (tree) {
        return _.includes(this._children, tree);
    };
    Tree.prototype.removeChild = function (tree) {
        var childIndex = _.findIndex(this._children, function (child) { return child === tree; });
        if (childIndex >= 0) {
            this._children.splice(childIndex, 1);
        }
    };
    Tree.prototype.removeItselfFromParent = function () {
        if (!this.parent) {
            return;
        }
        this.parent.removeChild(this);
    };
    Tree.prototype.switchFoldingType = function () {
        if (this.isLeaf()) {
            return;
        }
        this.node._foldingType = this.isNodeExpanded() ? tree_types_1.FoldingType.Collapsed : tree_types_1.FoldingType.Expanded;
    };
    Tree.prototype.isNodeExpanded = function () {
        return this.foldingType === tree_types_1.FoldingType.Expanded;
    };
    Tree.prototype._setFoldingType = function () {
        if (this.childrenShouldBeLoaded()) {
            this.node._foldingType = tree_types_1.FoldingType.Collapsed;
        }
        else if (this._children) {
            this.node._foldingType = tree_types_1.FoldingType.Expanded;
        }
        else {
            this.node._foldingType = tree_types_1.FoldingType.Leaf;
        }
    };
    Object.defineProperty(Tree.prototype, "foldingType", {
        get: function () {
            if (!this.node._foldingType) {
                this._setFoldingType();
            }
            return this.node._foldingType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tree.prototype, "foldingCssClass", {
        get: function () {
            return this.getCssClassesFromSettings() || this.foldingType.cssClass;
        },
        enumerable: true,
        configurable: true
    });
    Tree.prototype.getCssClassesFromSettings = function () {
        if (!this.node._foldingType) {
            this._setFoldingType();
        }
        if (this.node._foldingType === tree_types_1.FoldingType.Collapsed) {
            return _.get(this.node.settings, 'cssClasses.collapsed', null);
        }
        else if (this.node._foldingType === tree_types_1.FoldingType.Expanded) {
            return _.get(this.node.settings, 'cssClasses.expanded', null);
        }
        return _.get(this.node.settings, 'cssClasses.leaf', null);
    };
    Object.defineProperty(Tree.prototype, "nodeTemplate", {
        get: function () {
            return this.getTemplateFromSettings();
        },
        enumerable: true,
        configurable: true
    });
    Tree.prototype.getTemplateFromSettings = function () {
        if (this.isLeaf()) {
            return _.get(this.node.settings, 'templates.leaf', '');
        }
        else {
            return _.get(this.node.settings, 'templates.node', '');
        }
    };
    Object.defineProperty(Tree.prototype, "leftMenuTemplate", {
        get: function () {
            if (this.hasLeftMenu()) {
                return _.get(this.node.settings, 'templates.leftMenu', '<span></span>');
            }
            return '';
        },
        enumerable: true,
        configurable: true
    });
    Tree.prototype.isNew = function () {
        return this.node._status === tree_types_1.TreeStatus.New;
    };
    Tree.prototype.markAsNew = function () {
        this.node._status = tree_types_1.TreeStatus.New;
    };
    Tree.prototype.isBeingRenamed = function () {
        return this.node._status === tree_types_1.TreeStatus.IsBeingRenamed;
    };
    Tree.prototype.markAsBeingRenamed = function () {
        this.node._status = tree_types_1.TreeStatus.IsBeingRenamed;
    };
    Tree.prototype.isModified = function () {
        return this.node._status === tree_types_1.TreeStatus.Modified;
    };
    Tree.prototype.markAsModified = function () {
        this.node._status = tree_types_1.TreeStatus.Modified;
    };
    Tree.isValueEmpty = function (value) {
        return _.isEmpty(_.trim(value));
    };
    Tree.isRenamable = function (value) {
        return (_.has(value, 'setName') && _.isFunction(value.setName))
            && (_.has(value, 'toString') && _.isFunction(value.toString) && value.toString !== Object.toString);
    };
    Tree.cloneTreeShallow = function (origin) {
        var tree = new Tree(_.clone(origin.node));
        tree._children = origin._children;
        return tree;
    };
    ;
    Tree.applyNewValueToRenamable = function (value, newValue) {
        var renamableValue = _.merge({}, value);
        renamableValue.setName(newValue);
        return renamableValue;
    };
    return Tree;
}());
exports.Tree = Tree;
//# sourceMappingURL=tree.js.map