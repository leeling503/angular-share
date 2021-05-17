
import { ActivatedRouteSnapshot } from "@angular/router";
export interface ReuseTabCached {
  title: string;
  url: string;
  /** 是否可关闭，默认：`true` */
  closable?: boolean;
  _snapshot: ActivatedRouteSnapshot;
  _handle: any;
}

export interface ReuseTabNotify {
  /** 事件类型 */
  active: string;

  [key: string]: any;
}

export type CloseType = 'close' | 'closeOther' | 'closeRight' | 'clear' | null;

export interface ReuseContextCloseEvent {
  type: CloseType;
  item: TabComponent;
  includeNonCloseable: boolean;
}

export interface ReuseContextEvent {
  event: MouseEvent;
  item: TabComponent;
  // comp?: ReuseTabContextComponent;
}

export class TabComponent {
  index?: number;//下标
  label?: string;//
  title?: string;//标题
  active?: boolean;//是否是激活（选中）状态
  disabled?: boolean;//是否禁用
  closable?: boolean;//是否可以关闭
  url?: string;
  last?: boolean;//是否最后一个tab
  constructor() { }
}
