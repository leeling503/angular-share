import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from '../layout-menu';
import { LayoutMenuServer } from '../layout-menu.service';

@Component({
  selector: 'layout-side-menu',
  templateUrl: './layout-side-menu.component.html',
  styleUrls: ['./layout-side-menu.component.less']
})
export class LayoutSideMenuComponent implements OnInit {
  constructor(private router: Router, private menu_: LayoutMenuServer) { }
  /**侧边栏菜单 */
  sideMenus: MenuItem[];
  /**菜单栏状态 */
  listClose: boolean = false;
  /**展开的菜单id */
  openMenus: any = {};
  ngOnInit(): void {
    this.menu_.getSideMenu().subscribe(menus => { this.sideMenus = menus; });
  }

  setMenuWidth() {
    this.listClose = !this.listClose;
  }

  /**菜单点击事件 */
  onSelectMenu(event: MouseEvent, menu: MenuItem) {
    event.stopPropagation();
    let name = (<HTMLElement>event.target).className;
    let url = menu.url;
    if (name.includes('open-sub')) {
      menu.openSub = !menu.openSub;
      return;
    }
    if (name !== "menu-name" || !url) {
      menu.openSub = !menu.openSub;
    }
    if (url) {
      this.router.navigateByUrl(url)
    }
  }

  ngOnDestroy(): void { }

}
