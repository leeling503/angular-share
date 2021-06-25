import { Component } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router } from "@angular/router";
import { filter } from "rxjs/operators";
import { CacheCtrService } from "share-libs/src/services/route-reuse/cache-ctr.service";
import { ReuseMenuEvent, ReuseCacheNotify, ReuseCachedCtr } from "share-libs/src/services/route-reuse/reuse-tab";
import { UtilArraySetKeyValue, UtilRouterGetUrl } from "share-libs/src/utils";

/**复用路由缓存控制按钮组件 */
@Component({
    selector: 'layout-cache-ctr',
    templateUrl: './layout-cache-ctr.component.html',
    styleUrls: ['./layout-cache-ctr.component.less']
})
export class LayoutCacheCtrComponent {
    constructor(private router: Router, private active: ActivatedRoute, private cacheCtr_: CacheCtrService) {
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe(res => {
            this.genReuseList()
        })
        this.cacheCtr_.change.subscribe((change) => {
            this.changeReuseList(change)
        })
    }
    /**路由按钮组 */
    reuseRouteList: ReuseCachedCtr[] = [];
    /**激活的路由 */
    activeRoute: ReuseCachedCtr;
    /**关闭事件后的下一个路由 */
    private _nextRoute: ReuseCachedCtr;
    /**复用按钮组变化 */
    changeReuseRoute: Symbol;

    /**生成缓存按钮组 */
    genReuseList() {
        let snap = this.active.snapshot;
        let url = UtilRouterGetUrl(snap);
        /** 从缓存控制中获取，故路由离开时active会设置为false 和 禁止复用的路由会自动清除*/
        this.reuseRouteList = [...this.cacheCtr_.reuseCachedList];
        let index = this.reuseRouteList.findIndex(e => e.url == url);
        UtilArraySetKeyValue(this.reuseRouteList, 'ifRight', false);
        UtilArraySetKeyValue(this.reuseRouteList, 'active', false);
        if (index < 0) {
            let truthSnap = this.getTruthRoute(snap)
            let item = this.cacheCtr_.genReuseTabCached(url, truthSnap)
            item.active = true;
            this.reuseRouteList.push(item);
            this.activeRoute = item;
        } else {
            this.activeRoute = this.reuseRouteList[index];
            this.activeRoute.active = true;
        }
        let len = this.reuseRouteList.length;
        this.reuseRouteList[len - 1].ifRight = true;
        this.reuseRouteList[0].ifLeft = true;
        this.changeReuseRoute = Symbol('change');
    }

    /**缓存改变通知改变按钮组 */
    changeReuseList(change: ReuseCacheNotify) {
        if (change.action === 'change') {
            this.genReuseList();
        }
    }

    goReuseRoute(reuse: ReuseCachedCtr) {
        this.router.navigateByUrl(reuse.url)
    }

    getTruthRoute(route: ActivatedRouteSnapshot) {
        let next = route;
        while (next.firstChild) next = next.firstChild;
        return next;
    }

    /**页面用户点击关闭按钮 */
    onCloseReuseRoute(route: ReuseCachedCtr) {
        event.stopPropagation();
        let url = route.url;
        if (route === this.activeRoute) {
            let index = this.reuseRouteList.findIndex(w => w.url === url);
            index = index > 0 ? index - 1 : index + 1;
            this._nextRoute = this.reuseRouteList[index];
            this.goReuseRoute(this._nextRoute);
        }
        this.cacheCtr_.close(url)
    }

    /**右键菜单通知改变缓存*/
    onContextMenuChange(ctr: ReuseMenuEvent) {
        let type = ctr.type, item = ctr.item, url = item.url, coerce = ctr.coerceClose;
        switch (type) {
            case 'close':
                this.onCloseReuseRoute(item);
                break;
            case 'closeRight':
                this.cacheCtr_.closeRight(url, coerce);
                break;
            case 'clear':
            case 'closeOther':
                this.cacheCtr_.clear(coerce);
                break;
        }
    }


}