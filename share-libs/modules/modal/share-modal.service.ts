
import { ShareOverlayConfig, ShareOverlayPosition, ShareOverlayService } from '../../services/share-overlay.service';
import { Injectable } from '@angular/core';
import { ShareModalPara, ShareModalTip } from './share-modal.model';
import { ShareModalComponent, ShareModalRef } from './modal/share-modal.component';
import { ShareModalTipComponent } from './modal-tip/share-modal-tip.component';
@Injectable({
    providedIn: 'root'
})
export class ShareModalService {
    constructor(private shareOverlayer_: ShareOverlayService) { }

    /**打开弹窗 , 返回弹窗的实例 （所有与弹窗有关的事件请挂载在返回实例上）*/
    openModal<T>(para: ShareModalPara<T> = {}): ShareModalRef<T> {
        this.setModalPara(para);
        this.setPosition(para);
        this.setOverlayer(para);
        let modalRef = this.createModal(para);
        return modalRef;
    }

    /**打开提示类型弹窗 , 返回弹窗的实例*/
    openTipModal(tip: ShareModalTip = new ShareModalTip()): ShareModalRef<ShareModalTipComponent> {
        tip = Object.assign(new ShareModalTip(), tip);
        let data: Partial<ShareModalTipComponent> = {
            type: tip.type,
            info: tip.info
        };
        tip.componentPara = data;
        return this.openModal(tip)
    }

    /**设置弹窗组件的属性 */
    private setModalPara(para: ShareModalPara) {
        /**弹窗的部分属性可设置在ShareModalPara中  如title，但以modalPara中的为主故需要此处理 */
        let m = Object.assign({}, para, para.modalPara);
        para.modalPara = m;
    }

    /**设置弹窗的属性 */
    private setOverlayer(para: ShareModalPara) {
        let p = Object.assign({}, para, para.overlayer);
        let o = new ShareOverlayConfig(p);
        para.overlayer = o;
    }

    /**设置弹窗的位置 */
    private setPosition(para: ShareModalPara) {
        let o = Object.assign({}, para, para.position);
        let p = new ShareOverlayPosition(o);
        para.position = p;
    }

    /**创建弹窗 */
    private createModal<T>(para: ShareModalPara<T>): ShareModalRef {
        let show = this.shareOverlayer_.show(ShareModalComponent, para.position, para.overlayer);
        para.modalPara.overlayRef = show.overlayRef;
        this.shareOverlayer_.instanceComponent(show, para.modalPara);
        return show.modalRef.instance
    }

}
