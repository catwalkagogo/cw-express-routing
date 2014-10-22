var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Controller = require('./Controller');

var RestController = (function (_super) {
    __extends(RestController, _super);
    function RestController() {
        _super.apply(this, arguments);
    }
    RestController.prototype.index = function (req, res) {
    };

    RestController.prototype.new = function (req, res) {
    };

    RestController.prototype.create = function (req, res) {
    };

    RestController.prototype.show = function (req, res) {
    };

    RestController.prototype.edit = function (req, res) {
    };

    RestController.prototype.update = function (req, res) {
    };

    RestController.prototype.destroy = function (req, res) {
    };

    RestController.prototype.get_index = function (req, res) {
        return this.index(req, res);
    };

    RestController.prototype.get_new = function (req, res) {
        return this.new(req, res);
    };

    RestController.prototype.post_index = function (req, res) {
        return this.create(req, res);
    };

    RestController.prototype.attach = function (app, path) {
        if (typeof path === "undefined") { path = "/"; }
        _super.prototype.attach.call(this, app, path);

        path = this.attachedPath;
        app.get(path + ':id', this.createRoutingHandler('show'));
        app.get(path + ':id/edit', this.createRoutingHandler('edit'));
        app.put(path + ':id', this.createRoutingHandler('update'));
        app.del(path + ':id', this.createRoutingHandler('destroy'));
    };
    return RestController;
})(Controller);

module.exports = RestController;
//# sourceMappingURL=RestController.js.map
