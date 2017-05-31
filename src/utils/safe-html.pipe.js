"use strict";
var core_1 = require('@angular/core');
var platform_browser_1 = require('@angular/platform-browser');
var SafeHtmlPipe = (function () {
    function SafeHtmlPipe(sanitizer) {
        this.sanitizer = sanitizer;
    }
    SafeHtmlPipe.prototype.transform = function (value) {
        return this.sanitizer.bypassSecurityTrustHtml(value);
    };
    SafeHtmlPipe.decorators = [
        { type: core_1.Pipe, args: [{ name: 'safeHtml' },] },
    ];
    SafeHtmlPipe.ctorParameters = function () { return [
        { type: platform_browser_1.DomSanitizer, },
    ]; };
    return SafeHtmlPipe;
}());
exports.SafeHtmlPipe = SafeHtmlPipe;
//# sourceMappingURL=safe-html.pipe.js.map