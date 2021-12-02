import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

/**全局事件服务商 */
@Injectable({ providedIn: 'root' })
export class GlobalEventService {
  private i: number = 0;
  /**存储事件上一次的value */
  private _datas = {};
  /**事件主体 */
  private _event$ = new Subject<GlEventInfo>();
  /**事件Map集合<事件名,{id:回调函数}> */
  private _eventMap: Map<EventName, { [id: string]: Function[] }> = new Map();

  constructor() {
    this._event$.subscribe((data: GlEventInfo) => this._onEvent(data));
  }

  /**
   * 通知订阅触发事件
   * @param event事件名
   * @param value数据
   */
  eventNext<T>(event: EventName, value: T): void {
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
   * @param callback回调函数
   * @param behavior是否立即调用回调
   */
  eventBind(event: EventName, callback: Function, behavior: boolean = false): GlEventUn {
    let id = event + ++this.i;
    let subscriber = this._eventMap.get(event) || Object.create(null);
    let cbs = subscriber[id] = subscriber[id] || [];
    cbs.push(callback);
    if (behavior) { callback(this._datas[event] || {}); }
    this._eventMap.set(event, subscriber);
    return { id, un: () => { delete subscriber[id] } }
  }

  /**
  * 移除该事件的所有订阅
  * @param event事件名
  * @param id用于移除部分监听(不传将会导致所有该事件的订阅全部取消)
  */
  eventUn(event: EventName, id?: string): void {
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

type EventName = GlEventName;
interface GlEventInfo { event?: EventName, data?: any };
export interface GlEventUn { id: string, un: () => void }
export enum GlEventName {
  /**变更事件 */
  change = 'change',
  /**实时数据 */
  realData = 'real-data'
}

