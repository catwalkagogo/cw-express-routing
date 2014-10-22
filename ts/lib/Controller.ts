import Express = require('express');
import Enumerable = require('linq');
import FS = require('fs');
import Path = require('path');
import Glob = require('glob');
import PathUtil = require('./PathUtil');
import _ = require('underscore');

import Core = require('cw-core');
import Class = Core.Class;

class Controller {
	private _attachedPath = null;

	public static loadDirectory(app: Express.Application, dir: string): void {
		dir = Path.normalize(dir);
		var baseSeg = PathUtil.split(dir);
		Glob(dir + "/**/*.js", (err: Error, files: string[]) => {
			if(err) {
				console.log(err);
			} else {
				files.forEach(file => {
					var name = PathUtil.getFilenameWithoutExtension(file);
					var seg = PathUtil.split(file);
					seg = Enumerable.from(seg)
						.skipWhile((s, i) => s == baseSeg[i])
						.takeExceptLast(1)
						.concat([name])
						.toArray();
					var path = '/' + seg.join('/');

					//console.log('controler: require:' + dir + path);
					var mod = require(dir + "/" + path);
					if(mod.attach) {
						//console.log('mod.attach');
						mod.attach(app);
					}
					if(_.isFunction(mod)) {
						//console.log('is function');
						var controller = new mod();
						if(controller instanceof Controller) {
							//console.log('controller.attach: ' + path);

							controller.attach(app, path);
						}
					}
				});
			}
		});
	}

	public attach(app: Express.Application, path: string= "/"): void {
		if(this._attachedPath != null) {
			throw 'Controller already attached.';
		}

		var basePath = path;
		if(basePath.charAt(basePath.length - 1) != "/") {
			basePath += "/";
		}

		this._attachedPath = basePath;

		var routes = Enumerable
			.from(Class.getFunctionNames(this))
			.select(func => {
				return {
					function: func,
					names: func.split('_', 2)
				}
			})
			.where(v => v.names.length == 2)
			.select(v => {
				return {
					function: v.function,
					method: v.names[0].toLowerCase(),
					action: v.names[1].toLowerCase(),
				}
			})
			.where(v => v.method == 'get' || v.method == 'all' || v.method == 'post' || v.method == 'delete' || v.method == 'put')
			.toArray();

		routes.forEach(route => {
			var func = route.function;
			var path = basePath + route.action;
			//console.log('method:' + route.method + " url:" + path + " action:" + route.action);
			app[route.method](
				path,
				this.createRoutingHandler(func)
				);
		});

		var indexes = Enumerable
			.from(routes)
			.where(routes => routes.action == 'index');
		indexes.forEach(index => {
			var func = index.function;
			app[index.method](
				basePath,
				this.createRoutingHandler(func)
				)
		});
	}

	createRoutingHandler(action: string): (req: Express.Request, res: Express.Response) => void {
		return (req: Express.Request, res: Express.Response) => {
			if(!this.onRoute(req, res, action)) {
				return this[action](req, res);
			}
		};
	}

	public get attachedPath(): string {
		return this._attachedPath;
	}

	onRoute(req: Express.Request, res: Express.Response, action: string): boolean {
		return false;
	}

}

export = Controller;