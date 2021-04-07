import { CdkOverlayOrigin, OverlayRef, Overlay } from '@angular/cdk/overlay';
import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { SelectOption, SelectConfig } from './share-select.model';
import { utilArrayClear, utilArrayRemoveItem, utilIsEqual } from 'share-libs/src/utils/util';
import * as _ from 'lodash';
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
  /**选项 */
  @Input() inOptions: SelectOption[] = [];
  /**已选中 */
  @Input() modelOption: SelectOption[];
  checkUuids: string[];
  checkOptions: SelectOption[] = [];
  /**已选中的对比uuid */
  @Input() inUuid: string = 'key';
  @Output() modelOptionChange: EventEmitter<SelectOption[]> = new EventEmitter();
  /**改变激活项 */
  @Output() onActiveChange: EventEmitter<SelectOption> = new EventEmitter();

  /**配置项 */
  _config: SelectConfig;
  _multi: boolean;
  _showCheck: boolean;
  _leastOne: boolean;
  _showClear: boolean;
  _showFlag: boolean;
  _placeholder: string;
  _noneTip: string;
  _hasActive: boolean;

  orgCheckOptions: SelectOption[] = [];
  activeOption: SelectOption = {};
  optionsOpen: boolean = false;
  cdkConnectedOverlayWidth: number | string;
  @ViewChild(CdkOverlayOrigin, { static: true }) cdkOverlayOrigin: CdkOverlayOrigin;
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.modelOption && !changes.modelOption.firstChange) {
      if (utilIsEqual(this.modelOption, this.checkOptions)) return;
      this.setCheckOptions();
      this.setCheckMixState()
    }
    if (changes.inOptions && !changes.inOptions.firstChange) {
      this.setCheckMixState()
    }
  }

  ngOnInit() {
    this._config = Object.assign(new SelectConfig(), this.inConfig)
    this.setConfig();
    this.setCheckOptions();
    this.setCheckMixState();
    this.setOpenWidth();
    Promise.resolve().then(() => {
      this.closeOptions();
    })
  }

  setCheckOptions() {
    this.checkOptions = this.modelOption || [];
    this.checkUuids = this.checkOptions.map(e => e[this.inUuid]);
    this.orgCheckOptions = [...this.checkOptions];
    if (this.checkUuids.length == 0 && this._leastOne && this.inOptions && this.inOptions.length > 0) {
      utilArrayClear(this.checkOptions).push(this.inOptions[0]);
      this.checkUuids = [this.checkOptions[0][this.inUuid]];
    }
  }

  /**设置配置项 */
  setConfig() {
    this._multi = this._config.multi;
    this._showCheck = this._config.showCheck;
    this._leastOne = this._config.leastOne;
    this._placeholder = this._config.placeholder;
    this._showClear = this._config.showClear;
    this._noneTip = this._config.noneTip;
    this._showFlag = this._config.showFlag;
    this._hasActive = this._config.hasActive;
  }

  /**设置选项状态 */
  setOptionsState() {
    this.mixStateClear();
    this.setCheckMixState();
  }

  /**清除mix状态 */
  mixStateClear(options?: SelectOption[]) {
    options = options || this.inOptions || [];
    options.forEach(e => {
      e._mix = false;
      if (e.children && e.children.length > 0) {
        this.mixStateClear(e.children)
      }
    })
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
    utilArrayClear(this.checkOptions);
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
        utilArrayClear(this.checkOptions)
        utilArrayClear(this.checkUuids)
      }
      this.addItem(option)
    }
    this.setOptionsState()
    !this._multi && this.closeOptions();
  }

  removeItem(option: SelectOption): void {
    utilArrayRemoveItem(this.checkUuids, option[this.inUuid]);
    utilArrayRemoveItem(this.checkOptions, option);
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
    if (utilIsEqual(this.orgCheckOptions, this.checkOptions, this.inUuid)) return;
    this.orgCheckOptions = [...this.checkOptions]
    this.modelOptionChange.emit(this.orgCheckOptions);
  }

  backdropClick() {
    this.closeOptions();
  }

}
