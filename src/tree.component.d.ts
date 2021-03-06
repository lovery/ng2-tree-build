import { OnInit, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { TreeService } from './tree.service';
import * as TreeTypes from './tree.types';
import { Tree } from './tree';
import { TreeController } from './tree-controller';
export declare class TreeComponent implements OnInit, OnChanges {
    private treeService;
    private static EMPTY_TREE;
    treeModel: TreeTypes.TreeModel;
    settings: TreeTypes.Ng2TreeSettings;
    nodeCreated: EventEmitter<any>;
    nodeRemoved: EventEmitter<any>;
    nodeRenamed: EventEmitter<any>;
    nodeSelected: EventEmitter<any>;
    nodeMoved: EventEmitter<any>;
    nodeExpanded: EventEmitter<any>;
    nodeCollapsed: EventEmitter<any>;
    tree: Tree;
    rootComponent: any;
    constructor(treeService: TreeService);
    ngOnChanges(changes: SimpleChanges): void;
    ngOnInit(): void;
    getController(): TreeController;
    getControllerByNodeId(id: number | string): TreeController;
}
