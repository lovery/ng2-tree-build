import { Tree } from './tree';
import { TreeController } from './tree-controller';
import { RenamableNode } from './tree.types';
export declare class NodeEvent {
    node: Tree;
    constructor(node: Tree);
}
export declare class NodeSelectedEvent extends NodeEvent {
    constructor(node: Tree);
}
export declare class NodeActivatedEvent extends NodeEvent {
    constructor(node: Tree);
}
export declare class NodeDestructiveEvent extends NodeEvent {
    constructor(node: Tree);
}
export declare class NodeMovedEvent extends NodeDestructiveEvent {
    previousParent: Tree;
    constructor(node: Tree, previousParent: Tree);
}
export declare class NodeRemovedEvent extends NodeDestructiveEvent {
    constructor(node: Tree);
}
export declare class NodeCreatedEvent extends NodeDestructiveEvent {
    controller: TreeController;
    constructor(node: Tree, controller: TreeController);
}
export declare class NodeRenamedEvent extends NodeDestructiveEvent {
    oldValue: string | RenamableNode;
    newValue: string | RenamableNode;
    constructor(node: Tree, oldValue: string | RenamableNode, newValue: string | RenamableNode);
}
export declare class NodeExpandedEvent extends NodeEvent {
    constructor(node: Tree);
}
export declare class NodeCollapsedEvent extends NodeEvent {
    constructor(node: Tree);
}
