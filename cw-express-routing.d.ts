declare module "cw-express-routing" {

import Express = require('express');

// ts/lib/Controller.d.ts
class Controller {
    private _attachedPath;
    static loadDirectory(app: Express.Application, dir: string): void;
    public attach(app: Express.Application, path?: string): void;
    public createRoutingHandler(action: string): (req: Express.Request, res: Express.Response) => void;
    public attachedPath : string;
    public onRoute(req: Express.Request, res: Express.Response, action: string): boolean;
}

// ts/lib/RestController.d.ts
class RestController extends Controller {
    public index(req: Express.Request, res: Express.Response): void;
    public new(req: Express.Request, res: Express.Response): void;
    public create(req: Express.Request, res: Express.Response): void;
    public show(req: Express.Request, res: Express.Response): void;
    public edit(req: Express.Request, res: Express.Response): void;
    public update(req: Express.Request, res: Express.Response): void;
    public destroy(req: Express.Request, res: Express.Response): void;
    public get_index(req: Express.Request, res: Express.Response): void;
    public get_new(req: Express.Request, res: Express.Response): void;
    public post_index(req: Express.Request, res: Express.Response): void;
    public attach(app: Express.Application, path?: string): void;
}

}
