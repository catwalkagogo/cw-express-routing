var Enumerable = require('linq');

var Path = require('path');
var Glob = require('glob');
var PathUtil = require('./PathUtil');
var _ = require('underscore');

var Core = require('cw-core');
var Class = Core.Class;

var Controller = (function () {
    function Controller() {
        this._attachedPath = null;
    }
    Controller.loadDirectory = function (app, dir) {
        dir = Path.normalize(dir);
        var baseSeg = PathUtil.split(dir);
        Glob(dir + "/**/*.js", function (err, files) {
            if (err) {
                console.log(err);
            } else {
                files.forEach(function (file) {
                    var name = PathUtil.getFilenameWithoutExtension(file);
                    var seg = PathUtil.split(file);
                    seg = Enumerable.from(seg).skipWhile(function (s, i) {
                        return s == baseSeg[i];
                    }).takeExceptLast(1).concat([name]).toArray();
                    var path = '/' + seg.join('/');

                    var mod = require(dir + "/" + path);
                    if (mod.attach) {
                        mod.attach(app);
                    }
                    if (_.isFunction(mod)) {
                        var controller = new mod();
                        if (controller instanceof Controller) {
                            controller.attach(app, path);
                        }
                    }
                });
            }
        });
    };

    Controller.prototype.attach = function (app, path) {
        var _this = this;
        if (typeof path === "undefined") { path = "/"; }
        if (this._attachedPath != null) {
            throw 'Controller already attached.';
        }

        var basePath = path;
        if (basePath.charAt(basePath.length - 1) != "/") {
            basePath += "/";
        }

        this._attachedPath = basePath;

        var routes = Enumerable.from(Class.getFunctionNames(this)).select(function (func) {
            return {
                function: func,
                names: func.split('_', 2)
            };
        }).where(function (v) {
            return v.names.length == 2;
        }).select(function (v) {
            return {
                function: v.function,
                method: v.names[0].toLowerCase(),
                action: v.names[1].toLowerCase()
            };
        }).where(function (v) {
            return v.method == 'get' || v.method == 'all' || v.method == 'post' || v.method == 'delete' || v.method == 'put';
        }).toArray();

        routes.forEach(function (route) {
            var func = route.function;
            var path = basePath + route.action;

            app[route.method](path, _this.createRoutingHandler(func));
        });

        var indexes = Enumerable.from(routes).where(function (routes) {
            return routes.action == 'index';
        });
        indexes.forEach(function (index) {
            var func = index.function;
            app[index.method](basePath, _this.createRoutingHandler(func));
        });
    };

    Controller.prototype.createRoutingHandler = function (action) {
        var _this = this;
        return function (req, res) {
            if (!_this.onRoute(req, res, action)) {
                return _this[action](req, res);
            }
        };
    };

    Object.defineProperty(Controller.prototype, "attachedPath", {
        get: function () {
            return this._attachedPath;
        },
        enumerable: true,
        configurable: true
    });

    Controller.prototype.onRoute = function (req, res, action) {
        return false;
    };
    return Controller;
})();

module.exports = Controller;
//# sourceMappingURL=Controller.js.map
