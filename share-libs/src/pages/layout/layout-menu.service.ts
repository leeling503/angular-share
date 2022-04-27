import { Injectable, OnDestroy } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { BehaviorSubject, Observable, Subscription } from "rxjs";
import { filter } from "rxjs/operators";
import { AccountService } from "share-libs/src/services/account.service";
import { UtilArray } from "share-libs/src/utils/util-array";
import { MenuItem, SYSTEM_MENU } from "./layout-menu";

/**菜单服务 设置菜单的激活状态 权限  获取二级菜单  根菜单*/
@Injectable()
export class LayoutMenuServer implements OnDestroy {
    constructor(private account_: AccountService, private router: Router) {
        this.setMenuShowByAuth(this._menus);
        this._router$ = this.router.events.pipe(
            filter(event => event instanceof NavigationEnd),
        ).subscribe((navigation: NavigationEnd) => {
            let curUrl = navigation.urlAfterRedirects.split('?')[0];
            let ifAuth = this.goHasAuthPage(this._menus, curUrl);
            if (ifAuth) {
                this._activeMenu && (this._activeMenu.active = false);
                this._activeMenu = UtilArray.getObjByValue(this._menus, 'url', curUrl);
                this._activeMenu.active = true;
                this.setSideMenu(this._activeMenu);
                // this.setMenuActiveStatus(this._menus, curUrl)
            }
        })
    }
    private _router$: Subscription;
    /**整体菜单 */
    private _menus = SYSTEM_MENU;
    /**激活的祖先菜单 */
    private _ancestor: MenuItem;
    /**激活的最小子菜单 */
    private _activeMenu: MenuItem;
    /**二级菜单订阅主体 */
    private _sideMenu$: BehaviorSubject<MenuItem[]> = new BehaviorSubject([]);

    /**获取主菜单 */
    getMenu(): MenuItem[] {
        return this._menus;
    }

    /**二级菜单的订阅 */
    getSideMenu(): Observable<MenuItem[]> {
        return this._sideMenu$
    }

    /**根菜单变化设置二级菜单和根路由激活状态*/
    setSideMenu(menu: MenuItem) {
        let ancestor = UtilArray.getAncestorByValue(this._menus, 'url', menu.url);
        ancestor.active = true;
        if (ancestor && this._ancestor !== ancestor) {
            this._ancestor && (this._ancestor.active = false);
            this._ancestor = ancestor;
            let sideMenu = ancestor.children;
            this._sideMenu$.next(sideMenu);
        }
    }

    /**根据用户权限设置菜单的显隐 */
    setMenuShowByAuth(menus: MenuItem[]): void {
        if (UtilArray.isNonNull(menus)) {
            for (let i = 0, len = menus.length; i < len; i++) {
                let el = menus[i];
                el.ifShow = el.ifShow === undefined ? this.account_.ifAuth(el.authCode) : el.ifShow;
                if (el.ifShow) {
                    this.setMenuShowByAuth(el.children);
                }
            }
        }
    }

    /**判断当前路由是否有权限，没有权限就跳转有权限路由*/
    goHasAuthPage(menus: MenuItem[], url): boolean {
        let menu = UtilArray.getObjByValue(menus, 'url', url);
        let auth = menu && menu.ifShow;
        if (!auth) {
            menu = this.getMenuByAuth(menus);
            this.router.navigateByUrl(menu.url)
        }
        return auth;
    }

    /**获取到有权限并且设置了url的菜单 */
    getMenuByAuth(arr: Array<MenuItem>): MenuItem {
        if (UtilArray.isNonNull(arr)) {
            for (let i = 0, len = arr.length; i < len; i++) {
                let el = arr[i];
                if (el && el.ifShow == true && el.url) {
                    return el;
                } else {
                    let obj = this.getMenuByAuth(el.children);
                    if (obj) {
                        return obj;
                    }
                }
            }
        }
    }

    /**设置整条匹配路径菜单激活状态 */
    setMenuActiveStatus(menus: MenuItem[], url): MenuItem {
        UtilArray.setItemValue(menus, 'active', false);
        let s_menu = UtilArray.setItemDataByValue(menus, 'url', url, 'active', true)
        return s_menu;
    }

    ngOnDestroy() {
        this._router$.unsubscribe();
        UtilArray.setItemValue(this._menus, 'active', false);
    }
}