
import { ActivatedRouteSnapshot } from "@angular/router";

class RouteData {
  /**复用路由的标题 */
  title: string;
  /**说明路由是否复用 */
  reuse: boolean;
  /**复用路由能否被关闭 */
  reuseClosable: boolean;
  constructor() { }
}

export interface ReuseTabCached {
  /**标签名 */
  title: string;
  /**url路径 */
  url: string;
  /** 是否可关闭，默认：`true` */
  closable: boolean;
  /**是否是激活状态 */
  active?: boolean;
  /**最右侧的路由*/
  ifRight?: boolean;
  /**最左侧的路由*/
  ifLeft?: boolean;
  /**离开路由时缓存的数据 */
  _handle?: any;
}

export class ReuseCacheNotify {
  /** 事件类型 */
  action: 'add' | 'close' | 'closable' | 'closeRight' | 'clear';
  list: ReuseTabCached[];
}

export type CloseType = 'close' | 'closeOther' | 'closeRight' | 'clear' | null;

export interface ContextMenuEvent {
  type: CloseType;
  item: ReuseTabCached;
  /**按住ctrl强制关闭不可关闭 */
  coerceClose: boolean;
}

export interface ReuseContextEvent {
  event: MouseEvent;
  item: ReuseTabCached;
}