import { TreeModel } from './tree.types';
import { TreeInternalComponent } from './tree-internal.component';
export declare class TreeController {
    private treeInternalComponent;
    private tree;
    constructor(treeInternalComponent: TreeInternalComponent);
    select(e?: MouseEvent): void;
    readonly isSelect: boolean;
    expand(): void;
    readonly isExpanded: boolean;
    collapse(): void;
    readonly isCollapsed: boolean;
    rename(newValue: string): void;
    remove(): void;
    addChild(newNode: TreeModel): void;
    changeNodeId(id: string | number): void;
    reloadChildren(): void;
    setChildren(children: Array<TreeModel>): void;
}
