import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ShareOverlayService } from '../../services/share-overlay.service';

import { Injectable, ComponentRef } from '@angular/core';
import { ShareModalPara } from './share-modal.model';
import { ShareModalComponent } from './modal.component';
import { ComponentPortal } from '@angular/cdk/portal';
import { ShareModalRef } from './modalRef.service';
@Injectable({
    providedIn: 'root'
})
export class ShareModalService {
    private overlayRef: OverlayRef
    private modalRef: ComponentRef<ShareModalComponent<any>> | null; // Modal ComponentRef, "null" means it has been destroyed
    constructor(private shareOverlayer: ShareOverlayService, private overlay: Overlay) { }

    getOverlayRef(): OverlayRef {
        return this.overlayRef;
    }

    getModalRef<T>(): ComponentRef<ShareModalComponent<T>> {
        return this.modalRef;
    }

    /**
     * 打开弹窗
     * @param para ShareModalPara
     */
    openModal(para: ShareModalPara = {}): ShareModalRef {
        para.modalPara = para.modalPara || {};
        this.overlayRef && this.overlayRef.detach();
        this.createModal(para);
        return this.modalRef.instance;
    }

    private createModal<T>(para: ShareModalPara<T>): void {
        let config = para.overlayerConfig || {};
        let showOverlay = this.shareOverlayer.showComponent(new ComponentPortal(ShareModalComponent), undefined, config);
        this.modalRef = showOverlay.modalRef;
        para.modalPara.overlayRef = showOverlay.overlayRef;
        if (para.modalComponent) {
            para.modalPara.modalComponent = para.modalComponent;
            para.modalPara.modalComponentPara = para.modalComponentPara || {};
        }
        this.shareOverlayer.instanceComponent(showOverlay, para.modalPara);
    }

}
