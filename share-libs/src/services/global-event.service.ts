import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

/**全局事件服务商 */
@Injectable({ providedIn: 'root' })
export class GlobalEventService {
  /**存储事件上一次的value */
  private _datas = {};
  /**事件主体 */
  private _event$ = new Subject<GlEventInfo>();
  /**事件Map集合<事件名,{id:回调函数}> */
  private _eventMap: Map<GlEvenName, { [id: string]: Function[] }> = new Map();

  constructor() {
    this._event$.subscribe((data: GlEventInfo) => this._onEvent(data));
  }

  /**
   * 通知订阅触发事件
   * @param event事件名
   * @param value数据
   */
  next<T>(event: GlEvenName, value: T): void {
    let current = this._datas[event];
    if (current !== value) {
      this._datas[event] = value;
      this._event$.next({
        event: event,
        data: value
      });
    }
  }

  /**
   * 订阅事件
   * @param event事件名
   * @param id用于移除部分监听
   * @param callback回调函数
   */
  subscribe(event: GlEvenName, id: string, callback: Function): GlEventUn {
    let subscriber = this._eventMap.get(event) || Object.create(null);
    let cbs = subscriber[id] = subscriber[id] || [];
    cbs.push(callback);
    this._eventMap.set(event, subscriber);
    return { un: () => { delete subscriber[id] } }
  }

  /**
  * 移除订阅事件
  * @param event事件名
  * @param id用于移除部分监听(不传将会导致所有该事件的订阅全部取消)
  */
  unsubscribe(event: GlEvenName, id?: string): void {
    if (id) {
      let subscriber = this._eventMap.get(event) || Object.create(null);
      delete subscriber[id]
    } else {
      this._eventMap.delete(event);
    }
  }

  /**触发事件回调函数 */
  private _onEvent(evenInfo: GlEventInfo): void {
    let subscriber = this._eventMap.get(evenInfo.event) || Object.create(null);
    let data = evenInfo.data;
    for (const key in subscriber) {
      let cbs = subscriber[key] || [];
      cbs.forEach(cb => {
        cb.call(null, data)
      })
    }
  }
}

interface GlEventInfo { event: GlEvenName, data: any };
interface GlEventUn { un: () => void }
/**事件名需先在GlName注册 */
type GlEvenName = keyof GlName;

/**事件集合类型 */
interface GlName {
  GLOBAL?: GlEvenName;
  CHANGE?: GlEvenName;
}

/**全局事件名称集合*/
export const GLNAME: GlName = {
  GLOBAL: 'GLOBAL',
  CHANGE: 'CHANGE'
}

/**全局事件ID集合*/
export const GLID = {
  /** XX事件 */
  GLOBAL: {
    /**该id对应的回调函数的作用：监听后将改变tab的宽度*/
    name: 'name'
  },
  CHANGE: {
    name2: 'name2'
  }
}

