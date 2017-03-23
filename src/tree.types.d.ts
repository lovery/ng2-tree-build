export declare class FoldingType {
    private _cssClass;
    static Expanded: FoldingType;
    static Collapsed: FoldingType;
    static Leaf: FoldingType;
    constructor(_cssClass: string);
    readonly cssClass: string;
}
export declare type ChildrenLoadingFunction = (callback: (children: TreeModel[]) => void) => void;
export interface TreeModel {
    value: string | RenamableNode;
    id?: string | number;
    children?: TreeModel[];
    loadChildren?: ChildrenLoadingFunction;
    settings?: TreeModelSettings;
    _status?: TreeStatus;
    _foldingType?: FoldingType;
}
export interface CssClasses {
    expanded?: string;
    collapsed?: string;
    leaf?: string;
}
export interface Templates {
    node?: string;
    leaf?: string;
    leftMenu?: string;
}
export declare class TreeModelSettings {
    cssClasses?: CssClasses;
    templates?: Templates;
    leftMenu?: boolean;
    rightMenu?: boolean;
    static?: boolean;
    static merge(sourceA: TreeModel, sourceB: TreeModel): TreeModelSettings;
}
export interface Ng2TreeSettings {
    rootIsVisible?: boolean;
}
export declare enum TreeStatus {
    New = 0,
    Modified = 1,
    IsBeingRenamed = 2,
}
export interface RenamableNode {
    setName(name: string): void;
    toString(): string;
}
