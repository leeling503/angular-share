import { Attribute, Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ReuseCachedCtr } from 'share-libs/src/services/route-reuse/reuse-tab';
import { UtilChangesValue } from 'share-libs/src/utils';

/**复用按钮滑动控制组件 */
@Component({
  selector: 'cache-scroll-ctr',
  templateUrl: './cache-scroll-ctr.component.html',
  styleUrls: ['./cache-scroll-ctr.component.less']
})
export class CacheScrollCtrComponent implements OnInit {

  constructor() { }
  @Input() inChange: ReuseCachedCtr;
  /**滚动控制按钮的显影 */
  showScrollCtr: boolean = false;
  /**禁用前一个 */
  disableBefore: boolean = false;
  /**禁用后一个 */
  disableAfter: boolean = false;
  /**X方向的总偏移量*/
  offX: number = 0;
  /**每次X方向的偏移量*/
  moveSize: number = 200;
  @ViewChild('viewEl', { static: true, read: ElementRef }) viewEl: ElementRef;
  @ViewChild('scrollEl', { static: true, read: ElementRef }) scrollEl: ElementRef;

  /**可视区域宽度 */
  get viewWidth() {
    let navEl: HTMLElement = this.viewEl.nativeElement;
    return navEl.offsetWidth - 39 * 2
  }

  /**所有复用路由总宽度 */
  get allWidth() {
    let navEl: HTMLElement = this.scrollEl.nativeElement;
    return navEl.offsetWidth
  }

  get activeEl(): HTMLElement {
    let el: HTMLElement = this.scrollEl.nativeElement.querySelector('.active-item');
    return el;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (UtilChangesValue(changes, 'inChange')) {
      setTimeout(() => { this.reuseRouteChange(); }, 10);
    }
  }

  ngOnInit() { }

  /**路由缓存按钮组有变化 */
  reuseRouteChange() {
    if (!this.activeEl || this.viewWidth > this.allWidth) {
      /**可视区域足够 */
      this.showScrollCtr = false;
      this.offX = 0;
      return
    }
    this.showScrollCtr = true;
    let offx = this.activeEl.offsetLeft, width = this.activeEl.offsetWidth;
    if (this.offX + this.viewWidth < offx + width) {
      /**激活tab右侧超出右边界*/
      this.offX = this.offX + (offx + width - this.offX - this.viewWidth);
    } else if (this.offX > offx) {
      /**激活tab左侧超出左边界*/
      this.offX = offx;
    } else if (this.offX + this.viewWidth < offx) {
      /**激活tab左侧超出右边界*/
      this.offX = offx;
    }
    /**设置滑动按钮状态 */
    this.disableAfter = false;
    this.disableBefore = false;
    if (this.offX === 0) { this.disableBefore = true; }
    if (this.offX + this.viewWidth >= this.allWidth) { this.disableAfter = true; }
  }

  /**页面点击滑动按钮 */
  onScrollMove(type: string) {
    if (type === 'after' && !this.disableAfter) {
      let x = this.allWidth - this.viewWidth - this.offX;
      this.offX = this.offX + (x > this.moveSize ? this.moveSize : x);
      this.disableBefore = false;
      this.disableAfter = x <= this.moveSize;
    } else if (type === "before" && !this.disableBefore) {
      let x = this.offX - this.moveSize;
      this.offX = x > 0 ? x : 0;
      this.disableBefore = this.offX == 0;
      this.disableAfter = false;
    }
  }
}
