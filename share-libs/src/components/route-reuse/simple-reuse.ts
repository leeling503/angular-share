import { RouteReuseStrategy, DefaultUrlSerializer, ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';

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

    getTruthRoute(route: ActivatedRouteSnapshot) {
        let next = route;
        while (next.firstChild) next = next.firstChild;
        return next;
    }
    /**
     * 根据快照获取URL地址
     */
    getUrl(route: ActivatedRouteSnapshot): string {
        let next = this.getTruthRoute(route);
        const segments = [];
        while (next) {
            segments.push(next.url.join('/'));
            next = next.parent;
        }
        const url = '/' + segments.filter(i => i).reverse().join('/');
        console.log(url)
        return url;
    }
}