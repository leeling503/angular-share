import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { Subject } from 'rxjs';
import { CloseType, ContextMenuEvent, ReuseTabCached } from 'share-libs/src/services/route-reuse/reuse-tab';


@Component({
  selector: 'cache-ctr-context-menu',
  templateUrl: './cache-ctr-context-menu.component.html',
  styleUrls: ['./cache-ctr-context-menu.component.less'],
  preserveWhitespaces: false
})
export class CacheCtrContextMenuComponent implements OnInit {
  @Input() item: ReuseTabCached;
  @Input() event: MouseEvent;
  constructor() { }
  closeAction: Subject<ContextMenuEvent> = new Subject()

  get coerceClose() {
    return this.event.ctrlKey;
  }

  private notify(type: CloseType, item: ReuseTabCached) {
    this.closeAction.next({
      type,
      item: this.item,
      coerceClose: this.coerceClose
    });
  }

  ngOnInit(): void {
    if (this.coerceClose) this.item.closable = true;
  }

  click(e: MouseEvent, type: CloseType) {
    e.preventDefault();
    e.stopPropagation();
    if (type === 'close' && !this.item.closable) return; // 如果关闭时，当前tab 不可关闭
    if (type === 'closeRight' && this.item.ifRight) return; // 如果关闭右边tab，当前tab 为最后一个
    this.notify(type, this.item);
  }

  @HostListener('document:click', ['$event'])
  @HostListener('document:contextmenu', ['$event'])
  private closeMenu(event: MouseEvent): void {
    if (event.type === 'click' && event.button === 2) return;
    this.notify(null, null);
  }

}
