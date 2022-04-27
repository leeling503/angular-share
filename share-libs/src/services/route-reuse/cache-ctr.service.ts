import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { BehaviorSubject } from "rxjs";
import { filter } from "rxjs/operators";
import { UtilRouter } from "share-libs/src/utils";
import { ReuseCachedCtr, ReuseCacheNotify } from "./reuse-tab";

/**复用路由缓存控制服务 */
@Injectable({ providedIn: "root" })
export class CacheCtrService {
    constructor() { }
    private _cachedChange: BehaviorSubject<ReuseCacheNotify> = new BehaviorSubject<ReuseCacheNotify>(null);
    /**用户关闭的缓存url */
    closeUrl: string;
    /**被复用的路由数据 */
    reuseCachedList: ReuseCachedCtr[] = [];

    /** 获取当前缓存的路由总数 */
    private get count(): number {
        return this.reuseCachedList.length;
    }

    /** 订阅缓存变更通知 */
    get change(): Observable<ReuseCacheNotify> {
        return this._cachedChange.asObservable()
            .pipe(filter(w => w !== null));
    }

    /**离开时存储到缓存*/
    onStore(_snapshot: ActivatedRouteSnapshot, _handle: any) {
        // 超出最大存储范围之后
        // if (this.count >= this._max) this.reuseCachedList.shift();
        const url = this.getUrl(_snapshot);
        const index = this.index(url);
        let item;
        if (index === -1) {
            item = this.genReuseTabCached(url, _snapshot);
            this.reuseCachedList.push(item);
        } else {
            item = this.reuseCachedList[index];
        }
        item._handle = _handle;
        item.active = false;
        this.closeUrl = null;
    }

    /**生成缓存对象*/
    genReuseTabCached(url: string, _snapshot: ActivatedRouteSnapshot): ReuseCachedCtr {
        let snap = _snapshot;
        const title = (snap && snap.data && snap.data.title) || '无标题';
        const closable = !(snap && snap.data && snap.data.closeable === false);
        let item = { title, closable, url, active: false };
        return item;
    }

    /**关闭tab  coerce强制关闭 closeUrl 主动关闭的标签不缓存*/
    close(url: string, coerce = false): void {
        this.closeUrl = url;
        this.remove(url, coerce);
        this._cachedChange.next({ action: 'change', list: this.reuseCachedList });
    }

    /** 获取指定路径缓存所在位置，`-1` 表示无缓存 */
    index(url: string): number {
        return this.reuseCachedList.findIndex(w => w.url === url);
    }

    /** 获取指定路径缓存 */
    getReuseCached(url: string): ReuseCachedCtr {
        return url ? this.reuseCachedList.find(w => w.url === url) || null : null;
    }

    /**
     * 根据快照获取URL地址
     */
    getUrl(route: ActivatedRouteSnapshot): string {
        let url = UtilRouter.getUrl(route);
        return url;
    }

    /**移除url  coerce 表示强制移除不管路由配置*/
    private remove(url: string | number, coerce: boolean): void {
        const idx = typeof url === 'string' ? this.index(url) : url;
        const item = idx !== -1 ? this.reuseCachedList[idx] : null;
        if (!item || (!coerce && !item.closable)) {
            return;
        }
        this.destroy(item._handle);
        this.reuseCachedList.splice(idx, 1);
    }

    /**清除右边tab 标签页 */
    closeRight(url: string, coerce = false): void {
        const start = this.index(url);
        for (let i = this.count - 1; i > start; i--) {
            this.remove(i, coerce);
        }
        this.closeUrl = null;
        this._cachedChange.next({ action: 'change', list: this.reuseCachedList });
    }

    /**清除所有缓存（清除所有tab）coerce 强制清除包含不可关闭*/
    clear(coerce = false) {
        this.reuseCachedList.forEach(w => {
            if (!coerce && w.closable) this.destroy(w._handle);
        });
        this.reuseCachedList = this.reuseCachedList.filter(
            w => !coerce && !w.closable,
        );
        this.closeUrl = null;
        this._cachedChange.next({ action: 'change', list: this.reuseCachedList });
    }

    /**组件销毁*/
    private destroy(_handle: any) {
        if (_handle && _handle.componentRef && _handle.componentRef.destroy)
            _handle.componentRef.destroy();
    }

    ngOnDestroy(): void {
        this.reuseCachedList = [];
        this._cachedChange.unsubscribe();
    }
}