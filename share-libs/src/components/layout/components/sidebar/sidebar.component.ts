import { Menu } from './../../models/menu';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { GlobalState } from 'share-libs/src/services/global-event';
import { GONGSI_MENUS, SETTING_MENU } from '../../layout.menu';
import { UrlMenuService } from '../../services/url-menu.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'layout-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.less']
})
export class SidebarComponent implements OnInit {
  menuList: any;
  listClose: boolean = false;
  s_menu: any;
  expendShow: Array<any> = [];
  constructor(private _router: Router, private gl$: GlobalState, private menuUrlS: UrlMenuService) {
  }

  ngOnInit(): void {
    this.menuList = [...GONGSI_MENUS, ...SETTING_MENU];
    this.s_menu = this.menuUrlS.getMenuByUrl(this._router.url) || this.menuList[0].menus[0];
    this._router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((nav: NavigationEnd) => {
      this.s_menu = this.menuUrlS.getMenuByUrl(this._router.url)
    })
  }

  setMenuWidth() {
    this.listClose = !this.listClose;
    this.gl$.notifyDataChanged("menuWidthChange", this.listClose);
  }

  public ngOnDestroy(): void {
  }

  routeJump(item: Menu, index?) {
    if (item.menus) {
      this.expendShow[index] = !this.expendShow[index]
    } else {
      this.s_menu = item;
      if (item.path) {
        this._router.navigateByUrl(item.path);
      }
    }
  }
}
