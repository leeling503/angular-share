import { ClassStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UtilIsFunction, UtilIsUndefined } from 'share-libs/src/utils';
import { LoginService } from '../../login/login.service';
import { MenuItem, SYSTEM_MENU } from '../layout-menu';

@Component({
  selector: 'share-layout-head',
  templateUrl: './share-layout-head.component.html',
  styleUrls: ['./share-layout-head.component.less']
})
export class ShareLayoutHeadComponent implements OnInit {
  constructor(private router: Router, private login_: LoginService) { }
  Menus: MenuItem[] = SYSTEM_MENU;
  headBtns: HeadBtn[] = [
    { icon: 'menu-logout-icon', title: '退出', onClick: () => { this.onLogout() } }
  ]
  ngOnInit() { }

  onMenuToPage(menu: MenuItem) {
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
  icon: string;
  title: string;
  onClick: () => void;
}