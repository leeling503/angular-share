import { CdkOverlayOrigin } from "@angular/cdk/overlay";
import { EventEmitter, Input, Output, ViewChild } from "@angular/core";

/**
<ng-template cdkConnectedOverlay [cdkConnectedOverlayOrigin]="cdkOverlayOrigin" [cdkConnectedOverlayHasBackdrop]="true"
  [cdkConnectedOverlayOpen]="overlayOpen" [cdkConnectedOverlayOffsetY]='3'
  [cdkConnectedOverlayFlexibleDimensions]="true" [cdkConnectedOverlayWidth]='overlayWidth'
  [cdkConnectedOverlayBackdropClass]="'E_O_transparent'" (backdropClick)="onSureCheck()">
  <div class="open-overlay E_O_panel_el">
  需弹出的组件
  </div>
</ng-template>
 */

/**弹窗组件的构成类 */
export class MadeOverlay {
    @ViewChild(CdkOverlayOrigin, { static: true }) cdkOverlayOrigin: CdkOverlayOrigin;
    @Input() inOverlayWidth: number | string;
    @Output('onSureCheck') emitSureCheck: EventEmitter<boolean> = new EventEmitter();
    selector: string
    protected nativeEl: HTMLElement;
    /**弹窗的打开状态 */
    public overlayOpen: boolean = !1;
    /**弹窗的宽度 */
    public overlayWidth: number | string;
    /**打开选框 */
    onOpenOverlay() {
        this.overlayWidth || this._setOpenWidth();
        this.overlayOpen = !0;
    }
    /**设置弹窗宽度 */
    private _setOpenWidth() {
        if (this.inOverlayWidth) {
            this.overlayWidth = this.inOverlayWidth;
        } else {
            let rect = this.nativeEl.getBoundingClientRect();
            this.overlayWidth = rect.width || undefined;
        }
    }
    /**是否确认关闭弹窗 */
    onSureCheck(flag?: boolean) {
        this.overlayOpen = !1;
    }
}