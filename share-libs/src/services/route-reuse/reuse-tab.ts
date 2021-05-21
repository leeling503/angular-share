/**复用路由数据 */
export class ReuseRouteData {
  /**复用路由的标题 */
  title: string;
  /**说明路由是否复用 */
  reuse: boolean;
  /**复用路由能否被关闭 */
  closeable: boolean;
  constructor(title?: string, reuse: boolean = true, closeable: boolean = true) {
    this.title = title;
    this.reuse = reuse;
    this.closeable = closeable
  }
}

/**复用缓存控制类 */
export interface ReuseCachedCtr {
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

/**复用路由事件通知 */
export interface ReuseCacheNotify {
  /** 事件类型 */
  action: 'change';
  list: ReuseCachedCtr[];
}

/**复用右键菜单事件 */
export interface ReuseMenuEvent {
  type: CloseType;
  item: ReuseCachedCtr;
  /**按住ctrl强制关闭不可关闭 */
  coerceClose: boolean;
}

/**关闭类型 */
export type CloseType = 'close' | 'closeOther' | 'closeRight' | 'clear' | null;