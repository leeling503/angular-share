import { Directive, Input, HostListener, Output, EventEmitter } from '@angular/core';
import { ContextMenuEvent, ReuseTabCached } from 'share-libs/src/services/route-reuse/reuse-tab';
import { ContextMenuService } from '../../../services/context-menu-context.service';
import { CacheCtrContextMenuComponent } from './ctr-context-menu/cache-ctr-context-menu.component';

@Directive({
  selector: '[context-menu]'
})
export class ReuseTabContextDirective {
  constructor(private contextMenu_: ContextMenuService) { }
  @Input('context-menu') item: ReuseTabCached;
  @Output() onChange: EventEmitter<ContextMenuEvent> = new EventEmitter()
  menuInstance: CacheCtrContextMenuComponent;


  @HostListener('contextmenu', ['$event'])
  onContextMenu(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.menuInstance = this.contextMenu_.openComponent(event, CacheCtrContextMenuComponent);
    this.menuInstance.event = event;
    this.menuInstance.item = this.item;
    this.menuInstance.closeAction.subscribe(res => {
      this.onChange.emit(res);
      this.contextMenu_.closeOverlay();
    })
  }
}
