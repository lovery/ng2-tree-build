export declare class FoldingType {
    private _cssClass;
    static Expanded: FoldingType;
    static Collapsed: FoldingType;
    static Empty: FoldingType;
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
    empty?: string;
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
    /**
     * "leftMenu" property when set to true makes left menu available.
     * it's value doesn't mater when static option is set to true
     * @name TreeModelSettings#leftMenu
     * @type boolean
     * @default false
     */
    leftMenu?: boolean;
    /**
     * "rightMenu" property when set to true makes right menu available.
     * it's value doesn't mater when static option is set to true
     * @name TreeModelSettings#rightMenu
     * @type boolean
     * @default true
     */
    rightMenu?: boolean;
    menu?: Function;
    /**
     * "dragable" property when set to true allows you to drag a node, when set to false you can only drop nodes over it
     * it can be overrided by static option
     * it's value doesn't mater when static option is set to true
     * @mane TreeModelSettings#dragable
     * @type boolean
     * @default true
     */
    dragable?: boolean;
    /**
     * "static" property when set to true makes it impossible to drag'n'drop tree or call a menu on it.
     * @name TreeModelSettings#static
     * @type boolean
     * @default false
     */
    static?: boolean;
    static merge(sourceA: TreeModel, sourceB: TreeModel): TreeModelSettings;
}
export interface Ng2TreeSettings {
    /**
     * Indicates root visibility in the tree. When true - root is invisible.
     * @name Ng2TreeSettings#rootIsVisible
     * @type boolean
     */
    rootIsVisible?: boolean;
}
export declare enum TreeStatus {
    New = 0,
    Modified = 1,
    IsBeingRenamed = 2,
}
export interface RenamableNode {
    /**
     * Set new value of the renamable node. Implementation of this method is up to user.
     * @param {string} name - A new value of the node.
     */
    setName(name: string): void;
    /**
     * Get string representation of the node. Implementation of this method is up to user.
     * @returns {string} - A node string representation.
     */
    toString(): string;
}
