import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GlobalEvent {
  /**存储事件上一次的value */
  private _datas = {};
  private _data$ = new Subject<GlEventInfoType>();
  private _dataStream$ = this._data$.asObservable();
  private _subscriptions: Map<string, { id: Array<Function> }> = new Map<string, { id: Array<Function> }>();

  constructor() {
    this._dataStream$.subscribe((data: GlEventInfoType) => this._onEvent(data));
  }

  /**
   * 通知构造函数中的订阅触发事件
   * @param 事件名
   * @param 回调函数id 用于调用和移除
   * @param 数据
   */
  notifyDataChanged(event: GlEvenName, id: string, value) {
    let current = this._datas[event];
    if (current !== value) {
      this._datas[event] = value;
      this._data$.next({
        event: event,
        data: value,
        id: id
      });
    }
  }

  /**
   * 订阅事件
   * @param 事件名
   * @param 回调函数
   */
  subscribe(event: GlEvenName, id: string, callback: Function) {
    let subscriber = this._subscriptions.get(event) || {};
    let subscribers = subscriber[id] || [];
    subscribers.push(callback);
    this._subscriptions.set(event, subscribers);
  }

  /**
  * 移除订阅事件
  * @param 事件名
  * @param 回调函数id用于移除
  */
  unsubscribe(event: GlEvenName, id: string) {
    let subscriber = this._subscriptions.get(event) || {};
    delete subscriber[id]
  }

  /**触发事件回调函数 */
  private _onEvent(evenInfo: GlEventInfoType) {
    let subscriber = this._subscriptions.get(evenInfo.event) || {};
    let subscribers = subscriber[evenInfo.id] || [];
    subscribers.forEach((callback) => {
      callback.call(null, evenInfo.data);
    });
  }
}


/**全局gl事件名称集合，键值必须一样 必须在此处调用并写入GlEvenName */
export const ONNAME = {
  CHNGE: 'CHNGE',
  GOOD: 'GOOD'
}
type GlEvenName = keyof typeof ONNAME;
interface GlEventInfoType { event: GlEvenName, id: string, data: any };
