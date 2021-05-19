import { ActivatedRoute, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";

/**根据路由获得URL */
function UtilRouterGetUrl(route: ActivatedRoute | ActivatedRouteSnapshot): string {
    let snaphot: ActivatedRouteSnapshot = ((<ActivatedRoute>route).snapshot || route) as ActivatedRouteSnapshot;
    let router: RouterStateSnapshot = snaphot['_routerState'];
    let url = router.url;
    console.log("url:   " + url)
    return url;
}

export { UtilRouterGetUrl }