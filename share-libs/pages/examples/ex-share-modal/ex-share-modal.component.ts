import { CdkPortal, TemplatePortal } from "@angular/cdk/portal";
import { Component, ElementRef, TemplateRef, ViewChild, ViewContainerRef } from "@angular/core";
import { ShareParaBtn } from "share-libs/modules/button/share-button.model";
import { ShareModalService } from "share-libs/modules/modal/share-modal.service";
import { ShareModalPara } from "share-libs/modules/modal/share-modal.model";
import { ShareOverlayService } from "share-libs/services/share-overlay.service";
import { UtilSleep } from "share-libs/utils";
import { ExShareSelectComponent } from "../ex-share-select/ex-share-select.component";
import { TypeBtn } from "share-libs/enum";
import { ShareModalRef } from "share-libs/modules/modal/modal/share-modal.component";
import { ShareCalendarBaseComponent } from "share-libs/modules/date-picker/calendar-base/calendar-base.component";

@Component({
    templateUrl: './ex-share-modal.component.html',
    styleUrls: ['./ex-share-modal.component.less']
})
export class ExShareModalComponent {
    @ViewChild(CdkPortal, { static: true }) dddPortal: TemplatePortal<any>;
    @ViewChild('ddd', { static: true }) ddd: TemplateRef<any>;
    @ViewChild('dddPortal', { read: ViewContainerRef, static: true }) dddV: ViewContainerRef;
    constructor(private modal_: ShareModalService, private overlay_: ShareOverlayService, private ele_: ElementRef) {
        this.eleNative = this.ele_.nativeElement
    }
    eleNative: HTMLElement
    ele: HTMLElement
    btnA: ShareParaBtn = {
        click: ($event) => { this.openModal($event) },
        text: '服务展示组件'
    }
    name = 'asdasdas'

    ngAfterViewInit(): void {
        this.ele = this.eleNative.querySelector('.asd')
    }

    openModal($event) {
        let c = this.overlay_.show(ShareCalendarBaseComponent);
        // c.modalRef.instance.
        // let a = this.overlay_.show(this.ddd, undefined, undefined, this.dddV);
        // new UtilSleep()
        //     .sleep(() => { a.overlayRef.detach(); return 2 }, 1)
        //     .sleep((res) => { console.log(res); c.modalRef.destroy() }, 1)
    }

    onShowTemplate() {
        this.overlay_.show(this.ddd, undefined, undefined, this.dddV)
    }

    onShowPortal() {
        this.overlay_.show(this.dddPortal)
    }

    /**打开提示类型弹窗 */
    onTipModalOpen() {
        let m = this.modal_.openTipModal({
            title: '默认的',
            type: 'none',
            info: '',
            btns: ['close', 'primary', 'cancel']
        }).onOpen(e => {
            let data = e.data;
            data.title = "打开后改变title";
            let instance = data.getComponentInstabce();
            instance.info = "打开后改变info";
            instance.type = 'success';
            new UtilSleep()
                .sleep((data) => { console.log(data); instance.type = 'tip'; instance.info = "打开1s后改变info"; return '1' }, 1)
                .sleep((data) => { console.log(data); instance.type = 'error'; instance.info = "打开2s后改变info"; return '2' }, 1)
                .sleep((data) => { console.log(data); instance.type = 'warning'; instance.info = "5s将关闭弹窗"; return '3' }, 1)
                .sleep((data) => { m.emitClose({ closeType: 1 }) });
        }).onClose(e => { console.log(e) });
    }

    /**打开组件类型弹窗 */
    onComponentOpen() {
        let btn = new ShareParaBtn();
        btn.text = 'asdasd';
        btn.type = TypeBtn.primary;
        let a: ShareModalRef<ExShareSelectComponent> = this.modal_.openModal({
            title: '弹出选择框组件',
            width: '50%',
            height: 500,
            component: ExShareSelectComponent,
            componentPara: { optionC: [] },
            overlayer: {
                backdropClass: 'E_O_shade'
            },
            btns: [
                'close',
                'primary',
                { text: '外部生成按钮', width: 60, type: TypeBtn.danger, click: () => { this.btnClick(a) } },
                'cancel'
            ]
        }).onClose(res => { console.log(res) }).onCloseBefor(res => {
            let flag = res.closeType === 0;
            flag && this.modal_.openTipModal({ type: 'error', info: '校验未通过，请确认!', btns: ['primary'] });
            return false
        });
    }

    btnClick(a: ShareModalRef<ExShareSelectComponent>) {
        let instance = a.getInstance();
        instance.emitClose()
    }

    onPositionByEle() {
        this.overlay_.show(this.dddPortal, { type: 'ele', element: this.ele, y: 20 })
    }
}


