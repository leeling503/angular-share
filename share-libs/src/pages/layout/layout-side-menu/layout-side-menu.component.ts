import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutMenuServer } from '../layout-menu.service';

@Component({
  selector: 'layout-side-menu',
  templateUrl: './layout-side-menu.component.html',
  styleUrls: ['./layout-side-menu.component.less']
})
export class LayoutSideMenuComponent implements OnInit {
  constructor(private router: Router, private menu_: LayoutMenuServer) {
  }
  menuList: any;
  listClose: boolean = false;
  s_menu: any;
  expendShow: Array<any> = [];

  ngOnInit(): void {
   this.menu_.getSideMenu()
  }

  getMenuByUrl(url) {
    let menu = [];
    this.menuList.forEach(element => {
      let e = element.menus.filter(e => e.path == url)
      if (e.length > 0) {
        menu.push(...e);
      }
    });
    return menu[0]
  }

  setMenuWidth() {
    this.listClose = !this.listClose;
  }

  ngOnDestroy(): void {
  }

  onRouteJump(item) {
    this.s_menu = item;
    if (item.path) {
      this.router.navigateByUrl(item.path);
    }
    return false;
  }
}
