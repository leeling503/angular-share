import { CdkOverlayOrigin } from '@angular/cdk/overlay';
import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { SelectOption, SelectModelInputs, SelectPara } from '../share-select.model';
import { UtilArrayClear, UtilArrayGetObjByValue, UtilArrayRemoveItem, UtilArraySetKeyValue, UtilIsEqual, UtilSetValue } from 'share-libs/src/utils';
import { ShareInputType } from 'share-libs/src/models';
import { UtilChangesValue, UtilChangesNoFirstValue } from 'share-libs/src/utils/util-component';
import { IfStmt } from '@angular/compiler';
import { extend } from 'jquery';
import { PerfixText } from '../../base/perfix-text.component';

@Component({
  selector: 'share-select',
  templateUrl: './share-select.component.html',
  styleUrls: ['./share-select.component.less']
})
export class ShareSelectComponent extends PerfixText implements OnInit {
  constructor(private el: ElementRef) {
    super();
    this.nativeEl = this.el.nativeElement;
  }
  nativeEl: HTMLElement
  /**配置 */
  @Input() inPara: SelectPara = {};
  /**所有选项 */
  @Input() inOptions: SelectOption[] = [];
  /**已选中 */
  @Input() modelOption: SelectModelInputs;
  /**已选中的对比uuid */
  @Input() inUuid: string = 'key';
  /**选中项发生改变 */
  @Output() modelOptionChange: EventEmitter<SelectModelInputs> = new EventEmitter();
  /**改变激活项 */
  @Output() onActiveChange: EventEmitter<SelectOption> = new EventEmitter();
  /**默认配置 */
  defaultPara: SelectPara = {
    ifFlag: true,
    ifCheck: true,
    ifClear: true,
    ifMulti: false,
    ifActive: false,
    ifInput: false,
    ifSonCheck: false,
    ifGanged: false,
    placeholder: '请选择',
    noneTip: '暂无数据',
    leastOne: false,
  }
  /**选中的关键key集合 */
  checkUuids: string[];
  /**选中的选项集合 */
  checkOptions: SelectOption[] = [];
  /**选项状态有改变，需要重新确定 */
  optionsStateChange: boolean = true;
  /**多选*/
  _multi: boolean;
  /**显示选项多选框*/
  _showCheck: boolean;
  /**至少选择一个*/
  _leastOne: boolean;
  /**清空按钮*/
  _showClear: boolean;
  /**显示control标签*/
  _showFlag: boolean;
  /**提示语*/
  _placeholder: string;
  /**无数据提示*/
  _noneTip: string;
  /**拥有激活项 */
  _hasActive: boolean;
  /**可输入选款 */
  _ifInput: boolean;
  _ifSonCheck: boolean;
  /**开启可输入后用户输入的值 */
  inputValue: string;

  _inputType: ShareInputType = 'string';
  /**emit出去的选中数据*/
  _outOptions: SelectModelInputs;
  /**选中*/
  orgCheckOptions: SelectOption[] = [];
  activeOption: SelectOption = {};
  openOptions: boolean = false;
  cdkConnectedOverlayWidth: number | string;
  @ViewChild(CdkOverlayOrigin, { static: true }) cdkOverlayOrigin: CdkOverlayOrigin;

  ngOnChanges(changes: SimpleChanges): void {
    super.ngPerfixChange(changes);
    if (UtilChangesNoFirstValue(changes, 'modelOption')) {
      if (UtilIsEqual(this.modelOption, this._outOptions)) return;
      this.setCheckOptions();
      this.setOptionsState();
    }
    if (UtilChangesNoFirstValue(changes, 'inOptions')) {
      this.setCheckOptions();
      this.setOptionsState();
    }
    if (UtilChangesNoFirstValue(changes, 'inConfig')) {
      this.setConfig();
    }
  }

  ngOnInit() {
    this.setConfig();
    this.setCheckOptions();
    Promise.resolve().then(() => {
      this.closeOptions();
    })
  }

  /**设置配置项 */
  setConfig() {
    let _config = this.inPara = Object.assign({}, this.defaultPara, this.inPara);
    this._multi = _config.ifMulti;
    this._showCheck = _config.ifCheck;
    this._leastOne = _config.leastOne;
    this._placeholder = _config.placeholder;
    this._showClear = _config.ifClear;
    this._noneTip = _config.noneTip;
    this._showFlag = _config.ifFlag;
    this._hasActive = _config.ifActive;
    this._ifInput = _config.ifInput;
    this._ifSonCheck = _config.ifSonCheck;
  }

  /**设置选中 并判断model的类型 string | object | strings | objects */
  setCheckOptions() {
    let option = this.modelOption || [], value = option[0], id = this.inUuid;
    if (Array.isArray(option)) {
      if (typeof value !== "object") {
        this._inputType = 'strings';
        this.checkOptions = [...option].map(e => { return this._getOptionByValue(e as string); })
      } else {
        this._inputType = 'objects';
        this.checkOptions = [...option].map(e => { return this._getOptionByValue(e[id] as string) });
      }
    } else {
      if (typeof option == "string") {
        this._inputType = 'string';
        this.checkOptions = option.split(',').map(e => { return this._getOptionByValue(e as string) })
      } else {
        this._inputType = 'object';
        this.checkOptions = [option].map(e => { return this._getOptionByValue(e[id] as string) })
      }
    }
    this.checkUuids = this.checkOptions.map(e => e[id]);
    if (this.checkUuids.length == 0 && this._leastOne && this.inOptions && this.inOptions.length > 0) {
      UtilArrayClear(this.checkOptions).push(this.inOptions[0]);
      this.checkUuids = [this.checkOptions[0][id]];
    }
    this.orgCheckOptions = [...this.checkOptions];
  }

