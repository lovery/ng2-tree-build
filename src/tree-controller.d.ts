import { TreeInternalComponent } from './tree-internal.component';
export declare class TreeController {
    private treeInternalComponent;
    constructor(treeInternalComponent: TreeInternalComponent);
    select(e?: MouseEvent): void;
    switchFoldingType(): void;
    expand(): void;
    collapse(): void;
    rename(newValue: string): void;
    reloadChildren(): void;
}
