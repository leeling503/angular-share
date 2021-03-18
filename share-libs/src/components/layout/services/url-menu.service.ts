
import { Injectable } from "@angular/core";
import { SETTING_MENU, GONGSI_MENUS } from '../layout.menu';
import { Menu } from '../models';

@Injectable({ providedIn: 'root' })
export class UrlMenuService {
    menuList: Menu[] = [...GONGSI_MENUS, ...SETTING_MENU]
    constructor() { }
    getMenuByUrl(url): Menu {
        let menu = [];
        this.menuList.forEach(element => {
            let menus = element.menus;
            if (element.path == url) {
                menu.push(element);
                return ;
            } else if (menus) {
                let e = menus.filter(e => e.path == url)
                if (e.length > 0) {
                    menu.push(...e);
                }
            }
        });
        return menu[0]
    }
}