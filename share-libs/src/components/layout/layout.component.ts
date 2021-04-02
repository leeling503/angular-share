import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { GlobalState } from 'share-libs/src/services/global-event';
@Component({
  selector: 'app-layout',
  templateUrl: 'layout.component.html',
  styleUrls: ['./layout.component.less']

})
export class LayoutComponent {
  testMenuList: Array<any> = []; // 测试用户可见
  urlMenuList: Array<{ url: string, id: string }> = [];
  height: number = 250;
  isScrollDestroy = false;
  resizeFlat: boolean = true;
  menuClose: boolean = false;
  private routerEventSub: Subscription;
  constructor(
    private globalState: GlobalState
  ) {
    this, globalState.subscribe("menuWidthChange", (data: boolean) => {
      this.menuClose = data;
    })
  }

}
