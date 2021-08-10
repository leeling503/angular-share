import { CdkOverlayOrigin } from '@angular/cdk/overlay';
import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { SelectOption, SelectModelInputs, SelectPanelPara } from '../share-select.model';
import { UtilArrayClear, UtilArrayGetAncestorsByValue, UtilArrayGetArrByValue, UtilArrayGetObjByValue, UtilArrayRemoveItem, UtilArraySetKeyValue, UtilIsEqual } from 'share-libs/src/utils';
import { ShareInputType } from 'share-libs/src/models';
import { UtilChangesNoFirstValue, UtilChanges } from 'share-libs/src/utils/util-component';
import { PerfixText } from '../../base/perfix-text.component';

@Component({
  selector: 'share-select-panel',
  templateUrl: './share-select-panel.component.html',
  styleUrls: ['./share-select-panel.component.less']
})
export class ShareSelectPanelComponent extends PerfixText implements OnInit {
  constructor(private el: ElementRef) {
    super();
    this.nativeEl = this.el.nativeElement;
  }
  nativeEl: HTMLElement
  /**配置 */
  @Input() inPara: SelectPanelPara = {};
  /**所有选项 */
  @Input() inOptions: SelectOption[] = [];
  /**已选中 */
  @Input() modelOption: SelectModelInputs;
  /**已选中的对比uuid */
  @Input() inUuid: string = 'key';
  /**选中项发生改变 */
  @Output() modelOptionChange: EventEmitter<SelectModelInputs> = new EventEmitter();
  defaultPara: SelectPanelPara = {
    ifFlag: true,
    ifClear: false,
    placeholder: '请选择',
    noneTip: '暂无数据'
  }
  /**选中的关键key集合 */
  // checkUuids: string[];
  /**选中的选项集合 */
  checkOptions: SelectOption[] = [];
  /**选项状态有改变，需要重新确定 */
  optionsStateChange: boolean = true;
  /**当前页面的父类层级*/
  superOptions: SelectOption[] = [];
  /**清空按钮*/
  _showClear: boolean;
  /**显示control标签*/
  _showFlag: boolean;
  /**提示语*/
  _placeholder: string;
  /**无数据提示*/
  _noneTip: string;
  _inputType: ShareInputType = 'string';
  /**emit出去的选中数据*/
  _outOptions: SelectModelInputs;
  /**上一次emit出去的选中（用于判断当前的选中改变是否需要触发emit）*/
  orgCheckOptions: SelectOption[] = [];
  /**激活的选项 */
  activeOption: SelectOption = {};
  openOptions: boolean = !1;
  cdkConnectedOverlayWidth: number | string;
  /** 配置的全部选项 */
  optionAll: SelectOption = {};
  @ViewChild(CdkOverlayOrigin, { static: true }) cdkOverlayOrigin: CdkOverlayOrigin;

  ngOnChanges(changes: SimpleChanges): void {
    super.ngPerfixChange(changes);
    if (UtilChanges(changes, 'modelOption') && !UtilIsEqual(this.modelOption, this._outOptions)) {
      this.setCheckOptions();
    }
    if (UtilChanges(changes, 'inOptions')) {
      this.setCheckOptions();
      this.activeOption = this.optionAll = { value: '全部', children: this.inOptions };
      this.superOptions = [this.activeOption]
    }
    if (UtilChangesNoFirstValue(changes, 'inPara')) {
      this.setPara();
    }
  }

  ngOnInit() {
    this.setPara();
    Promise.resolve().then(() => { this._emitModelOption(); })
  }

  /**设置配置项 */
  setPara() {
    let para = this.inPara = Object.assign({}, this.defaultPara, this.inPara);
    this._placeholder = para.placeholder;
    this._showClear = para.ifClear;
    this._noneTip = para.noneTip;
    this._showFlag = para.ifFlag;
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
    this.orgCheckOptions = this.checkOptions;
    Promise.resolve().then(() => { this._emitModelOption(); })
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

  /**创建新的选项 */
  private _createOptionByValue(value): SelectOption {
    return { key: value, value, showName: value, _check: true };
  }

  /**打开选框 */
  onOpenOverlay() {
    this.cdkConnectedOverlayWidth || this._setOpenWidth();
    this.openOptions = !0;
  }

  /**设置弹窗宽度 */
  private _setOpenWidth() {
    if (this.inPara.openWidth) {
      this.cdkConnectedOverlayWidth = this.inPara.openWidth;
    } else {
      let el = this.nativeEl.querySelector('.share-select-panel')
      let rect = el.getBoundingClientRect();
      this.cdkConnectedOverlayWidth = rect.width || undefined;
    }
  }

  /**清空 */
  onClickClearNodes() {
    event.stopPropagation();
    UtilArrayClear(this.checkOptions);
    this._emitModelOption();
  }

  /**删除选中 */
  onClickClearNode(option: SelectOption) {
    event.stopPropagation();
    UtilArrayRemoveItem(this.checkOptions, option);
    this._emitModelOption();
  }

  /**关闭选框并根据输入类型输出选中数据 */
  closeOptions(): void {
    this.openOptions = !1;
    this._emitModelOption();
  }

  /**根据输入类型输出选中数据(this.checkOptions)*/
  private _emitModelOption() {
    if (UtilIsEqual(this.orgCheckOptions, this.checkOptions, this.inUuid)) return;
    let original = this.orgCheckOptions = [...this.checkOptions];
    let uuids = original.map(e => e[this.inUuid]);
    if (this._inputType == "string") {
      this._outOptions = uuids.join(',');
    } else if (this._inputType == "strings") {
      this._outOptions = uuids;
    } else if (this._inputType == 'object') {
      this._outOptions = original[0]
    } else {
      this._outOptions = original;
    }
    this.modelOptionChange.emit(this._outOptions);
  }

  onCheckChange($event: SelectOption[]) {
    this.checkOptions = $event;
  }
}
