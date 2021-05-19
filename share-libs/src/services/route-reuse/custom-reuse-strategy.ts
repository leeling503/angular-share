import { RouteReuseStrategy, ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';
import { CustomStrategy } from './custom-strategy.service';

/**
 * 路由复用策略
 */
export class CustomReuseStrategy implements RouteReuseStrategy {

  constructor(private reuse_: CustomStrategy) { }

  /**  决定是否复用路由，根据切换的future curr的节点层级依次调用，返回值为true时表示当前节点层级路由复用，然后继续下一路由节点调用，入参为切换的下一级路由（子级）的future curr路由的节点，返回值为false时表示不在复用路由，并且不再继续调用此方法（future路由不再复用，其子级路由也不会复用，所以不需要再询问下去），root路由节点调用一次，非root路由节点调用两次这个方法，第一次比较父级节点，第二次比较当前节点*/
  public shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return this.reuse_.shouldReuseRoute(future, curr);
  }

  /** 接上一步奏，当当前层级路由不需要复用的时候，调用一下retrieve方法，其子级路由也会调用一下retrieve方法，如果返回的是null，那么当前路由对应的组件会实例化，这种行为一直持续到末级路由。*/
  public retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
    return this.reuse_.retrieve(route);
  }

  /** 是对上一路由的数据是否实现拆离，其调用开始是当前层级路由不需要复用的时候，即shouldReuseRoute()返回false的时候，如果这时候反回false，将继续到上一路由的下一层级调用shouldDetach,直到返回true或者是最末级路由后才结束对shouldDetach的调用，当返回true时就调用一次store 方法，请看下一步奏*/
  public shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return this.reuse_.shouldDetach(route);
  }

  /** 存储路分离出来的上一路由的数据，当 shouldDetach返回true时调用一次，存储应该被分离的那一层的路由的DetachedRouteHandle。注意：无论路由树上多个含有组件component路由节点，能分离出来的只能有一个，被存储的也只能有一个，感觉这种机制对使用场景有很大限制。*/
  public store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    return this.reuse_.store(route, handle);
  }

  /** 是对当前路由的数据是否实现恢复（附加回来），其调用开始是当前层级路由不需要复用的时候，即shouldReuseRoute()返回false的时候，这和shouldDetach的调用时机很像，但是，并不是所有的路由层级都是有组件实例的，只有包含component的route才会触发shouldAttach，如果反回false，将继续到当前路由的下一带有component的路由层级调用shouldAttach,直到返回true或者是最末级路由后才结束对shouldAttach的调用，当返回true时就调用一次retrieve 方法，如果retrieve方法去获取一下当前路由的DetachedRouteHandle,返回一个DetachedRouteHandle，就再调用一次store,再保存一下retrieve返回的DetachedRouteHandle。*/
  public shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return this.reuse_.shouldAttach(route);
  }

}
