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
  /**是否显示输入框  （base类且可输入多选或者未选择时 */
  get elShowInput(): boolean {
    return (this.inType == 'base') && this.inAdd && (this.inMulti || (this.checkOptions && this.checkOptions.length == 0))
  }
  /**是否显示span请输入提示文 （panel类或者不能添加且无选中）*/
  get elShowPlace(): boolean {
    return (!this.inAdd || this.inType == 'panel') && (!this.checkOptions || this.checkOptions.length == 0)
  }

  /**用户输入字符串 */
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
  onCheckSureChange(flag: boolean) {
    this.overlayOpen = !1;
    if (flag === false && this.inBtn) {
      /**用户未确定，且存在确认按钮 */
      this.checkOptions = UtilArray.copy(this.emitCheckOptions);
    }
    this._emitModelOption();
  }
}
