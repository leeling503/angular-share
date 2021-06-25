import { CdkOverlayOrigin } from '@angular/cdk/overlay';
import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { SelectOption, SelectConfig, SelectModelInputs } from '../share-select.model';
import { UtilArrayClear, UtilArrayGetObjByValue, UtilArrayRemoveItem, UtilArraySetKeyValue, UtilIsEqual } from 'share-libs/src/utils';
import { ShareInputType } from 'share-libs/src/models';
import { UtilChangesValue, UtilChangesNoFirstValue } from 'share-libs/src/utils/util-component';

@Component({
  selector: 'share-select',
  templateUrl: './share-select.component.html',
  styleUrls: ['./share-select.component.less']
})
export class ShareSelectComponent implements OnInit {
  constructor(private el: ElementRef) {
    this.nativeEl = this.el.nativeElement;
  }
  nativeEl: HTMLElement
  /**配置 */
  @Input() inConfig: SelectConfig = new SelectConfig();
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
  checkUuids: string[];
  checkOptions: SelectOption[] = [];

  /**配置项 */
  _config: SelectConfig;
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

  _inputType: ShareInputType = 'string';
  _outOptions: SelectModelInputs;
  orgCheckOptions: SelectOption[] = [];
  activeOption: SelectOption = {};
  optionsOpen: boolean = false;
  cdkConnectedOverlayWidth: number | string;
  @ViewChild(CdkOverlayOrigin, { static: true }) cdkOverlayOrigin: CdkOverlayOrigin;

  ngOnChanges(changes: SimpleChanges): void {
    if (UtilChangesNoFirstValue(changes, 'modelOption')) {
      if (UtilIsEqual(this.modelOption, this._outOptions)) return;
      this.setCheckOptions();
      this.setCheckMixState()
    }
    if (UtilChangesNoFirstValue(changes, 'inOptions')) {
      this.setCheckOptions();
      this.setCheckMixState()
    }
    if (UtilChangesNoFirstValue(changes, 'inConfig')) {
      this.setConfig();
    }
  }

  ngOnInit() {
    this.setConfig();
    this.setCheckOptions();
    this.setCheckMixState();
    this.setOpenWidth();
    Promise.resolve().then(() => {
      this.closeOptions();
    })
  }

  /**设置选中 */
  setCheckOptions() {
    let option = this.modelOption || [];
    let value = option[0];
    if (Array.isArray(option)) {
      if (typeof value !== "object") {
        this._inputType = 'strings';
        this.checkOptions = [...option].map(e => {
          let option = UtilArrayGetObjByValue(this.inOptions, this.inUuid as keyof SelectOption, e as string);
          return option
        }).filter(e => e !== undefined)
      } else {
        this._inputType = 'objects';
        this.checkOptions = option as SelectOption[];
      }
    } else {
      if (typeof option == "string") {
        this._inputType = 'string';
        let options = option.split(',');
        this.checkOptions = options.map(e => {
          let option = UtilArrayGetObjByValue(this.inOptions, this.inUuid as keyof SelectOption, e as string);
          return option
        }).filter(e => e !== undefined)
      } else {
        this._inputType = 'object';
        this.checkOptions = [UtilArrayGetObjByValue(this.inOptions, this.inUuid as keyof SelectOption, option[this.inUuid])].filter(e => e !== undefined);
      }
    }
    this.checkUuids = this.checkOptions.map(e => e[this.inUuid]);
    this.orgCheckOptions = [...this.checkOptions];
    if (this.checkUuids.length == 0 && this._leastOne && this.inOptions && this.inOptions.length > 0) {
      UtilArrayClear(this.checkOptions).push(this.inOptions[0]);
      this.checkUuids = [this.checkOptions[0][this.inUuid]];
    }
  }

  /**设置配置项 */
  setConfig() {
    this._config = Object.assign(new SelectConfig(), this.inConfig)
    this._multi = this._config.ifMulti;
    this._showCheck = this._config.ifCheck;
    this._leastOne = this._config.leastOne;
    this._placeholder = this._config.placeholder;
    this._showClear = this._config.ifClear;
    this._noneTip = this._config.noneTip;
    this._showFlag = this._config.ifFlag;
    this._hasActive = this._config.ifActive;
    this._ifInput = this._config.ifInput;
  }

  /**设置选项状态 */
  setOptionsState() {
    /**清除mix状态 */
    UtilArraySetKeyValue(this.inOptions, '_mix', false)
    this.setCheckMixState();
  }

  /**设置选中和mix状态 */
  setCheckMixState(options?: SelectOption[], father?: SelectOption[]) {
    options = options || this.inOptions || [];
    options.forEach(e => {
      if (this.checkUuids.includes(e[this.inUuid])) {
        father && father.map(e => e._mix = true)
        e._check = true
      } else {
        e._check = false
      }
      if (e.children && e.children.length > 0) {
        let curFather = father || [];
        curFather.push(e)
        this.setCheckMixState(e.children, curFather)
      }
    })
    father && father.splice(father.length - 1, 1)
  }

  setOpenWidth() {
    if (this.inConfig.openWidth) {
      this.cdkConnectedOverlayWidth = this.inConfig.openWidth;
    } else {
      this.nativeEl = this.nativeEl.querySelector('.share-select')
      let rect = this.nativeEl.getBoundingClientRect();
      this.cdkConnectedOverlayWidth = rect.width;
    }
  }

  clickClearNodes() {
    event.stopPropagation();
    let option = this.checkOptions[0];
    UtilArrayClear(this.checkOptions);
    this.checkUuids = [];
    if (this._leastOne) {
      this.addItem(option)
    }
    this.setOptionsState();
    this.closeOptions();
  }

  clickClearNode(option: SelectOption) {
    event.stopPropagation();
    this.removeItem(option);
    this.setOptionsState();
    this.closeOptions();
  }

  clickToggleOpen() {
    this.optionsOpen = !this.optionsOpen;
  }

  onCheckChange(option: SelectOption) {
    this.onClickOptionNode(option, true)
  }

  /** */
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
    this.setOptionsState()
    !this._multi && this.closeOptions();
  }

  removeItem(option: SelectOption): void {
    UtilArrayRemoveItem(this.checkUuids, option[this.inUuid]);
    UtilArrayRemoveItem(this.checkOptions, option);
    if (this.checkUuids.length == 0 && this._leastOne) {
      this.addItem(option)
    }
  }

  addItem(option) {
    this.checkUuids.push(option[this.inUuid]);
    this.checkOptions.push(option)
  }

  /**子项的显影 */
  onClickOptionChild(option: SelectOption) {
    event.stopPropagation();
    option.showChild = !option.showChild;
  }

  closeOptions() {
    this.optionsOpen = !1;
    if (UtilIsEqual(this.orgCheckOptions, this.checkOptions, this.inUuid)) return;
    this.orgCheckOptions = [...this.checkOptions]
    let uuids = this.orgCheckOptions.map(e => e[this.inUuid])
    if (this._inputType == "string") {
      this._outOptions = uuids.join(',');
    } else if (this._inputType == "strings") {
      this._outOptions = uuids;
    } else if (this._inputType == 'object') {
      this._outOptions = this.orgCheckOptions[0]
    } else {
      this._outOptions = this.orgCheckOptions;
    }
    this.modelOptionChange.emit(this._outOptions);
  }

  backdropClick() {
    this.closeOptions();
  }
  inputValue
  onInputValueChange() {
    console.log(this.inputValue)
  }
}
