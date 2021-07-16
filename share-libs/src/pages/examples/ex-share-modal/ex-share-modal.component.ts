import { CdkPortal, ComponentPortal, TemplatePortal } from "@angular/cdk/portal";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { Component, TemplateRef, ViewChild } from "@angular/core";
import { ShareBtn } from "share-libs/src/components/button/share-buttom";
import { ShareModalService } from "share-libs/src/components/modal/modal.service";
import { ShareModalRef } from "share-libs/src/components/modal/modalRef.service";
import { ShareModalPara } from "share-libs/src/components/modal/share-modal.model";
import { TypeBtn } from "share-libs/src/enum";
import { ShareOverlayService } from "share-libs/src/services/share-overlay.service";
import { ExShareSelectComponent } from "../ex-share-select/ex-share-select.component";

@Component({
    templateUrl: './ex-share-modal.component.html',
    styleUrls: ['./ex-share-modal.component.less']
})
export class ExShareModalComponent {
    @ViewChild(CdkPortal, { static: true }) ddd: TemplatePortal<any>;
    constructor(private modal_: ShareModalService, private overlay_: ShareOverlayService) { }
    btnA: ShareBtn = {
        click: () => { this.openModal() }
    }



    openModal() {
        let fig: ShareModalPara = {
            width: '50%',
            btns: ['primary', 'close'],
            modalPara: { title: '弹窗' },
            onCbClose: (data) => { console.log(data) },
            // template: this.ddd,
            // component: ExShareSelectComponent,
            // componentPara: {
            //     option: []
            // },
            position: { x: 300, y: 150 }
        }
        let ref = this.modal_.openModal(fig);
        let ref2 = this.modal_.openTipModal();
        ref.getComponentInstabce

        // let ref: ShareModalRef = this.modal_.openModal(fig);
        ref.emitAfterOpen.subscribe(res => {
            let instal = ref.getInstance();
            let comp = ref.getComponentInstabce();
            let comA = instal.component;
        });
        let ref5 = this.overlay_.showComponent(new ComponentPortal(ExShareSelectComponent))
        setTimeout(() => {
            let modal = ref.getInstance();
            modal.title = 'asds';
            modal.footerBtns = [{ type: TypeBtn.danger, text: 'asd' }]
            // modal.overlayRef.detach()
            console.log(ref5.component)
        }, 5000);
    }
}