"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var NodeEvent = (function () {
    function NodeEvent(node) {
        this.node = node;
    }
    return NodeEvent;
}());
exports.NodeEvent = NodeEvent;
var NodeSelectedEvent = (function (_super) {
    __extends(NodeSelectedEvent, _super);
    function NodeSelectedEvent(node) {
        _super.call(this, node);
    }
    return NodeSelectedEvent;
}(NodeEvent));
exports.NodeSelectedEvent = NodeSelectedEvent;
var NodeActivatedEvent = (function (_super) {
    __extends(NodeActivatedEvent, _super);
    function NodeActivatedEvent(node) {
        _super.call(this, node);
    }
    return NodeActivatedEvent;
}(NodeEvent));
exports.NodeActivatedEvent = NodeActivatedEvent;
var NodeDestructiveEvent = (function (_super) {
    __extends(NodeDestructiveEvent, _super);
    function NodeDestructiveEvent(node) {
        _super.call(this, node);
    }
    return NodeDestructiveEvent;
}(NodeEvent));
exports.NodeDestructiveEvent = NodeDestructiveEvent;
var NodeMovedEvent = (function (_super) {
    __extends(NodeMovedEvent, _super);
    function NodeMovedEvent(node, previousParent) {
        _super.call(this, node);
        this.previousParent = previousParent;
    }
    return NodeMovedEvent;
}(NodeDestructiveEvent));
exports.NodeMovedEvent = NodeMovedEvent;
var NodeRemovedEvent = (function (_super) {
    __extends(NodeRemovedEvent, _super);
    function NodeRemovedEvent(node) {
        _super.call(this, node);
    }
    return NodeRemovedEvent;
}(NodeDestructiveEvent));
exports.NodeRemovedEvent = NodeRemovedEvent;
var NodeCreatedEvent = (function (_super) {
    __extends(NodeCreatedEvent, _super);
    function NodeCreatedEvent(node) {
        _super.call(this, node);
    }
    return NodeCreatedEvent;
}(NodeDestructiveEvent));
exports.NodeCreatedEvent = NodeCreatedEvent;
var NodeRenamedEvent = (function (_super) {
    __extends(NodeRenamedEvent, _super);
    function NodeRenamedEvent(node, oldValue, newValue) {
        _super.call(this, node);
        this.oldValue = oldValue;
        this.newValue = newValue;
    }
    return NodeRenamedEvent;
}(NodeDestructiveEvent));
exports.NodeRenamedEvent = NodeRenamedEvent;
var NodeExpandedEvent = (function (_super) {
    __extends(NodeExpandedEvent, _super);
    function NodeExpandedEvent(node) {
        _super.call(this, node);
    }
    return NodeExpandedEvent;
}(NodeEvent));
exports.NodeExpandedEvent = NodeExpandedEvent;
var NodeCollapsedEvent = (function (_super) {
    __extends(NodeCollapsedEvent, _super);
    function NodeCollapsedEvent(node) {
        _super.call(this, node);
    }
    return NodeCollapsedEvent;
}(NodeEvent));
exports.NodeCollapsedEvent = NodeCollapsedEvent;
//# sourceMappingURL=tree.events.js.map