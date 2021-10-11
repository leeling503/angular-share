import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { EventEmitter, Output, SimpleChanges } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { UtilGetAttrValue, UtilIsEmpty, UtilIsEqual, UtilIsFalse, UtilIsUndefined, UtilSetValue } from 'share-libs/src/utils/util';
import { UtilChangesValue, UtilChangesNoFirstValue, UtilChanges } from 'share-libs/src/utils/util-component';
import { RadioIconType, RadioData, RadioPara } from './share-radio.model';

@Component({
  selector: 'share-radio',
  templateUrl: './share-radio.component.html',
  styleUrls: ['./share-radio.component.less']
})
export class ShareRadioComponent implements OnInit {
  constructor() { }
  /**按钮组数据 */
  @Input() inOptins: RadioData | RadioData[];
  @Input() modelRadio: string | string[];
  /**按钮组参数 */
  @Input() inPara: RadioPara = {};
  /**是否多选 */
  @Input() inMulti: boolean;
  /**是否全部去勾选 */
  @Input() inClear: boolean;
  /**禁用选项能去勾选 */
  @Input() inDisCancel: boolean;
  /**取哪个属性的值 (key) */
  @Input() inKey: string = 'key';
  /**按钮组图标 */
  @Input() inIconType: RadioIconType;
  @Output() modelRadioChange: EventEmitter<any> = new EventEmitter();
  defaultPara: RadioPara = {
    ifMulti: false,
    ifClear: false,
    ifDisCancel: false,
    iconType: 'radio',
  }
  /**输入数据类型 */
  modelType: 'string' | 'array' = 'string';
  emitModel: string | string[];
  public options: RadioData[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (UtilChanges(changes, 'inOptins')) {
      this.setOptions();
      this.setCheckRadio();
    }
    if (UtilChanges(changes, 'modelRadio') && !UtilIsEqual(this.modelRadio, this.emitModel)) {
      this.setModelType();
      this.setCheckRadio();
    }
  }

  ngOnInit() {
    this.setPara();
  }

  /**设置配置 */
  setPara() {
    let para = Object.assign({}, this.defaultPara, this.inPara)
    this.inMulti = this.inMulti ?? para.ifMulti;
    this.inClear = this.inClear ?? para.ifClear;
    this.inDisCancel = this.inDisCancel ?? para.ifDisCancel;
    this.inIconType = this.inIconType ?? para.iconType;
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

  setModelType() {
    this.modelType = 'string';
    if (Array.isArray(this.modelRadio)) {
      this.modelType = 'array'
    }
  }

  /**设置勾选 */
  setCheckRadio() {
    if (UtilIsUndefined(this.modelRadio)) return;
    let modelRadio = this.modelRadio;
    if (typeof this.modelRadio == 'string') {
      modelRadio = this.modelRadio.split(',');
    } else if (!Array.isArray(modelRadio)) {
      modelRadio = [modelRadio]
    }
    this.options.map(e => { modelRadio?.includes(e[this.inKey]) && (e._check = true); })
  }

  onTiggerCheck(radio: RadioData) {
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
    if (this.modelType == 'string') {
      values = values.join(',')
    }
    if (UtilIsEqual(values, this.modelRadio)) {
      return
    }
    this.emitModel = values;
    this.modelRadioChange.emit(this.emitModel)
  }

}
