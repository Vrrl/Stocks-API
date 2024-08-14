import { getServerlessModuleHandlerPath } from '../utils/get-serverless-module-handle-path';
import { HttpController } from './http-controller';
import { IRouter } from './router';

type httpMethods = 'POST' | 'GET' | 'PATCH' | 'PUT' | 'DELETE';

type route = {
  method: httpMethods;
  path: string;
  controller: HttpController;
};

export class HttpRouter implements IRouter {
  constructor(prefix: string = '') {
    this.prefix = prefix;
    this.rawRoutes = [];
  }

  rawRoutes: route[];
  prefix: string;

  public toServerlessFunctions(dirName: string) {
    return Object.fromEntries(
      this.routes.map(({ path, method, controller }) => [
        `${controller.constructor.name}`,
        {
          handler: `${getServerlessModuleHandlerPath(dirName)}/functions.http`,
          events: [
            {
              http: {
                method,
                path,
                cors: true,
              },
            },
          ],
        },
      ]),
    );
  }

  static fromRouters(prefix: string = '', routers: HttpRouter[]) {
    const newRouter = new HttpRouter(prefix);
    newRouter.useRouters(routers);
    return newRouter;
  }

  private joinPaths(head: string, tail: string): string {
    const normalizedHead = head.endsWith('/') ? head : head + '/';
    const normalizedTail = tail.startsWith('/') ? tail.substring(1) : tail;
    const newPath = normalizedHead + normalizedTail;

    return newPath.endsWith('/') ? newPath.slice(0, -1) : newPath;
  }

  get routes(): route[] {
    return this.rawRoutes.map(rawRoute => {
      const fullPath = this.joinPaths(this.prefix, rawRoute.path);
      return {
        method: rawRoute.method,
        path: fullPath.startsWith('/') ? fullPath : '/' + fullPath,
        controller: rawRoute.controller,
      };
    });
  }

  addRoute(route: route): void {
    this.rawRoutes.push(route);
  }

  get(path: string, controller: HttpController) {
    this.addRoute({ method: 'GET', path, controller });
  }

  post(path: string, controller: HttpController) {
    this.addRoute({ method: 'POST', path, controller });
  }

  delete(path: string, controller: HttpController) {
    this.addRoute({ method: 'DELETE', path, controller });
  }

  put(path: string, controller: HttpController) {
    this.addRoute({ method: 'PUT', path, controller });
  }

  patch(path: string, controller: HttpController) {
    this.addRoute({ method: 'PATCH', path, controller });
  }

  useRouters(routers: HttpRouter[]): void {
    routers.map(router => {
      router.routes.map(route => {
        this.addRoute(route);
      });
    });
  }
}