  /**通过关键inUuid来获取选项 
   * 没有该选项这创建并加入到选项中 */
  private _getOptionByValue(value: string): SelectOption {
    let option = UtilArrayGetObjByValue(this.inOptions, this.inUuid as keyof SelectOption, value);
    if (!option) {
      option = this._createOptionByValue(value);
      this.inOptions.push(option)
    }
    return option;
  }

  /**更新选项的状态 （如果选框已经打开则需要立即更新  未打开就只需要标识打开时需更新）*/
  setOptionsState() {
    if (this.openOptions) {
      this._setOptionsState();
    } else {
      this.optionsStateChange = true
    }
  }

  /**设置选项状态 */
  private _setOptionsState() {
    this.optionsStateChange = false;
    /**清除mix状态 */
    UtilArraySetKeyValue(this.inOptions, '_mix', false);
    this.setCheckMixState();
  }

  /**设置选中和mix状态 */
  setCheckMixState(options: SelectOption[] = this.inOptions, ancestors: SelectOption[] = []) {
    options.forEach(e => {
      if (this.checkUuids.includes(e[this.inUuid])) {
        ancestors.map(e => e._mix = true)
        e._check = true;
      } else {
        e._check = false
      }
      if (e.children && e.children.length > 0) {
        ancestors.push(e)
        this.setCheckMixState(e.children, ancestors)
      }
    });
    let father = ancestors.splice(ancestors.length - 1, 1)[0];
    // let flag = options.every(e => this.checkUuids.includes(e[this.inUuid]))
    // if (flag && father) {
    //   father._check = true;
    // }
  }

  ngAfterViewInit(): void { }

  /**设置弹窗宽度 */
  private _setOpenWidth() {
    if (this.inPara.openWidth) {
      this.cdkConnectedOverlayWidth = this.inPara.openWidth;
    } else {
      let el = this.nativeEl.querySelector('.share-select')
      let rect = el.getBoundingClientRect();
      this.cdkConnectedOverlayWidth = rect.width || undefined;
    }
  }

  /**清空 */
  onClickClearNodes() {
    event.stopPropagation();
    let option = this.checkOptions[0];
    UtilArrayClear(this.checkOptions);
    this.checkUuids = [];
    if (this._leastOne) {
      this.addItem(option)
    }
    this._emitModelOption();
  }

  /**删除选中 */
  onClickClearNode(option: SelectOption) {
    event.stopPropagation();
    this.removeItem(option);
    this._emitModelOption();
  }

  /**打开选框 */
  openOverlay() {
    this.cdkConnectedOverlayWidth || this._setOpenWidth();
    this.optionsStateChange && this._setOptionsState();
    this.openOptions = !this.openOptions;
  }

  /**点击选项node（是否是点击选框）*/
  onClickOptionNode(option: SelectOption, sourceCheck: boolean = false) {
    event.stopPropagation();
    let uuid = this.inUuid;
    /** 申明有激活项时，点击item只能改变激活的option*/
    if (!sourceCheck && this._hasActive) {
      if (option[uuid] !== this.activeOption[uuid]) {
        this.activeOption = option;
        this.onActiveChange.emit(option);
      };
      /**有勾选框需要通过勾选框进行勾选 */
      if (this._showCheck) {
        return;
      }
    }
    if (this.checkUuids.includes(option[uuid])) {
      this.removeItem(option);
    } else {
      if (!this._multi) {
        UtilArrayClear(this.checkOptions)
        UtilArrayClear(this.checkUuids)
      }
      this.addItem(option)
    }
    !this._multi && this.closeOptions() || this.setOptionsState();;
  }

  /**从选中中移除指定选项，当配置为至少选中一个时，最后一个无法移除 */
  removeItem(option: SelectOption): void {
    UtilArrayRemoveItem(this.checkUuids, option[this.inUuid]);
    UtilArrayRemoveItem(this.checkOptions, option);
    if (this.checkUuids.length == 0 && this._leastOne) {
      this.addItem(option)
    }
  }

  /**添加选项到选中 */
  addItem(option) {
    this.checkUuids.push(option[this.inUuid]);
    this.checkOptions.push(option)
  }

  /**子项的显隐 */
  onClickOptionChild(option: SelectOption) {
    event.stopPropagation();
    option.showChild = !option.showChild;
  }

  /**关闭选框并根据输入类型输出选中数据 */
  closeOptions(): boolean {
    this.openOptions = !1;
    this._emitModelOption();
    return !0;
  }

  /**根据输入类型输出选中数据， 并设置下次打开选框是否需要更新选框状态*/
  private _emitModelOption() {
    if (UtilIsEqual(this.orgCheckOptions, this.checkOptions, this.inUuid)) return;
    let original = this.orgCheckOptions = [...this.checkOptions]
    let uuids = original.map(e => e[this.inUuid])
    if (this._inputType == "string") {
      this._outOptions = uuids.join(',');
    } else if (this._inputType == "strings") {
      this._outOptions = uuids;
    } else if (this._inputType == 'object') {
      this._outOptions = original[0]
    } else {
      this._outOptions = original;
    }
    this.setOptionsState();
    this.modelOptionChange.emit(this._outOptions);
  }

  /**用户输入结束 */
  onInputValueEnd() {
    let value = this.inputValue;
    if (!value) { return }
    let option: SelectOption = UtilArrayGetObjByValue(this.inOptions, 'value', value);
    if (option) {
      option._check = true;
    } else {
      option = this._createOptionByValue(value);
      this.inOptions.push(option);
    }
    this.inputValue = null;
    this.onClickOptionNode(option, true);
  }

  /**创建新的选项 */
  private _createOptionByValue(value): SelectOption {
    return { key: value, value, showName: value, _check: true };
  }

}
