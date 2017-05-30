"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _map = require("lodash/map");
var _isEmpty = require("lodash/isEmpty");
var _trim = require("lodash/trim");
var _has = require("lodash/has");
var _isFunction = require("lodash/isFunction");
var _clone = require("lodash/clone");
var _merge = require("lodash/merge");
var _extend = require("lodash/extend");
var _get = require("lodash/get");
var _omit = require("lodash/omit");
var _forEach = require("lodash/forEach");
var _toString = require("lodash/toString");
var _isArray = require("lodash/isArray");
var _size = require("lodash/size");
var _indexOf = require("lodash/indexOf");
var _includes = require("lodash/includes");
var _findIndex = require("lodash/findIndex");
var _once = require("lodash/once");
var Rx_1 = require("rxjs/Rx");
var tree_types_1 = require("./tree.types");
var ChildrenLoadingState;
(function (ChildrenLoadingState) {
    ChildrenLoadingState[ChildrenLoadingState["NotStarted"] = 0] = "NotStarted";
    ChildrenLoadingState[ChildrenLoadingState["Loading"] = 1] = "Loading";
    ChildrenLoadingState[ChildrenLoadingState["Completed"] = 2] = "Completed";
})(ChildrenLoadingState || (ChildrenLoadingState = {}));
var Tree = (function () {
    /**
     * Build an instance of Tree from an object implementing TreeModel interface.
     * @param {TreeModel} model - A model that is used to build a tree.
     * @param {Tree} [parent] - An optional parent if you want to build a tree from the model that should be a child of an existing Tree instance.
     * @param {boolean} [isBranch] - An option that makes a branch from created tree. Branch can have children.
     */
    function Tree(node, parent, isBranch) {
        if (parent === void 0) { parent = null; }
        if (isBranch === void 0) { isBranch = false; }
        var _this = this;
        this._childrenLoadingState = ChildrenLoadingState.NotStarted;
        this._childrenAsyncOnce = _once(function () {
            return new Rx_1.Observable(function (observer) {
                setTimeout(function () {
                    _this._childrenLoadingState = ChildrenLoadingState.Loading;
                    _this._loadChildren(function (children) {
                        _this._children = _map(children, function (child) { return new Tree(child, _this); });
                        _this._childrenLoadingState = ChildrenLoadingState.Completed;
                        observer.next(_this.children);
                        observer.complete();
                    });
                });
            });
        });
        this.buildTreeFromModel(node, parent, isBranch || Array.isArray(node.children));
    }
    // STATIC METHODS ----------------------------------------------------------------------------------------------------
    /**
     * Check that value passed is not empty (it doesn't consist of only whitespace symbols).
     * @param {string} value - A value that should be checked.
     * @returns {boolean} - A flag indicating that value is empty or not.
     * @static
     */
    Tree.isValueEmpty = function (value) {
        return _isEmpty(_trim(value));
    };
    /**
     * Check whether a given value can be considered RenamableNode.
     * @param {any} value - A value to check.
     * @returns {boolean} - A flag indicating whether given value is Renamable node or not.
     * @static
     */
    Tree.isRenamable = function (value) {
        return (_has(value, 'setName') && _isFunction(value.setName))
            && (_has(value, 'toString') && _isFunction(value.toString) && value.toString !== Object.toString);
    };
    Tree.cloneTreeShallow = function (origin) {
        var tree = new Tree(_clone(origin.node));
        tree._children = origin._children;
        return tree;
    };
    ;
    Tree.applyNewValueToRenamable = function (value, newValue) {
        var renamableValue = _merge({}, value);
        renamableValue.setName(newValue);
        return renamableValue;
    };
    Tree.prototype.buildTreeFromModel = function (model, parent, isBranch) {
        var _this = this;
        this.parent = parent;
        this.node = _extend(_omit(model, 'children'), {
            settings: tree_types_1.TreeModelSettings.merge(model, _get(parent, 'node'))
        });
        if (_isFunction(this.node.loadChildren)) {
            this._loadChildren = this.node.loadChildren;
        }
        else {
            _forEach(_get(model, 'children'), function (child, index) {
                _this._addChild(new Tree(child, _this), index);
            });
        }
        if (!Array.isArray(this._children)) {
            this._children = this.node.loadChildren || isBranch ? [] : null;
        }
    };
    /**
     * Check whether children of the node are being loaded.
     * Makes sense only for nodes that define `loadChildren` function.
     * @returns {boolean} A flag indicating that children are being loaded.
     */
    Tree.prototype.childrenAreBeingLoaded = function () {
        return (this._childrenLoadingState === ChildrenLoadingState.Loading);
    };
    /**
     * Check whether children of the node were loaded.
     * Makes sense only for nodes that define `loadChildren` function.
     * @returns {boolean} A flag indicating that children were loaded.
     */
    Tree.prototype.childrenWereLoaded = function () {
        return (this._childrenLoadingState === ChildrenLoadingState.Completed);
    };
    Tree.prototype.canLoadChildren = function () {
        return (this._childrenLoadingState === ChildrenLoadingState.NotStarted)
            && (this.foldingType === tree_types_1.FoldingType.Expanded)
            && (!!this._loadChildren);
    };
    /**
     * Check whether children of the node should be loaded and not loaded yet.
     * Makes sense only for nodes that define `loadChildren` function.
     * @returns {boolean} A flag indicating that children should be loaded for the current node.
     */
    Tree.prototype.childrenShouldBeLoaded = function () {
        return !!this._loadChildren;
    };
    Object.defineProperty(Tree.prototype, "children", {
        /**
         * Get children of the current tree.
         * @returns {Tree[]} The children of the current tree.
         */
        get: function () {
            return this._children;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tree.prototype, "childrenAsync", {
        /**
         * By getting value from this property you start process of loading node's children using `loadChildren` function.
         * Once children are loaded `loadChildren` function won't be called anymore and loaded for the first time children are emitted in case of subsequent calls.
         * @returns {Observable<Tree[]>} An observable which emits children once they are loaded.
         */
        get: function () {
            if (this.canLoadChildren()) {
                return this._childrenAsyncOnce();
            }
            return Rx_1.Observable.of(this.children);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * By calling this method you start process of loading node's children using `loadChildren` function.
     */
    Tree.prototype.reloadChildren = function () {
        var _this = this;
        if (this.childrenShouldBeLoaded()) {
            this._childrenLoadingState = ChildrenLoadingState.Loading;
            this._loadChildren(function (children) {
                _this._children = _map(children, function (child) { return new Tree(child, _this); });
                _this._childrenLoadingState = ChildrenLoadingState.Completed;
            });
        }
    };
    /**
     * By calling this method you will remove all current children of a treee and create new.
     */
    Tree.prototype.setChildren = function (children) {
        var _this = this;
        this._children = _map(children, function (child) { return new Tree(child, _this); });
        if (this.childrenShouldBeLoaded()) {
            this._childrenLoadingState = ChildrenLoadingState.Completed;
        }
    };
    /**
     * Create a new node in the current tree.
     * @param {boolean} isBranch - A flag that indicates whether a new node should be a "Branch". "Leaf" node will be created by default
     * @param {TreeModel} model - Tree model of the new node which will be inserted. Empty node will be created by default and it will fire edit mode of this node
     * @returns {Tree} A newly created child node.
     */
    Tree.prototype.createNode = function (isBranch, model) {
        if (model === void 0) { model = { value: '' }; }
        var tree = new Tree(model, this, isBranch);
        if (!model.id) {
            tree.markAsNew();
        }
        if (this.childrenShouldBeLoaded() && !(this.childrenAreBeingLoaded() || this.childrenWereLoaded())) {
            return null;
        }
        if (this.isLeaf()) {
            return this.addSibling(tree);
        }
        else {
            return this.addChild(tree);
        }
    };
    ;
    Object.defineProperty(Tree.prototype, "value", {
        /**
         * Get the value of the current node
         * @returns {(string|RenamableNode)} The value of the node.
         */
        get: function () {
            return this.node.value;
        },
        /**
         * Set the value of the current node
         * @param {(string|RenamableNode)} value - The new value of the node.
         */
        set: function (value) {
            if (typeof value !== 'string' && !Tree.isRenamable(value)) {
                return;
            }
            if (Tree.isRenamable(this.value)) {
                var newValue = typeof value === 'string' ? value : _toString(value);
                this.node.value = Tree.applyNewValueToRenamable(this.value, newValue);
            }
            else {
                this.node.value = Tree.isValueEmpty(value) ? this.node.value : _toString(value);
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Add a sibling node for the current node. This won't work if the current node is a root.
     * @param {Tree} sibling - A node that should become a sibling.
     * @param [number] position - Position in which sibling will be inserted. By default it will be inserted at the last position in a parent.
     * @returns {Tree} A newly inserted sibling, or null if you are trying to make a sibling for the root.
     */
    Tree.prototype.addSibling = function (sibling, position) {
        if (_isArray(_get(this.parent, 'children'))) {
            return this.parent.addChild(sibling, position);
        }
        return null;
    };
    /**
     * Add a child node for the current node.
     * @param {Tree} child - A node that should become a child.
     * @param [number] position - Position in which child will be inserted. By default it will be inserted at the last position in a parent.
     * @returns {Tree} A newly inserted child.
     */
    Tree.prototype.addChild = function (child, position) {
        return this._addChild(Tree.cloneTreeShallow(child), position);
    };
    Tree.prototype._addChild = function (child, position) {
        if (position === void 0) { position = _size(this._children) || 0; }
        child.parent = this;
        if (Array.isArray(this._children)) {
            this._children.splice(position, 0, child);
        }
        else {
            this._children = [child];
        }
        this._setFoldingType();
        if (this.isNodeCollapsed()) {
            this.switchFoldingType();
        }
        return child;
    };
    /**
     * Swap position of the current node with the given sibling. If node passed as a parameter is not a sibling - nothing happens.
     * @param {Tree} sibling - A sibling with which current node shold be swapped.
     */
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
        /**
         * Get a node's position in its parent.
         * @returns {number} The position inside a parent.
         */
        get: function () {
            return _indexOf(this.parent.children, this);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Check whether or not this tree is static.
     * @returns {boolean} A flag indicating whether or not this tree is static.
     */
    Tree.prototype.isStatic = function () {
        return _get(this.node.settings, 'static', false);
    };
    /**
     * Check whether or not this tree has a left menu.
     * @returns {boolean} A flag indicating whether or not this tree has a left menu.
     */
    Tree.prototype.hasLeftMenu = function () {
        return !_get(this.node.settings, 'static', false) && _get(this.node.settings, 'leftMenu', false);
    };
    /**
     * Check whether or not this tree has a right menu.
     * @returns {boolean} A flag indicating whether or not this tree has a right menu.
     */
    Tree.prototype.hasRightMenu = function () {
        return !_get(this.node.settings, 'static', false) && _get(this.node.settings, 'rightMenu', false);
    };
    /**
     * Get custom menu function from node's settings
     * @returns {Function} A function which should be called when menu is opened.
     */
    Tree.prototype.getMenuCustomFunction = function () {
        return _get(this.node.settings, 'menu', null);
    };
    /**
     * Check whether or not this node in a tree can be draged.
     * @returns {boolean} A flag indicating whether or not this node is dragable.
     */
    Tree.prototype.isDragable = function () {
        return _get(this.node.settings, 'dragable', false);
    };
    /**
     * Check whether this tree is "Leaf" or not.
     * @returns {boolean} A flag indicating whether or not this tree is a "Leaf".
     */
    Tree.prototype.isLeaf = function () {
        return !this.isBranch();
    };
    /**
     * Check whether this tree is "Branch" or not. "Branch" is a node that has children.
     * @returns {boolean} A flag indicating whether or not this tree is a "Branch".
     */
    Tree.prototype.isBranch = function () {
        return Array.isArray(this._children);
    };
    /**
     * Check whether this tree has children.
     * @returns {boolean} A flag indicating whether or not this tree has children.
     */
    Tree.prototype.hasChildren = function () {
        return !_isEmpty(this._children) || this.childrenShouldBeLoaded();
    };
    /**
     * Check whether this tree is a root or not. The root is the tree (node) that doesn't have parent (or technically its parent is null).
     * @returns {boolean} A flag indicating whether or not this tree is the root.
     */
    Tree.prototype.isRoot = function () {
        return this.parent === null;
    };
    /**
     * Check whether provided tree is a sibling of the current tree. Sibling trees (nodes) are the trees that have the same parent.
     * @param {Tree} tree - A tree that should be tested on a siblingness.
     * @returns {boolean} A flag indicating whether or not provided tree is the sibling of the current one.
     */
    Tree.prototype.hasSibling = function (tree) {
        return !this.isRoot() && _includes(this.parent.children, tree);
    };
    /**
     * Check whether provided tree is a child of the current tree.
     * This method tests that provided tree is a <strong>direct</strong> child of the current tree.
     * @param {Tree} tree - A tree that should be tested (child candidate).
     * @returns {boolean} A flag indicating whether provided tree is a child or not.
     */
    Tree.prototype.hasChild = function (tree) {
        return _includes(this._children, tree);
    };
    /**
     * Remove given tree from the current tree.
     * The given tree will be removed only in case it is a direct child of the current tree (@see {@link hasChild}).
     * @param {Tree} tree - A tree that should be removed.
     */
    Tree.prototype.removeChild = function (tree) {
        var childIndex = _findIndex(this._children, function (child) { return child === tree; });
        if (childIndex >= 0) {
            this._children.splice(childIndex, 1);
        }
        this._setFoldingType();
    };
    /**
     * Remove current tree from its parent.
     */
    Tree.prototype.removeItselfFromParent = function () {
        if (!this.parent) {
            return;
        }
        this.parent.removeChild(this);
    };
    /**
     * Switch folding type of the current tree. "Leaf" node cannot switch its folding type cause it doesn't have children, hence nothing to fold.
     * If node is a "Branch" and it is expanded, then by invoking current method state of the tree should be switched to "collapsed" and vice versa.
     */
    Tree.prototype.switchFoldingType = function () {
        if (this.isLeaf() || !this.hasChildren()) {
            return;
        }
        this.node._foldingType = this.isNodeExpanded() ? tree_types_1.FoldingType.Collapsed : tree_types_1.FoldingType.Expanded;
    };
    /**
     * Check that tree is expanded.
     * @returns {boolean} A flag indicating whether current tree is expanded. Always returns false for the "Leaf" tree and for an empty tree.
     */
    Tree.prototype.isNodeExpanded = function () {
        return this.foldingType === tree_types_1.FoldingType.Expanded;
    };
    /**
     * Check that tree is collapsed.
     * @returns {boolean} A flag indicating whether current tree is collapsed. Always returns false for the "Leaf" tree and for an empty tree.
     */
    Tree.prototype.isNodeCollapsed = function () {
        return this.foldingType === tree_types_1.FoldingType.Collapsed;
    };
    /**
     * Set a current folding type: expanded, collapsed or leaf.
     */
    Tree.prototype._setFoldingType = function () {
        if (this.childrenShouldBeLoaded()) {
            this.node._foldingType = tree_types_1.FoldingType.Collapsed;
        }
        else if (this._children && !_isEmpty(this._children)) {
            this.node._foldingType = tree_types_1.FoldingType.Expanded;
        }
        else if (Array.isArray(this._children)) {
            this.node._foldingType = tree_types_1.FoldingType.Empty;
        }
        else {
            this.node._foldingType = tree_types_1.FoldingType.Leaf;
        }
    };
    Object.defineProperty(Tree.prototype, "foldingType", {
        /**
         * Get a current folding type: expanded, collapsed or leaf.
         * @returns {FoldingType} A folding type of the current tree.
         */
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
        /**
         * Get a css class for element which displayes folding state - expanded, collapsed or leaf
         * @returns {string} A string icontaining css class (classes)
         */
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
            return _get(this.node.settings, 'cssClasses.collapsed', null);
        }
        else if (this.node._foldingType === tree_types_1.FoldingType.Expanded) {
            return _get(this.node.settings, 'cssClasses.expanded', null);
        }
        else if (this.node._foldingType === tree_types_1.FoldingType.Empty) {
            return _get(this.node.settings, 'cssClasses.empty', null);
        }
        return _get(this.node.settings, 'cssClasses.leaf', null);
    };
    Object.defineProperty(Tree.prototype, "nodeTemplate", {
        /**
         * Get a html template to render before every node's name.
         * @returns {string} A string representing a html template.
         */
        get: function () {
            return this.getTemplateFromSettings();
        },
        enumerable: true,
        configurable: true
    });
    Tree.prototype.getTemplateFromSettings = function () {
        if (this.isLeaf()) {
            return _get(this.node.settings, 'templates.leaf', '');
        }
        else {
            return _get(this.node.settings, 'templates.node', '');
        }
    };
    Object.defineProperty(Tree.prototype, "leftMenuTemplate", {
        /**
         * Get a html template to render for an element activatin left menu of a node.
         * @returns {string} A string representing a html template.
         */
        get: function () {
            if (this.hasLeftMenu()) {
                return _get(this.node.settings, 'templates.leftMenu', '<span></span>');
            }
            return '';
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Check that current tree is newly created (added by user via menu for example). Tree that was built from the TreeModel is not marked as new.
     * @returns {boolean} A flag whether the tree is new.
     */
    Tree.prototype.isNew = function () {
        return this.node._status === tree_types_1.TreeStatus.New;
    };
    /**
     * Mark current tree as new (@see {@link isNew}).
     */
    Tree.prototype.markAsNew = function () {
        this.node._status = tree_types_1.TreeStatus.New;
    };
    /**
     * Check that current tree is being renamed (it is in the process of its value renaming initiated by a user).
     * @returns {boolean} A flag whether the tree is being renamed.
     */
    Tree.prototype.isBeingRenamed = function () {
        return this.node._status === tree_types_1.TreeStatus.IsBeingRenamed;
    };
    /**
     * Mark current tree as being renamed (@see {@link isBeingRenamed}).
     */
    Tree.prototype.markAsBeingRenamed = function () {
        this.node._status = tree_types_1.TreeStatus.IsBeingRenamed;
    };
    /**
     * Check that current tree is modified (for example it was renamed).
     * @returns {boolean} A flag whether the tree is modified.
     */
    Tree.prototype.isModified = function () {
        return this.node._status === tree_types_1.TreeStatus.Modified;
    };
    /**
     * Mark current tree as modified (@see {@link isModified}).
     */
    Tree.prototype.markAsModified = function () {
        this.node._status = tree_types_1.TreeStatus.Modified;
    };
    return Tree;
}());
exports.Tree = Tree;
//# sourceMappingURL=tree.js.map