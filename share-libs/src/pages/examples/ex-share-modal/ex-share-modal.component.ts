import { TemplatePortal } from "@angular/cdk/portal";
import { Component, ElementRef, TemplateRef, ViewChild, ViewContainerRef } from "@angular/core";
import { ShareBtn } from "share-libs/src/components/button/share-buttom";
import { ShareModalService } from "share-libs/src/components/modal/modal.service";
import { ShareModalPara } from "share-libs/src/components/modal/share-modal.model";
import { ShareOverlayService } from "share-libs/src/services/share-overlay.service";
import { UtilSleep } from "share-libs/src/utils";
import { ExShareSelectComponent } from "../ex-share-select/ex-share-select.component";

@Component({
    templateUrl: './ex-share-modal.component.html',
    styleUrls: ['./ex-share-modal.component.less']
})
export class ExShareModalComponent {
    @ViewChild('ddd', { static: true }) ddd: TemplateRef<any>;
    @ViewChild('dddPortal', { read: ViewContainerRef, static: true }) dddV: ViewContainerRef;
    constructor(private modal_: ShareModalService, private overlay_: ShareOverlayService, private ele_: ElementRef) {
        this.eleNative = this.ele_.nativeElement
    }
    eleNative: HTMLElement
    ele: HTMLElement
    btnA: ShareBtn = {
        click: ($event) => { this.openModal($event) }
    }
    name = 'asdasdas'

    ngAfterViewInit(): void {
        //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
        //Add 'implements AfterViewInit' to the class.
        this.ele = this.eleNative.querySelector('.asd')
    }



    openModal($event) {
        let fig: ShareModalPara<ExShareSelectComponent> = {
            width: '50%',
            height: '50%',
            btns: ['primary', 'close'],
            modalPara: { title: '弹窗' },
            template: this.ddd,
            position: { x: 300, y: 150, type: 'ele', element: this.ele }
        }
        // let ref = this.modal_.openModal(fig);
        let templateP = new TemplatePortal(this.ddd, this.dddV);
        let c = this.overlay_.show(ExShareSelectComponent);
        let a = this.overlay_.show(this.ddd, undefined, undefined, this.dddV);
        new UtilSleep()
            .sleep(() => { a.modalRef.destroy(); return 2 }, 1)
            .sleep((res) => { console.log(res); c.modalRef.destroy() }, 1)
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
        this.modal_.openModal({
            title: '弹出选择框组件',
            width: '50%',
            component: ExShareSelectComponent,
            btns: ['close', 'primary']
        }).onClose(res => { console.log(res) }).onCloseBefor(res => { return false });
    }
}


