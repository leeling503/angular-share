import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { UtilRouter } from 'share-libs/src/utils';
import { CacheCtrService } from './cache-ctr.service';

/**自定义路由复用策略 */
@Injectable({ providedIn: 'root' })
export class CustomStrategy {
  constructor(private reuseCtr_: CacheCtrService) { }

  /**决定是否复用路由 */
  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot,): boolean {
    let ret = future.routeConfig === curr.routeConfig;
    if (!ret) return false;
    const path = ((future.routeConfig && future.routeConfig.path) || '') as string;
    if (path.length > 0 && ~path.indexOf(':')) {
      const futureUrl = this.getUrl(future);
      const currUrl = this.getUrl(curr);
      ret = futureUrl === currUrl;
    }
    return ret;
  }

  /**提取复用数据*/
  retrieve(route: ActivatedRouteSnapshot): {} {
    let hasInValidRoute = this.hasInValidRoute(route);
    if (hasInValidRoute) return null;
    const url = this.getUrl(route);
    const data = this.reuseCtr_.getReuseCached(url);
    const ret = (data && data._handle) || null;
    return ret;
  }

  /** 检查快照是否允许被复用，若 `true` 会触发 `store`*/
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    if (this.hasInValidRoute(route)) return false;
    const url = this.getUrl(route);
    if (url === this.reuseCtr_.closeUrl) return false;
    if (route.data && typeof route.data.reuse === 'boolean')
      return route.data.reuse;
    return true;
  }

  /**存储快照*/
  store(_snapshot: ActivatedRouteSnapshot, _handle: any) {
    this.reuseCtr_.onStore(_snapshot, _handle);
  }

  /**决定是否允许应用缓存数据*/
  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    if (this.hasInValidRoute(route)) return false;
    const url = this.getUrl(route);
    const data = this.reuseCtr_.getReuseCached(url);
    const ret = !!(data && data._handle);
    return ret;
  }

  /**无效的路由节点 存在loadchildren 或者children 或config就说明不是最后一级路由节点*/
  private hasInValidRoute(route: ActivatedRouteSnapshot) {
    return !!(
      !route.routeConfig ||
      route.routeConfig.loadChildren ||
      route.routeConfig.children
    );
  }

  /**根据快照获取URL地址*/
  getUrl(route: ActivatedRouteSnapshot): string {
    let url = UtilRouter.getUrl(route);
    return url;
  }
}
