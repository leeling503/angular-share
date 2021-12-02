import { EventEmitter, Output, SimpleChanges } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { UtilIsEqual, UtilIsFalse, UtilIsUndefined } from 'share-libs/src/utils/util';
import { UtilChanges } from 'share-libs/src/utils/util-component';
import { RadioIconType, RadioOption, RadioPara } from './share-radio.model';
/**
 * 按钮组组件
 */
@Component({
  selector: 'share-radio',
  templateUrl: './share-radio.component.html',
  styleUrls: ['./share-radio.component.less']
})
export class ShareRadioComponent implements OnInit {
  constructor() { }
  /**按钮组数据 */
  @Input() inOptins: RadioOption | RadioOption[];
  @Input() model: string | string[];
  /**按钮组参数 */
  @Input() inPara: RadioPara = {};
  /**是否多选 */
  @Input() inMulti: boolean;
  /**是否全部去勾选 */
  @Input() inClear: boolean;
  /**禁用选项能去勾选 */
  @Input() inDisCancel: boolean;
  /**取哪个属性的值 (key) */
  @Input() inKey: string;
  /**按钮组图标 */
  @Input() inIconType: RadioIconType;
  /**输出数据类型与输入数据类型相关当为undefined时与是否多选有关 */
  @Output() modelChange: EventEmitter<any> = new EventEmitter();
  /**默认配置 */
  defaultPara: RadioPara = {
    ifMulti: false,
    ifClear: false,
    ifDisCancel: false,
    iconType: 'radio',
    key: 'key'
  }
  /**输入数据类型(输出数组或单个数据)*/
  modelType: 'multi' | 'single' = 'multi';
  emitModel: string | string[];
  public options: RadioOption[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (UtilChanges(changes, 'inOptins')) {
      this.setOptions();
      this.setCheckRadio();
    }
    if (UtilChanges(changes, 'model') && !UtilIsEqual(this.model, this.emitModel)) {
      this.setModelType();
      this.setCheckRadio();
    }
  }

  ngOnInit() {
    this.setPara();
    this.setModelType();
    this.setCheckRadio();
  }

  /**设置配置 */
  setPara() {
    let para = Object.assign({}, this.defaultPara, this.inPara)
    this.inMulti = this.inMulti ?? para.ifMulti;
    this.inClear = this.inClear ?? para.ifClear;
    this.inDisCancel = this.inDisCancel ?? para.ifDisCancel;
    this.inIconType = this.inIconType ?? para.iconType;
    this.inKey = this.inKey ?? para.key;
  }

  /**设置选项数据 */
  setOptions() {
    if (!this.inOptins) return;
    if (Array.isArray(this.inOptins)) {
      this.options = _.cloneDeep(this.inOptins)
    } else {
      this.options = _.cloneDeep([this.inOptins])
    }
  }

  /**判断输出的值类型 */
  setModelType() {
    this.modelType = 'multi';
    if (!Array.isArray(this.model) && typeof this.model !== undefined) {
      this.modelType = 'single';
    } if (typeof this.model === undefined && this.inMulti === false) {
      this.model = 'single'
    }
  }

  /**设置勾选 */
  setCheckRadio() {
    if (UtilIsUndefined(this.model)) return;
    let modelRadio = this.model;
    if (typeof this.model == 'string') {
      modelRadio = this.model.split(',');
    } else if (!Array.isArray(modelRadio)) {
      modelRadio = [modelRadio]
    }
    this.options.map(e => { modelRadio?.includes(e[this.inKey]) && (e._check = true); })
  }

  onTiggerCheck(radio: RadioOption) {
    if (radio._dis) return;
    let flag = radio._check;
    /**单选 */
    if (!this.inMulti) {
      /**禁用能否取消判断 */
      this.options.map(e => { if (!e._dis || this.inDisCancel) { e._check = false } });
    }
    radio._check = !flag;
    /**至少要勾选一个的判断 */
    if (this.options.every(e => UtilIsFalse(e._check)) && !this.inClear) {
      radio._check = true;
    }
    let values: string | string[] = this.options.filter(e => e._check).map(e => e[this.inKey]);
    if (this.modelType == 'single') {
      values = values.length === 1 ? values[0] : values.join(',')
    }
    if (UtilIsEqual(values, this.model)) {
      return
    }
    this.emitModel = values;
    this.modelChange.emit(this.emitModel)
  }

}
