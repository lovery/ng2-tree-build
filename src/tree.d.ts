import { Observable } from 'rxjs';
import { TreeModel, RenamableNode, FoldingType } from './tree.types';
export declare class Tree {
    private _children;
    private _loadChildren;
    private _childrenLoadingState;
    node: TreeModel;
    parent: Tree;
    constructor(node: TreeModel, parent?: Tree, isBranch?: boolean);
    private buildTreeFromModel(model, parent, isBranch);
    childrenAreBeingLoaded(): boolean;
    childrenWereLoaded(): boolean;
    private canLoadChildren();
    childrenShouldBeLoaded(): boolean;
    readonly children: Tree[];
    readonly childrenAsync: Observable<Tree[]>;
    private childrenAsyncOnce;
    reloadChildren(): void;
    setChildren(children: Array<TreeModel>): void;
    createNode(isBranch: boolean, model?: TreeModel): Tree;
    value: any;
    addSibling(sibling: Tree, position?: number): Tree;
    addChild(child: Tree, position?: number): Tree;
    private _addChild(child, position?);
    swapWithSibling(sibling: Tree): void;
    readonly positionInParent: number;
    isStatic(): boolean;
    hasLeftMenu(): boolean;
    hasRightMenu(): boolean;
    getMenuCustomFunction(): Function;
    isLeaf(): boolean;
    isBranch(): boolean;
    hasChildren(): boolean;
    isRoot(): boolean;
    hasSibling(tree: Tree): boolean;
    hasChild(tree: Tree): boolean;
    removeChild(tree: Tree): void;
    removeItselfFromParent(): void;
    switchFoldingType(): void;
    isNodeExpanded(): boolean;
    isNodeCollapsed(): boolean;
    private _setFoldingType();
    readonly foldingType: FoldingType;
    readonly foldingCssClass: string;
    private getCssClassesFromSettings();
    readonly nodeTemplate: string;
    private getTemplateFromSettings();
    readonly leftMenuTemplate: string;
    isNew(): boolean;
    markAsNew(): void;
    isBeingRenamed(): boolean;
    markAsBeingRenamed(): void;
    isModified(): boolean;
    markAsModified(): void;
    static isValueEmpty(value: string): boolean;
    static isRenamable(value: any): value is RenamableNode;
    private static cloneTreeShallow(origin);
    private static applyNewValueToRenamable(value, newValue);
}
