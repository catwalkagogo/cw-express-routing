import Express = require('express');
import Controller = require('./Controller');

class RestController extends Controller {
	public index(req: Express.Request, res: Express.Response) {
	}

	public new(req: Express.Request, res: Express.Response) {
	}

	public create(req: Express.Request, res: Express.Response) {
	}

	public show(req: Express.Request, res: Express.Response) {
	}

	public edit(req: Express.Request, res: Express.Response) {
	}

	public update(req: Express.Request, res: Express.Response) {
	}

	public destroy(req: Express.Request, res: Express.Response) {
	}

	public get_index(req: Express.Request, res: Express.Response) {
		return this.index(req, res);
	}

	public get_new(req: Express.Request, res: Express.Response) {
		return this.new(req, res);
	}

	public post_index(req: Express.Request, res: Express.Response) {
		return this.create(req, res);
	}


	public attach(app: Express.Application, path: string= "/"): void {
		super.attach(app, path);

		path = this.attachedPath;
		app.get(path + ':id', this.createRoutingHandler('show'));
		app.get(path + ':id/edit', this.createRoutingHandler('edit'));
		app.put(path + ':id', this.createRoutingHandler('update'));
		app.del(path + ':id', this.createRoutingHandler('destroy'));
	}
}

export = RestController;