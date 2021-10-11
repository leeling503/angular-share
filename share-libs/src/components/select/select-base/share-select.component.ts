import { Component, ElementRef } from '@angular/core';
import { SelectOption } from '../share-select.model';
import { UtilArrayCopy, UtilArrayGetObjByValue } from 'share-libs/src/utils';
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
    let option: SelectOption = UtilArrayGetObjByValue(this.inOptions, 'value', value, this.inSon ? undefined : '');
    if (option) {
      option._check = true;
      /**若该选项已经选中则不用处理 */
      if (!UtilArrayGetObjByValue(this.checkOptions, 'value', value, '')) {
        this.checkOptions.push(option);
        /**为触发子组件的change方法，修正mix状态 */
        this.checkOptions = UtilArrayCopy(this.checkOptions);
      }
    } else {
      option = this._createOptionByValue(value);
      this.inOptions.unshift(option);
      this.checkOptions.push(option)
    }
    this.inputValue = null;
  }

}
