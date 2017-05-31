import { TreeModel } from './tree.types';
import { TreeInternalComponent } from './tree-internal.component';
export declare class TreeController {
    private treeInternalComponent;
    private tree;
    constructor(treeInternalComponent: TreeInternalComponent);
    select(e?: MouseEvent): void;
    isSelected(): boolean;
    expand(): void;
    isExpanded(): boolean;
    collapse(): void;
    isCollapsed(): boolean;
    rename(newValue: string): void;
    remove(): void;
    addChild(newNode: TreeModel): void;
    changeNodeId(id: string | number): void;
    reloadChildren(): void;
    setChildren(children: Array<TreeModel>): void;
}
