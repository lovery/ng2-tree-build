import { Observable } from 'rxjs/Rx';
import { TreeModel, RenamableNode, FoldingType } from './tree.types';
export declare class Tree {
    private _children;
    private _loadChildren;
    private _childrenLoadingState;
    private _childrenAsyncOnce;
    node: TreeModel;
    parent: Tree;
    /**
     * Check that value passed is not empty (it doesn't consist of only whitespace symbols).
     * @param {string} value - A value that should be checked.
     * @returns {boolean} - A flag indicating that value is empty or not.
     * @static
     */
    static isValueEmpty(value: string): boolean;
    /**
     * Check whether a given value can be considered RenamableNode.
     * @param {any} value - A value to check.
     * @returns {boolean} - A flag indicating whether given value is Renamable node or not.
     * @static
     */
    static isRenamable(value: any): value is RenamableNode;
    private static cloneTreeShallow(origin);
    private static applyNewValueToRenamable(value, newValue);
    /**
     * Build an instance of Tree from an object implementing TreeModel interface.
     * @param {TreeModel} model - A model that is used to build a tree.
     * @param {Tree} [parent] - An optional parent if you want to build a tree from the model that should be a child of an existing Tree instance.
     * @param {boolean} [isBranch] - An option that makes a branch from created tree. Branch can have children.
     */
    constructor(node: TreeModel, parent?: Tree, isBranch?: boolean);
    private buildTreeFromModel(model, parent, isBranch);
    /**
     * Check whether children of the node are being loaded.
     * Makes sense only for nodes that define `loadChildren` function.
     * @returns {boolean} A flag indicating that children are being loaded.
     */
    childrenAreBeingLoaded(): boolean;
    /**
     * Check whether children of the node were loaded.
     * Makes sense only for nodes that define `loadChildren` function.
     * @returns {boolean} A flag indicating that children were loaded.
     */
    childrenWereLoaded(): boolean;
    private canLoadChildren();
    /**
     * Check whether children of the node should be loaded and not loaded yet.
     * Makes sense only for nodes that define `loadChildren` function.
     * @returns {boolean} A flag indicating that children should be loaded for the current node.
     */
    childrenShouldBeLoaded(): boolean;
    /**
     * Get children of the current tree.
     * @returns {Tree[]} The children of the current tree.
     */
    readonly children: Tree[];
    /**
     * By getting value from this property you start process of loading node's children using `loadChildren` function.
     * Once children are loaded `loadChildren` function won't be called anymore and loaded for the first time children are emitted in case of subsequent calls.
     * @returns {Observable<Tree[]>} An observable which emits children once they are loaded.
     */
    readonly childrenAsync: Observable<Tree[]>;
    /**
     * By calling this method you start process of loading node's children using `loadChildren` function.
     */
    reloadChildren(): void;
    /**
     * By calling this method you will remove all current children of a treee and create new.
     */
    setChildren(children: Array<TreeModel>): void;
    /**
     * Create a new node in the current tree.
     * @param {boolean} isBranch - A flag that indicates whether a new node should be a "Branch". "Leaf" node will be created by default
     * @param {TreeModel} model - Tree model of the new node which will be inserted. Empty node will be created by default and it will fire edit mode of this node
     * @returns {Tree} A newly created child node.
     */
    createNode(isBranch: boolean, model?: TreeModel): Tree;
    /**
     * Get the value of the current node
     * @returns {(string|RenamableNode)} The value of the node.
     */
    /**
     * Set the value of the current node
     * @param {(string|RenamableNode)} value - The new value of the node.
     */
    value: any;
    /**
     * Add a sibling node for the current node. This won't work if the current node is a root.
     * @param {Tree} sibling - A node that should become a sibling.
     * @param [number] position - Position in which sibling will be inserted. By default it will be inserted at the last position in a parent.
     * @returns {Tree} A newly inserted sibling, or null if you are trying to make a sibling for the root.
     */
    addSibling(sibling: Tree, position?: number): Tree;
    /**
     * Add a child node for the current node.
     * @param {Tree} child - A node that should become a child.
     * @param [number] position - Position in which child will be inserted. By default it will be inserted at the last position in a parent.
     * @returns {Tree} A newly inserted child.
     */
    addChild(child: Tree, position?: number): Tree;
    private _addChild(child, position?);
    /**
     * Swap position of the current node with the given sibling. If node passed as a parameter is not a sibling - nothing happens.
     * @param {Tree} sibling - A sibling with which current node shold be swapped.
     */
    swapWithSibling(sibling: Tree): void;
    /**
     * Get a node's position in its parent.
     * @returns {number} The position inside a parent.
     */
    readonly positionInParent: number;
    /**
     * Check whether or not this tree is static.
     * @returns {boolean} A flag indicating whether or not this tree is static.
     */
    isStatic(): boolean;
    /**
     * Check whether or not this tree has a left menu.
     * @returns {boolean} A flag indicating whether or not this tree has a left menu.
     */
    hasLeftMenu(): boolean;
    /**
     * Check whether or not this tree has a right menu.
     * @returns {boolean} A flag indicating whether or not this tree has a right menu.
     */
    hasRightMenu(): boolean;
    /**
     * Check whether or not this node in a tree can be draged.
     * @returns {boolean} A flag indicating whether or not this node is dragable.
     */
    isDragable(): boolean;
    getMenuCustomFunction(): Function;
    /**
     * Check whether this tree is "Leaf" or not.
     * @returns {boolean} A flag indicating whether or not this tree is a "Leaf".
     */
    isLeaf(): boolean;
    /**
     * Check whether this tree is "Branch" or not. "Branch" is a node that has children.
     * @returns {boolean} A flag indicating whether or not this tree is a "Branch".
     */
    isBranch(): boolean;
    /**
     * Check whether this tree has children.
     * @returns {boolean} A flag indicating whether or not this tree has children.
     */
    hasChildren(): boolean;
    /**
     * Check whether this tree is a root or not. The root is the tree (node) that doesn't have parent (or technically its parent is null).
     * @returns {boolean} A flag indicating whether or not this tree is the root.
     */
    isRoot(): boolean;
    /**
     * Check whether provided tree is a sibling of the current tree. Sibling trees (nodes) are the trees that have the same parent.
     * @param {Tree} tree - A tree that should be tested on a siblingness.
     * @returns {boolean} A flag indicating whether or not provided tree is the sibling of the current one.
     */
    hasSibling(tree: Tree): boolean;
    /**
     * Check whether provided tree is a child of the current tree.
     * This method tests that provided tree is a <strong>direct</strong> child of the current tree.
     * @param {Tree} tree - A tree that should be tested (child candidate).
     * @returns {boolean} A flag indicating whether provided tree is a child or not.
     */
    hasChild(tree: Tree): boolean;
    /**
     * Remove given tree from the current tree.
     * The given tree will be removed only in case it is a direct child of the current tree (@see {@link hasChild}).
     * @param {Tree} tree - A tree that should be removed.
     */
    removeChild(tree: Tree): void;
    /**
     * Remove current tree from its parent.
     */
    removeItselfFromParent(): void;
    /**
     * Switch folding type of the current tree. "Leaf" node cannot switch its folding type cause it doesn't have children, hence nothing to fold.
     * If node is a "Branch" and it is expanded, then by invoking current method state of the tree should be switched to "collapsed" and vice versa.
     */
    switchFoldingType(): void;
    /**
     * Check that tree is expanded.
     * @returns {boolean} A flag indicating whether current tree is expanded. Always returns false for the "Leaf" tree and for an empty tree.
     */
    isNodeExpanded(): boolean;
    /**
     * Check that tree is collapsed.
     * @returns {boolean} A flag indicating whether current tree is collapsed. Always returns false for the "Leaf" tree and for an empty tree.
     */
    isNodeCollapsed(): boolean;
    /**
     * Set a current folding type: expanded, collapsed or leaf.
     */
    private _setFoldingType();
    /**
     * Get a current folding type: expanded, collapsed or leaf.
     * @returns {FoldingType} A folding type of the current tree.
     */
    readonly foldingType: FoldingType;
    /**
     * Get a css class for element which displayes folding state - expanded, collapsed or leaf
     * @returns {string} A string icontaining css class (classes)
     */
    readonly foldingCssClass: string;
    private getCssClassesFromSettings();
    /**
     * Get a html template to render before every node's name.
     * @returns {string} A string representing a html template.
     */
    readonly nodeTemplate: string;
    private getTemplateFromSettings();
    /**
     * Get a html template to render for an element activatin left menu of a node.
     * @returns {string} A string representing a html template.
     */
    readonly leftMenuTemplate: string;
    /**
     * Check that current tree is newly created (added by user via menu for example). Tree that was built from the TreeModel is not marked as new.
     * @returns {boolean} A flag whether the tree is new.
     */
    isNew(): boolean;
    /**
     * Mark current tree as new (@see {@link isNew}).
     */
    markAsNew(): void;
    /**
     * Check that current tree is being renamed (it is in the process of its value renaming initiated by a user).
     * @returns {boolean} A flag whether the tree is being renamed.
     */
    isBeingRenamed(): boolean;
    /**
     * Mark current tree as being renamed (@see {@link isBeingRenamed}).
     */
    markAsBeingRenamed(): void;
    /**
     * Check that current tree is modified (for example it was renamed).
     * @returns {boolean} A flag whether the tree is modified.
     */
    isModified(): boolean;
    /**
     * Mark current tree as modified (@see {@link isModified}).
     */
    markAsModified(): void;
}
