"use strict";
var core_1 = require('@angular/core');
var _ = require('lodash');
var tree_service_1 = require('./tree.service');
var tree_1 = require('./tree');
var TreeComponent = (function () {
    function TreeComponent(treeService) {
        this.treeService = treeService;
        this.nodeCreated = new core_1.EventEmitter();
        this.nodeRemoved = new core_1.EventEmitter();
        this.nodeRenamed = new core_1.EventEmitter();
        this.nodeSelected = new core_1.EventEmitter();
        this.nodeMoved = new core_1.EventEmitter();
        this.nodeExpanded = new core_1.EventEmitter();
        this.nodeCollapsed = new core_1.EventEmitter();
    }
    TreeComponent.prototype.ngOnChanges = function (changes) {
        if (!this.treeModel) {
            this.tree = TreeComponent.EMPTY_TREE;
        }
        else {
            this.tree = new tree_1.Tree(this.treeModel);
        }
    };
    TreeComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.treeService.nodeRemoved$.subscribe(function (e) {
            _this.nodeRemoved.emit(e);
        });
        this.treeService.nodeRenamed$.subscribe(function (e) {
            _this.nodeRenamed.emit(e);
        });
        this.treeService.nodeCreated$.subscribe(function (e) {
            _this.nodeCreated.emit(e);
        });
        this.treeService.nodeSelected$.subscribe(function (e) {
            _this.nodeSelected.emit(e);
        });
        this.treeService.nodeMoved$.subscribe(function (e) {
            _this.nodeMoved.emit(e);
        });
        this.treeService.nodeExpanded$.subscribe(function (e) {
            _this.nodeExpanded.emit(e);
        });
        this.treeService.nodeCollapsed$.subscribe(function (e) {
            _this.nodeCollapsed.emit(e);
        });
    };
    TreeComponent.prototype.getTreeAPI = function () {
        if (_.get(this.tree, 'node.id', null) && this.treeService.APIs.hasOwnProperty(this.tree.node.id)) {
            return this.treeService.APIs[this.tree.node.id];
        }
        return null;
    };
    TreeComponent.prototype.getChildAPIById = function (id) {
        if (this.treeService.APIs.hasOwnProperty(id)) {
            return this.treeService.APIs[id];
        }
        return null;
    };
    TreeComponent.EMPTY_TREE = new tree_1.Tree({ value: '' });
    TreeComponent.decorators = [
        { type: core_1.Component, args: [{
                    selector: 'tree',
                    template: "<tree-internal [tree]=\"tree\" [settings]=\"settings\"></tree-internal>",
                    providers: [tree_service_1.TreeService]
                },] },
    ];
    TreeComponent.ctorParameters = function () { return [
        { type: tree_service_1.TreeService, decorators: [{ type: core_1.Inject, args: [tree_service_1.TreeService,] },] },
    ]; };
    TreeComponent.propDecorators = {
        'treeModel': [{ type: core_1.Input, args: ['tree',] },],
        'settings': [{ type: core_1.Input },],
        'nodeCreated': [{ type: core_1.Output },],
        'nodeRemoved': [{ type: core_1.Output },],
        'nodeRenamed': [{ type: core_1.Output },],
        'nodeSelected': [{ type: core_1.Output },],
        'nodeMoved': [{ type: core_1.Output },],
        'nodeExpanded': [{ type: core_1.Output },],
        'nodeCollapsed': [{ type: core_1.Output },],
    };
    return TreeComponent;
}());
exports.TreeComponent = TreeComponent;
//# sourceMappingURL=tree.component.js.map