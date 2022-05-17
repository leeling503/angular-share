import { EventEmitter, Input, Output } from "@angular/core";
/** panel面板的确定和取消按钮html
 <div class="E_O_btns" *ngIf="!ifAuto">
    <div class="E_O_btn_sure" (click)="onSureChange(true)">确定</div>
    <div class="E_O_btn_off" (click)="onSureChange(false)">取消</div>
 </div>
 */

export class MadePanel {
    /**关闭弹窗Panel是否自动更新 */
    @Input() public ifAuto: boolean = true;
    /**非自动更新时通过按钮确定选中更改 */
    @Output('onSureChange') public emitSureChange: EventEmitter<boolean> = new EventEmitter();

    /**按钮确定更改 */
    public onSureChange(flag: boolean) {
        this.emitSureChange.emit(flag)
    }
}