import { RouteReuseStrategy, DefaultUrlSerializer, ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';
import { UtilRouter } from 'share-libs/src/utils';

/**简单的路由复用策略*/
export class SimpleReuseStrategy implements RouteReuseStrategy {

    _cacheRouters: { [key: string]: any } = {};

    shouldDetach(route: ActivatedRouteSnapshot): boolean {
        return true;
    }
    store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
        let url = this.getUrl(route);
        this._cacheRouters[url] = {
            snapshot: route,
            handle: handle
        };
    }
    shouldAttach(route: ActivatedRouteSnapshot): boolean {
        let url = this.getUrl(route);
        return !!this._cacheRouters[url];
    }
    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
        let url = this.getUrl(route);
        return this._cacheRouters[url] && this._cacheRouters[url].handle;
    }
    shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        return future.routeConfig === curr.routeConfig;
    }

    /**
     * 根据快照获取URL地址
     */
    getUrl(route: ActivatedRouteSnapshot): string {
        return UtilRouter.getUrl(route)
    }
}