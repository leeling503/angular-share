import { Component } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router } from "@angular/router";
import { filter } from "rxjs/operators";
import { CacheCtrService } from "share-libs/src/services/route-reuse/cache-ctr.service";
import { ContextMenuEvent, ReuseCacheNotify, ReuseTabCached } from "share-libs/src/services/route-reuse/reuse-tab";
import { UtilRouterGetUrl } from "share-libs/src/utils";

@Component({
    selector: 'layout-cache-ctr',
    templateUrl: './layout-cache-ctr.component.html',
    styleUrls: ['./layout-cache-ctr.component.less']
})
export class LayoutCacheCtrComponent {
    reuseList: ReuseTabCached[] = [];
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

    /**生成缓存按钮组 */
    genReuseList() {
        let snap = this.active.snapshot;
        let url = UtilRouterGetUrl(snap);
        /** 从缓存控制中获取，故路由离开时active会设置为false 和 禁止复用的路由会自动清除*/
        this.reuseList = [...this.cacheCtr_.reuseCachedList];
        let index = this.reuseList.findIndex(e => e.url == url);
        if (index < 0) {
            let truthSnap = this.getTruthRoute(snap)
            let item = this.cacheCtr_.genReuseTabCached(url, truthSnap)
            item.active = true;
            this.reuseList.push(item);
        } else {
            this.reuseList[index].active = true;
        }
        let len = this.reuseList.length;
        this.reuseList[len - 1].ifRight = true;
        this.reuseList[0].ifLeft = true;
    }

    /**缓存改变通知改变按钮组 */
    changeReuseList(change: ReuseCacheNotify) {
        if (change.action !== 'add') {
            this.genReuseList();
        }
    }

    goReuseRoute(reuse: ReuseTabCached) {
        this.router.navigateByUrl(reuse.url)
    }

    getTruthRoute(route: ActivatedRouteSnapshot) {
        let next = route;
        while (next.firstChild) next = next.firstChild;
        return next;
    }

    onContextMenuChange(ctr: ContextMenuEvent) {
        // console.log('cmChange:', res);
        let type = ctr.type, item = ctr.item, url = item.url, coerce = ctr.coerceClose;
        switch (type) {
            case 'close':
                this.cacheCtr_.close(url, coerce)
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