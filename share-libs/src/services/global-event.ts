import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GlobalEvent {
  /**存储事件上一次的value */
  private _datas = {};
  private _data$ = new Subject<GlEventInfoType>();
  private _dataStream$ = this._data$.asObservable();
  private _subscriptions: Map<GlEvenName, { [id: string]: Function[] }> = new Map();

  constructor() {
    this._dataStream$.subscribe((data: GlEventInfoType) => this._onEvent(data));
  }

  /**
   * 通知构造函数中的订阅触发事件
   * @param 事件名
   * @param 回调函数id 用于调用和移除
   * @param 数据
   */
  notifyDataChanged<T>(event: GlEvenName, value: T) {
    let current = this._datas[event];
    if (current !== value) {
      this._datas[event] = value;
      this._data$.next({
        event: event,
        data: value
      });
    }
  }

  /**
   * 订阅事件
   * @param 事件名
   * @param 回调函数id 用于调用和移除 推荐使用
   * @param 回调函数
   */
  subscribe(event: GlEvenName, id: string, callback: Function) {
    let subscriber = this._subscriptions.get(event) || {};
    let cbs = subscriber[id] = subscriber[id] || [];
    cbs.push(callback);
    this._subscriptions.set(event, subscriber);
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
    let data = evenInfo.data;
    for (const key in subscriber) {
      if (Object.prototype.hasOwnProperty.call(subscriber, key)) {
        let cbs = subscriber[key] || [];
        cbs.forEach(cb => {
          cb.call(null, data)
        })
      }
    }
  }
}

type GlEvenName = keyof typeof ONNAME;
interface GlEventInfoType { event: GlEvenName, data: any };


/**全局gl事件名称集合，键值必须一样 必须在此处调用并写入GlEvenName */
export const ONNAME = {
  CHNGE: 'CHNGE',
  GOOD: 'GOOD'
}

