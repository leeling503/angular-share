import { Injectable, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from "@angular/router";
import { BehaviorSubject, Subscription } from "rxjs";
import { filter } from "rxjs/operators";
import { Account } from "share-libs/src/models/share-account";
import { AccountService } from "share-libs/src/services/account.service";
import { UtilArrayGetAncestorByValue, UtilArrayGetOByValue, UtilArrayNonNull, UtilArraySetKeyValue, UtilArraySetKeyValueByValue } from "share-libs/src/utils/util-array";
import { MenuItem, SYSTEM_MENU } from "./layout-menu";

/**不要在模块中注册，退出模块后不会再次运行constructor无法再次监听路由事件 */
@Injectable({providedIn:'root'})
export class LayoutMenuServer implements OnDestroy {
    constructor(private account_: AccountService, private router: Router) {
        this.set_MenuShowByAuth(this._menus);
        this._router$ = this.router.events.pipe(
            filter(event => event instanceof NavigationEnd),
        ).subscribe((navigation: NavigationEnd) => {
            let curUrl = navigation.urlAfterRedirects;
            this.go_HasAuthPage(this._menus, curUrl);
            this.set_MenuActiveStatus(this._menus, curUrl);
            this._ancestor = UtilArrayGetAncestorByValue(this._menus, 'url', curUrl)
        })
    }
    private _router$: Subscription;
    /**整体菜单 */
    private _menus = SYSTEM_MENU;
    /**激活的祖先菜单 */
    private _ancestor: MenuItem;
    sideMenu$: BehaviorSubject<any> = new BehaviorSubject([]);

    /**获取菜单 */
    getMenu(): MenuItem[] {
        return this._menus;
    }

    getSideMenu(): MenuItem[] {
        return this._ancestor.children;
    }

    /**根据用户信息设置菜单的显隐 */
    set_MenuShowByAuth(menus: MenuItem[]): void {
        if (UtilArrayNonNull(menus)) {
            for (let i = 0, len = menus.length; i < len; i++) {
                let el = menus[i];
                el.ifShow = this.account_.hasAuthority(el.authCode);
                if (el.ifShow) {
                    this.set_MenuShowByAuth(el.children);
                }
            }
        }
    }

    /**设置菜单激活状态 */
    set_MenuActiveStatus(menus: MenuItem[], url): void {
        UtilArraySetKeyValue(menus, 'active', false);
        UtilArraySetKeyValueByValue(menus, 'url', url, 'active', true)
    }

    /**判断当前路由是否有权限， 没有权限就获取有权限路由菜单进行跳转 */
    go_HasAuthPage(menus: MenuItem[], url) {
        let menu = UtilArrayGetOByValue(menus, 'url', url);
        let auth = menu.ifShow;
        if (!auth) {
            menu = this.get_MenuByAuth(menus);
            this.router.navigateByUrl(menu.url)
        }
    }

    get_MenuByAuth(arr: Array<MenuItem>): MenuItem {
        if (UtilArrayNonNull(arr)) {
            for (let i = 0, len = arr.length; i < len; i++) {
                let el = arr[i];
                if (el && el.ifShow == true && el.url) {
                    return el;
                } else {
                    let obj = this.get_MenuByAuth(el.children);
                    if (obj) {
                        return obj;
                    }
                }
            }
        }
    }

    ngOnDestroy() {
        this._router$.unsubscribe()
    }
}