import { TreeModel } from './tree.types';
import { TreeInternalComponent } from './tree-internal.component';
export declare class TreeController {
    private treeInternalComponent;
    private tree;
    constructor(treeInternalComponent: TreeInternalComponent);
    select(e?: MouseEvent): void;
    expand(): void;
    collapse(): void;
    rename(newValue: string): void;
    remove(): void;
    addChild(newNode: TreeModel): void;
    reloadChildren(): void;
    setChildren(): void;
}
