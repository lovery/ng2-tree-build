import { OnInit, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { TreeService } from './tree.service';
import { TreeModel, Ng2TreeSettings } from './tree.types';
import { Tree } from './tree';
import { TreeController } from './tree-controller';
export declare class TreeComponent implements OnInit, OnChanges {
    private treeService;
    private static EMPTY_TREE;
    treeModel: TreeModel;
    settings: Ng2TreeSettings;
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
    getChildControllerById(id: number | string): TreeController;
}
