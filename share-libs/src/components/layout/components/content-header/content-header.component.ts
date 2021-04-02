import { filter } from 'rxjs/operators';
import { Component, ViewChild, HostListener } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { UrlMenuService } from '../../services/url-menu.service';
import { Menu } from '../../models';
import { ReuseTabService } from 'share-libs/src/components/route-reuse/reuse-tab.service';
import { TemplatePortal, CdkPortal } from '@angular/cdk/portal';
import { ShareOverlayPosition, ShareOverlayService } from 'share-libs/src/services/share-overlay.service';
@Component({
  selector: 'layout-content-header',
  templateUrl: './content-header.component.html',
  styleUrls: ['./content-header.component.less'],
  providers: [ShareOverlayService]
})
export class ContentHeaderComponent {
  reuseMenus: Menu[] = [];
  activeMenu: Menu;
  @ViewChild(CdkPortal, { static: false }) templateCDKPortal: TemplatePortal<any>;
  constructor(
    private _router: Router,
    private menuUrlS: UrlMenuService,
    private slOverlay: ShareOverlayService,
    private reuseTab$: ReuseTabService) { }
  ngOnInit(): void {
    this.addMenu()
    this._router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((nav: NavigationEnd) => {
      this.addMenu();
    })
  }

  addMenu() {
    let menu: Menu = this.menuUrlS.getMenuByUrl(this._router.url);
    this.activeMenu = menu;
    let flag = this.reuseMenus.some(e => menu && e.path == menu.path);
    if (!flag) {
      this.reuseMenus.push(menu)
    }
  }

  removeMenu(menu: Menu) {
    if (this.reuseMenus.length == 1) { return }
    let index = this.reuseMenus.findIndex(e => e.path == menu.path)
    this.closeReuse(menu.path);
    this.reuseMenus.splice(index, 1);
    let flag = this.reuseMenus.some(e => e.path == this.activeMenu.path);
    if (flag) { return; }
    let curMen = this.reuseMenus[index] || this.reuseMenus[index - 1] || this.reuseMenus[0];
    this._router.navigateByUrl(curMen.path);
  }

  closeReuse(url) {
    this.reuseTab$.close(url)
  }

  jumpCurrentMenu(menu: Menu) {
    this._router.navigateByUrl(menu.path);
  }

  closeMenu(menu: Menu) {
    event.stopPropagation();
    this.removeMenu(menu)
  }

  openContextmenu(event: MouseEvent, menu: Menu) {
    event.preventDefault();
    this.contextMenu = menu;
    let position: ShareOverlayPosition = {
      type: 'event',
      event,
    }
    this.slOverlay.createOverlay(this.templateCDKPortal, position);
  }

  contextMenu: Menu;
  closeMenuByType(type) {
    let closeMenus: Menu[];
    if (type === 'other') {
      closeMenus = this.reuseMenus.filter(e => e.path !== this.contextMenu.path && e.canClose !== false)
    } else if (type === 'right') {
      let index = this.reuseMenus.findIndex(e => e.path == this.contextMenu.path)
      closeMenus = this.reuseMenus.slice(++index);
      closeMenus = closeMenus.filter(e => e.canClose !== false);
    }
    closeMenus.forEach(e => { this.closeMenu(e) });
    this.slOverlay.clearOverlay();
  }

  @HostListener('body:click')
  clearOverlay() {
    this.slOverlay.clearOverlay();
  }

}
