import { Component, ElementRef } from '@angular/core';
import { SelectOption } from '../share-select.model';
import { UtilArray } from 'share-libs/src/utils';
import { ShareSelect } from '../select/select.component';

@Component({
  selector: 'share-select',
  templateUrl: './share-select.component.html',
  styleUrls: ['./share-select.component.less']
})
export class ShareSelectComponent extends ShareSelect {
  constructor(private el: ElementRef) {
    super();
    this.nativeEl = this.el.nativeElement;
  }

  inputValue: string;
  /**用户输入完成 */
  onInputValueEnd() {
    let value = this.inputValue;
    if (!value) { return }
    let option: SelectOption = UtilArray.getObjByValue(this.inOptions, 'value', value, this.inSon ? undefined : '');
    if (option) {
      option._check = true;
      /**若该选项已经选中则不用处理 */
      if (!UtilArray.getObjByValue(this.checkOptions, 'value', value, '')) {
        this.checkOptions.push(option);
        /**为触发子组件的change方法，修正mix状态 */
        this.checkOptions = UtilArray.copy(this.checkOptions);
      }
    } else {
      option = this._createOptionByValue(value);
      this.inOptions.unshift(option);
      this.checkOptions.push(option)
    }
    this.inputValue = null;
  }

  /**add框经过用户确认的关闭选框 */
  onCheckSureChange($event: boolean) {
    this.openOptions = !1;
    if ($event === false && this.inBtn) {
      this.checkOptions = UtilArray.copy(this.emitCheckOptions);
    }
    this._emitModelOption();
  }
}
