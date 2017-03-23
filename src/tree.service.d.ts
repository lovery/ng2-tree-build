import { NodeRemovedEvent, NodeRenamedEvent, NodeCreatedEvent, NodeSelectedEvent, NodeMovedEvent, NodeExpandedEvent, NodeCollapsedEvent } from './tree.events';
import { RenamableNode } from './tree.types';
import { Tree } from './tree';
import { Subject, Observable } from 'rxjs/Rx';
import { ElementRef } from '@angular/core';
import { NodeDraggableService } from './draggable/node-draggable.service';
import { NodeDraggableEvent } from './draggable/draggable.events';
export declare class TreeService {
    private nodeDraggableService;
    nodeMoved$: Subject<NodeMovedEvent>;
    nodeRemoved$: Subject<NodeRemovedEvent>;
    nodeRenamed$: Subject<NodeRenamedEvent>;
    nodeCreated$: Subject<NodeCreatedEvent>;
    nodeSelected$: Subject<NodeSelectedEvent>;
    nodeExpanded$: Subject<NodeExpandedEvent>;
    nodeCollapsed$: Subject<NodeCollapsedEvent>;
    constructor(nodeDraggableService: NodeDraggableService);
    unselectStream(tree: Tree): Observable<any>;
    fireNodeRemoved(tree: Tree): void;
    fireNodeCreated(tree: Tree): void;
    fireNodeSelected(tree: Tree): void;
    fireNodeRenamed(oldValue: RenamableNode | string, tree: Tree): void;
    fireNodeMoved(tree: Tree, parent: Tree): void;
    fireNodeSwitchFoldingType(tree: Tree): void;
    private fireNodeExpanded(tree);
    private fireNodeCollapsed(tree);
    draggedStream(tree: Tree, element: ElementRef): Observable<NodeDraggableEvent>;
}
