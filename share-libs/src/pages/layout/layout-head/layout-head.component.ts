import { ClassStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IconClass } from 'share-libs/src/enum';
import { UtilIsFunction, UtilIsUndefined } from 'share-libs/src/utils';
import { LoginService } from '../../login/login.service';
import { MenuItem, SYSTEM_MENU } from '../layout-menu';
import { LayoutMenuServer } from '../layout-menu.service';

@Component({
  selector: 'layout-head',
  templateUrl: './layout-head.component.html',
  styleUrls: ['./layout-head.component.less']
})
export class LayoutHeadComponent implements OnInit {
  constructor(private router: Router, private login_: LoginService, private menu_: LayoutMenuServer) { }
  menus: MenuItem[];
  headBtns: HeadBtn[] = [
    { icon: IconClass.logout, title: '退出', onClick: () => { this.onLogout() } }
  ]

  ngOnInit() {
    this.menus = this.menu_.getMenu();
  }

  onMenuToPage(menu: MenuItem) {
    this.menu_.setSideMenu(menu);
    this.router.navigateByUrl(menu.url, { queryParams: {} })
  }

  onClickBtn(btn: HeadBtn) {
    if (UtilIsFunction(btn.onClick)) {
      btn.onClick();
    }
  }

  onLogout() {
    this.login_.logout();
    this.router.navigateByUrl("/login");
  }

}

interface HeadBtn {
  icon: IconClass;
  title: string;
  onClick: () => void;
}