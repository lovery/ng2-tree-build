"use strict";
var core_1 = require('@angular/core');
var node_draggable_service_1 = require('./node-draggable.service');
var captured_node_1 = require('./captured-node');
var NodeDraggableDirective = (function () {
    function NodeDraggableDirective(element, nodeDraggableService, renderer) {
        this.element = element;
        this.nodeDraggableService = nodeDraggableService;
        this.renderer = renderer;
        this.disposersForDragListeners = [];
        this.nodeNativeElement = element.nativeElement;
    }
    NodeDraggableDirective.prototype.ngOnInit = function () {
        if (!this.tree.isStatic()) {
            this.renderer.setElementAttribute(this.nodeNativeElement, 'draggable', 'true');
            this.disposersForDragListeners.push(this.renderer.listen(this.nodeNativeElement, 'dragenter', this.handleDragEnter.bind(this)));
            this.disposersForDragListeners.push(this.renderer.listen(this.nodeNativeElement, 'dragover', this.handleDragOver.bind(this)));
            this.disposersForDragListeners.push(this.renderer.listen(this.nodeNativeElement, 'dragstart', this.handleDragStart.bind(this)));
            this.disposersForDragListeners.push(this.renderer.listen(this.nodeNativeElement, 'dragleave', this.handleDragLeave.bind(this)));
            this.disposersForDragListeners.push(this.renderer.listen(this.nodeNativeElement, 'drop', this.handleDrop.bind(this)));
            this.disposersForDragListeners.push(this.renderer.listen(this.nodeNativeElement, 'dragend', this.handleDragEnd.bind(this)));
        }
    };
    NodeDraggableDirective.prototype.ngOnDestroy = function () {
        this.disposersForDragListeners.forEach(function (dispose) { return dispose(); });
    };
    NodeDraggableDirective.prototype.handleDragStart = function (e) {
        e.stopPropagation();
        this.nodeDraggableService.captureNode(new captured_node_1.CapturedNode(this.nodeDraggable, this.tree));
        e.dataTransfer.setData('text', NodeDraggableDirective.DATA_TRANSFER_STUB_DATA);
        e.dataTransfer.effectAllowed = 'move';
    };
    NodeDraggableDirective.prototype.handleDragOver = function (e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };
    NodeDraggableDirective.prototype.handleDragEnter = function (e) {
        e.preventDefault();
        if (this.containsElementAt(e)) {
            this.addClass('over-drop-target');
        }
    };
    NodeDraggableDirective.prototype.handleDragLeave = function (e) {
        if (!this.containsElementAt(e)) {
            this.removeClass('over-drop-target');
        }
    };
    NodeDraggableDirective.prototype.handleDrop = function (e) {
        e.preventDefault();
        e.stopPropagation();
        this.removeClass('over-drop-target');
        if (!this.isDropPossible(e)) {
            return false;
        }
        if (this.nodeDraggableService.getCapturedNode()) {
            return this.notifyThatNodeWasDropped();
        }
    };
    NodeDraggableDirective.prototype.isDropPossible = function (e) {
        var capturedNode = this.nodeDraggableService.getCapturedNode();
        return capturedNode
            && capturedNode.canBeDroppedAt(this.nodeDraggable)
            && this.containsElementAt(e);
    };
    NodeDraggableDirective.prototype.handleDragEnd = function (e) {
        this.removeClass('over-drop-target');
        this.nodeDraggableService.releaseCapturedNode();
    };
    NodeDraggableDirective.prototype.containsElementAt = function (e) {
        var _a = e.x, x = _a === void 0 ? e.clientX : _a, _b = e.y, y = _b === void 0 ? e.clientY : _b;
        return this.nodeNativeElement.contains(document.elementFromPoint(x, y));
    };
    NodeDraggableDirective.prototype.addClass = function (className) {
        var classList = this.nodeNativeElement.classList;
        classList.add(className);
    };
    NodeDraggableDirective.prototype.removeClass = function (className) {
        var classList = this.nodeNativeElement.classList;
        classList.remove(className);
    };
    NodeDraggableDirective.prototype.notifyThatNodeWasDropped = function () {
        this.nodeDraggableService.fireNodeDragged(this.nodeDraggableService.getCapturedNode(), this.nodeDraggable);
    };
    NodeDraggableDirective.DATA_TRANSFER_STUB_DATA = 'some browsers enable drag-n-drop only when dataTransfer has data';
    NodeDraggableDirective.decorators = [
        { type: core_1.Directive, args: [{
                    selector: '[nodeDraggable]'
                },] },
    ];
    NodeDraggableDirective.ctorParameters = function () { return [
        { type: core_1.ElementRef, decorators: [{ type: core_1.Inject, args: [core_1.ElementRef,] },] },
        { type: node_draggable_service_1.NodeDraggableService, decorators: [{ type: core_1.Inject, args: [node_draggable_service_1.NodeDraggableService,] },] },
        { type: core_1.Renderer, decorators: [{ type: core_1.Inject, args: [core_1.Renderer,] },] },
    ]; };
    NodeDraggableDirective.propDecorators = {
        'nodeDraggable': [{ type: core_1.Input },],
        'tree': [{ type: core_1.Input },],
    };
    return NodeDraggableDirective;
}());
exports.NodeDraggableDirective = NodeDraggableDirective;
//# sourceMappingURL=node-draggable.directive.js.map