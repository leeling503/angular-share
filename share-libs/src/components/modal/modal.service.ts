import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ShareOverlayService } from './../../servers/share-overlay.service';

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
    private modalRef: ComponentRef<ShareModalComponent> | null; // Modal ComponentRef, "null" means it has been destroyed
    constructor(private shareOverlayer: ShareOverlayService, private overlay: Overlay) { }

    getOverlayRef(): OverlayRef {
        return this.overlayRef;
    }

    getModalRef(): ComponentRef<ShareModalComponent> {
        return this.modalRef;
    }

    /**
     * 打开弹窗
     * @param para ShareModalPara
     */
    openModal<T>(para: ShareModalPara<T> = {}): ShareModalRef<T> {
        para.modalPara = para.modalPara || {};
        this.overlayRef && this.overlayRef.detach();
        this.createModal(para);
        return this.modalRef.instance;
    }

    createModal(para: ShareModalPara): void {
        let config = para.overlayerConfig || {};
        let positionStrategy = this.shareOverlayer.getBodyPositionStrategy({ centerHorizontally: true, centerVertically: true })
        config.positionStrategy = positionStrategy;
        this.overlayRef = this.overlay.create(config);
        this.modalRef = this.overlayRef.attach(new ComponentPortal(ShareModalComponent));
        para.modalPara.overlayRef = this.overlayRef;
        this.changeProps(para);
    }

    private changeProps(options: ShareModalPara): void {
        if (this.modalRef) {
            if (options.modalComponent) {
                options.modalPara.modalComponent = options.modalComponent;
                options.modalPara.modalComponentPara = options.modalComponentPara || {};
            }
            Object.assign(this.modalRef.instance, options.modalPara);
        }
    }

}
