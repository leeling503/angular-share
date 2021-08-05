import { Overlay } from '@angular/cdk/overlay';
import { ShareOverlayConfig, ShareOverlayPosition, ShareOverlayService } from '../../services/share-overlay.service';

import { Injectable } from '@angular/core';
import { ShareModalPara, ShareModalTip } from './share-modal.model';
import { ShareModalComponent } from './modal/modal.component';
import { ComponentPortal } from '@angular/cdk/portal';
import { ShareModalRef } from './modalRef.service';
import { ShareModalTipComponent } from './modal-tip/modal-tip.component';
@Injectable({
    providedIn: 'root'
})
export class ShareModalService {
    constructor(private shareOverlayer: ShareOverlayService, private overlay: Overlay) { }

    /**打开弹窗 , 返回弹窗的实例*/
    openModal<T>(para: ShareModalPara<T> = {}): ShareModalRef<T> {
        this.setModalPara(para);
        this.setPosition(para);
        this.setOverlayer(para);
        let modalRef = this.createModal(para);
        /**关闭的回调 */
        para.onCbClose && modalRef.emitAfterClose.subscribe(res => {
            para.onCbClose(res)
        })
        return modalRef;
    }

    /**打开提示类型弹窗 , 返回弹窗的实例*/
    openTipModal(tip: ShareModalTip = new ShareModalTip()): ShareModalRef<ShareModalTipComponent> {
        let data: Partial<ShareModalTipComponent> = {
            type: tip.type,
            info: tip.info
        }, para: ShareModalPara<ShareModalTipComponent> = {}, modal = new ShareModalTip();
        modal.overlayer.width = 370, modal.overlayer.height = 220, modal.overlayer.backdropClick = false, modal.overlayer.backdropClass = 'E_O_shade';
        para.component = ShareModalTipComponent;
        para.componentPara = data;
        tip.overlayer = Object.assign(modal.overlayer, tip.overlayer);
        para = Object.assign(para, tip);
        return this.openModal(para)
    }

    /**设置弹窗组件的属性 */
    private setModalPara(para: ShareModalPara) {
        let m = Object.assign(para.modalPara || {}, para);
        para.modalPara = m;
    }

    /**设置弹窗的属性 */
    private setOverlayer(para: ShareModalPara) {
        let p = Object.assign(para.overlayer || {}, para);
        let o = new ShareOverlayConfig(p);
        para.overlayer = o;
    }

    /**设置弹窗的位置 */
    private setPosition(para: ShareModalPara) {
        let o = Object.assign(para.position || {}, para);
        let p = new ShareOverlayPosition(o);
        para.position = p;
    }

    private createModal<T>(para: ShareModalPara<T>): ShareModalRef {
        let show = this.shareOverlayer.showComponent(ShareModalComponent, para.position, para.overlayer);
        para.modalPara.overlayRef = show.overlayRef;
        this.shareOverlayer.instanceComponent(show, para.modalPara);
        return show.modalRef.instance
    }

}
