import { Injectable } from '@angular/core';
import { ComponentPortal, ComponentType } from '@angular/cdk/portal';
import { ShareOverlayComponent, ShareOverlayPosition, ShareOverlayService } from 'share-libs/src/services/share-overlay.service';

@Injectable({ providedIn: 'root' })
export class ContextMenuService {
  constructor(private shareOverlay_: ShareOverlayService) { }
  private overlay: ShareOverlayComponent<any>;

  openComponent<T>(event: MouseEvent, component: ComponentType<T>): T {
    let position: ShareOverlayPosition = new ShareOverlayPosition();
    position.type = 'event';
    position.event = event;
    let overlay = this.shareOverlay_.showComponent(
      new ComponentPortal(component),
      position
    )
    this.overlay = overlay;
    const instance = overlay.modalRef.instance;
    return instance
  }

  openTenplate() {

  }

  closeOverlay() {
    this.overlay && this.overlay.overlayRef.dispose();
  }

}
