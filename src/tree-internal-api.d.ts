import { TreeInternalComponent } from './tree-internal.component';
export declare class TreeInternalAPI {
    private treeInternalComponent;
    constructor(treeInternalComponent: TreeInternalComponent);
    select(e?: MouseEvent): void;
    switchFoldingType(): void;
    expand(): void;
    collapse(): void;
}
