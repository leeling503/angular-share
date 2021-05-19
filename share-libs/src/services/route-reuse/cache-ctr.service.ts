import { Injectable, Injector } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router } from "@angular/router";
import { Observable } from "rxjs";
import { BehaviorSubject } from "rxjs";
import { filter } from "rxjs/operators";
import { UtilRouterGetUrl } from "share-libs/src/utils";
import { ReuseTabCached, ReuseCacheNotify } from "./reuse-tab";

@Injectable({ providedIn: "root" })
export class CacheCtrService {
    constructor(private injector: Injector) { }
    private _cachedChange: BehaviorSubject<ReuseCacheNotify> = new BehaviorSubject<ReuseCacheNotify>(null);
    /**缓存路由列表 */
    private _reuseCachedList: ReuseTabCached[] = [];
    private _cacheTitle: { [url: string]: string } = {};
    private _cacheClosable: { [url: string]: boolean } = {};
    private _closeUrl: string;

    /** 当前路由地址 */
    private get _curUrl(): string {
        return this.getUrl(this.injector.get(ActivatedRoute).snapshot);
    }
    /** 获取当前缓存的路由总数 */
    private get count(): number {
        return this._reuseCachedList.length;
    }
    get reuseCachedList(): ReuseTabCached[] {
        return this._reuseCachedList;
    }
    /** 刚刚被移除的缓存路由地址 */
    get removeUrl(): string {
        return this._closeUrl;
    }
    /** 订阅缓存变更通知 */
    get change(): Observable<ReuseCacheNotify> {
        return this._cachedChange.asObservable()
            .pipe(filter(w => w !== null));
    }

    /**离开时存储到缓存*/
    store(_snapshot: ActivatedRouteSnapshot, _handle: any) {
        // 超出最大存储范围之后
        // if (this.count >= this._max) this._reuseCachedList.shift();
        const url = this.getUrl(_snapshot);
        const index = this.index(url);
        let item;
        if (index === -1) {
            item = this.genReuseTabCached(url, _snapshot);
            this._reuseCachedList.push(item);
        } else {
            item = this._reuseCachedList[index];
        }
        item._handle = _handle;
        item.active = false;
        this._closeUrl = null;
        this._cachedChange.next({ action: 'add', list: this._reuseCachedList });
    }

    /**生成缓存对象*/
    genReuseTabCached(url: string, _snapshot: ActivatedRouteSnapshot): ReuseTabCached {
        let snap = _snapshot;
        const title = this._cacheTitle[url] || (snap && snap.data && snap.data.title);
        const closable = this._cacheClosable[url] || !(snap && snap.data && snap.data.reuseClosable === false);
        let item = { title, closable, url, active: false };
        return item;
    }

    /**关闭tab  coerce强制关闭 _closeUrl 主动关闭的标签不缓存*/
    close(url: string, coerce = false): any {
        this._closeUrl = url;
        this.remove(url, coerce);
        this._cachedChange.next({ action: 'close', list: this._reuseCachedList });
        return true;
    }

    /** 获取指定路径缓存所在位置，`-1` 表示无缓存 */
    index(url: string): number {
        return this._reuseCachedList.findIndex(w => w.url === url);
    }

    /** 获取指定路径缓存是否存在 */
    exists(url: string): boolean {
        return this.index(url) !== -1;
    }

    /** 获取指定路径缓存 */
    getReuseCached(url: string): ReuseTabCached {
        return url ? this._reuseCachedList.find(w => w.url === url) || null : null;
    }

    /**获取 closable 状态*/
    getClosable(url: string, route?: ActivatedRouteSnapshot): boolean {
        if (typeof this._cacheClosable[url] !== 'undefined')
            return this._cacheClosable[url];
        if (route && route.data && typeof route.data.reuseClosable === 'boolean')
            return route.data.reuseClosable;
        return true;
    }

    /** 清除标题缓存*/
    clearTitleCached() {
        this._cacheTitle = {};
    }

    /**
     * 根据快照获取URL地址
     */
    getUrl(route: ActivatedRouteSnapshot): string {
        let url = UtilRouterGetUrl(route);
        return url;
    }

    /**移除url  coerce 表示强制移除不管路由配置*/
    private remove(url: string | number, coerce: boolean): boolean {
        const idx = typeof url === 'string' ? this.index(url) : url;
        const item = idx !== -1 ? this._reuseCachedList[idx] : null;
        if (!item || (!coerce && !item.closable)) {
            return false;
        }
        this.destroy(item._handle);
        this._reuseCachedList.splice(idx, 1);
        delete this._cacheTitle[url];
        return true;
    }

    /**清除右边tab 标签页 */
    closeRight(url: string, coerce = false) {
        const start = this.index(url);
        for (let i = this.count - 1; i > start; i--) {
            this.remove(i, coerce);
        }
        this._closeUrl = null;
        this._cachedChange.next({ action: 'closeRight', list: this._reuseCachedList });
        return true;
    }

    /**清除所有缓存（清除所有tab）coerce 强制清除包含不可关闭*/
    clear(coerce = false) {
        this._reuseCachedList.forEach(w => {
            if (!coerce && w.closable) this.destroy(w._handle);
        });
        this._reuseCachedList = this._reuseCachedList.filter(
            w => !coerce && !w.closable,
        );
        this._closeUrl = null;
        this._cachedChange.next({ action: 'clear', list: this._reuseCachedList });
    }

    /**组件销毁*/
    private destroy(_handle: any) {
        if (_handle && _handle.componentRef && _handle.componentRef.destroy)
            _handle.componentRef.destroy();
    }

    ngOnDestroy(): void {
        this._reuseCachedList = [];
        this._cachedChange.unsubscribe();
    }
}