import { Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ReuseCachedCtr } from 'share-libs/src/services/route-reuse/reuse-tab';
import { UtilChanges } from 'share-libs/src/utils';

@Component({
  selector: 'cache-scroll-ctr',
  templateUrl: './cache-scroll-ctr.component.html',
  styleUrls: ['./cache-scroll-ctr.component.less']
})
export class CacheScrollCtrComponent implements OnInit {

  constructor() { }
  @Input() inActive: ReuseCachedCtr;
  /**滚动控制按钮的显影 */
  showScrollCtr: boolean = false;
  disableScrollBefore: boolean = true;
  disableScrollAfter: boolean = true;
  /**X的偏移量*/
  offX: number = 0;
  /**X的偏移量*/
  moveSize: number = 200;
  @ViewChild('viewEl', { static: true, read: ElementRef }) viewEl: ElementRef;
  @ViewChild('scrollEl', { static: true, read: ElementRef }) scrollEl: ElementRef;
  get viewWidth() {
    let navEl: HTMLElement = this.viewEl.nativeElement;
    return navEl.clientWidth
  }
  get scrollWidth() {
    let navEl: HTMLElement = this.scrollEl.nativeElement;
    return navEl.clientWidth
  }

  get activeEl(): HTMLElement {
    let el: HTMLElement = this.scrollEl.nativeElement.querySelector('.active-item');
    return el;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (UtilChanges(changes, 'inActive')) {
      // this.moveOnActive()
    }
  }
  ngOnInit() { }
  ngAfterContentInit(): void {
    this.contentWidthChange()
  }

  ngAfterContentChecked(): void {
    this.contentWidthChange();
    this.moveOnActive()
  }

  moveOnActive() {
    if (!this.activeEl || this.coerec) { this.coerec = false; return }
    let offx = this.activeEl.offsetLeft, width = this.activeEl.clientWidth;
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
  }
  coerec: boolean = false;
  onScrollMove(type: string) {
    this.coerec = true;
    if (type === 'after') {
      let x = this.scrollWidth - this.viewWidth - this.offX;
      this.offX = this.offX + (x > this.moveSize ? this.moveSize : x);
    } else if (type === "before") {
      let x = this.offX - this.moveSize;
      this.offX = x > 0 ? x : 0;
    }
  }

  /**决定是否显示控制按钮 */
  contentWidthChange() {
    if (this.viewWidth < this.scrollWidth) {
      this.showScrollCtr = true;
    } else {
      this.showScrollCtr = false;
    }
  }
}
