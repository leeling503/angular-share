import { EventEmitter, Output, SimpleChanges } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';
import { UtilIsEqual, UtilIsUndefined } from 'share-libs/src/utils/util';
import { UtilChanges, UtilChangesNoFirst } from 'share-libs/src/utils/util-component';
import { RadioIconType, RadiosData, RadiosPara } from './share-radio.model';

@Component({
  selector: 'share-radio',
  templateUrl: './share-radio.component.html',
  styleUrls: ['./share-radio.component.less']
})
export class ShareRadioComponent implements OnInit {

  constructor() { }
  /**按钮组参数 */
  @Input() inRadioPara: RadiosPara;
  /**按钮组数据 */
  @Input() inRadioDatas: RadiosData | RadiosData[];
  @Input() modelRadio: string | string[];
  @Input() inUuid: string = 'key';
  @Output() modelRadioChange: EventEmitter<any> = new EventEmitter();

  _datas: RadiosData[] = [];
  /**能否多选 */
  _multi: boolean = false;
  /**能否一个都不选 */
  _clear: boolean = false;
  /**图标组类型 */
  _iconType: RadioIconType = 'radio';
  _inputType: 'string' | 'array' = 'array';
  _outModel: string | string[];
  ngOnChanges(changes: SimpleChanges): void {
    if (UtilChangesNoFirst(changes, 'inRadioDatas')) {
      this.set_datas();
      this.set_checkRadio();
    }
    if (UtilChangesNoFirst(changes, 'modelRadio')) {
      !UtilIsEqual(this.modelRadio, this._outModel) && this.set_checkRadio()
    }
    if (UtilChanges(changes, 'inRadioPara')) {
      this.set_config()
    }
  }

  ngOnInit() {
    this.set_datas();
    this.set_checkRadio()
  }

  set_config() {
    this._multi = this.inRadioPara.multi;
    this._clear = this.inRadioPara.clear;
    this._iconType = this.inRadioPara.iconType || 'radio';
  }

  /**设置选项数据 */
  set_datas() {
    if (UtilIsUndefined(this.inRadioDatas)) return;
    if (Array.isArray(this.inRadioDatas)) {
      this._datas = this.inRadioDatas
    } else {
      this._datas = [this.inRadioDatas]
    }
  }

  /**设置勾选 */
  set_checkRadio() {
    if (UtilIsUndefined(this.modelRadio)) return;
    this._inputType = Array.isArray(this.modelRadio) ? 'array' : 'string';
    let modelRadio = this.modelRadio;
    !Array.isArray(this.modelRadio) && (modelRadio = this.modelRadio.split(','));
    this._datas.map(e => {
      modelRadio.includes(e[this.inUuid]) && (e.ifCheck = true);
    })
  }

  tiggerCheck(radio: RadiosData) {
    if (radio.ifDis) return;
    /**能否多选的判断 */
    if (!this._multi) {
      let flag = radio.ifCheck;
      this._datas.map(e => e.ifCheck = false);
      radio.ifCheck = flag;
    }
    radio.ifCheck = !radio.ifCheck
    /**至少要勾选一个的判断 */
    if (this._datas.every(e => e.ifCheck === false) && !this._clear) {
      radio.ifCheck = true;
    }
    let values: string | string[] = this._datas.filter(e => e.ifCheck).map(e => e[this.inUuid]);
    if (UtilIsEqual(values, this.modelRadio)) {
      return
    } else {
      if (this._inputType == 'string') {
        values = values.join(',')
      }
    }
    this._outModel = values;
    this.modelRadioChange.emit(this._outModel)
  }

}
