import { TreeService } from './tree.service';
import { TreeInternalComponent } from './tree-internal.component';
export declare class TreeAPI {
    private treeService;
    private components;
    private idCounter;
    constructor(treeService: TreeService);
    push(treeInternalComponent: TreeInternalComponent): void;
    select(id: number | string, e?: MouseEvent): void;
    switchFoldingType(id: number | string): void;
    private _findTree(id);
}
