import { CdkOverlayOrigin } from '@angular/cdk/overlay';
import { OnInit, Input, ViewChild, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { SelectOption, SelectModel, SelectModelType, SelectOpenType, SelectOptions, SelectPara } from '../share-select.model';
import { UtilArray, UtilIsEqual } from 'share-libs/src/utils';
import { UtilChanges, UtilChangesValue } from 'share-libs/src/utils/util-component';
import { MadePerfix } from '../../base';
export class ShareSelect extends MadePerfix implements OnInit {
    constructor() {
        super();
    }
    nativeEl: HTMLElement
    @Input() overlayClass: Object;
    /**所有选项 */
    @Input() inOptions: SelectOptions = [];
    /**已选中 */
    @Input() modelOptions: SelectModel;
    /**已选中的对比uuid */
    @Input() inUuid: string = 'key';
    /**配置(异步传入无效，请使用单项属性配置) */
    @Input() inPara: SelectPara = {};
    /**单项配置 */
    /**emit出去的类型*/
    @Input() inOutType: SelectModelType;
    /**是否显示后缀图标标志 */
    @Input() inFlag: boolean;
    /**是否显示选项多选框 */
    @Input() inCheck: boolean;
    /**是否显示清空按钮 */
    @Input() inClear: boolean;
    /**是否多选 */
    @Input() inMulti: boolean;
    /**是否拥有激活项状态 false*/
    @Input() inActive: boolean;
    /**是否可以用户输入添加 false*/
    @Input() inAdd: boolean;
    /**是否开启子类选择 false*/
    @Input() inSon: boolean;
    /**是否父子项联动 false*/
    @Input() inGanged: boolean;
    /**提示语 请选择*/
    @Input() inPlace: string;
    /**下拉无数据提示 暂无数据*/
    @Input() inTip: string;
    /**是否至少勾选一个 */
    @Input() inOne: boolean;
    /**open框类型 */
    @Input() inType: SelectOpenType;
    /**是否选中就关闭 */
    @Input() inClose: boolean;
    /**是否有确定按钮*/
    @Input() inAuto: boolean;
    /**弹窗宽度 */
    @Input() inOverlayWidth: number | string;
    /**选中项发生改变 */
    @Output() modelOptionsChange: EventEmitter<SelectModel> = new EventEmitter();
    /**激活项发生改变 */
    @Output() onOptionsChange: EventEmitter<SelectOption> = new EventEmitter();
    protected defaultPara: SelectPara = {
        type: SelectOpenType.base,
        /**是否显示后缀图标标志 true*/
        ifFlag: true,
        /**是否显示选项多选框(仅基础组件有用)  true*/
        ifCheck: true,
        /**是否显示清空按钮 false*/
        ifClear: false,
        /**是否是多选 false*/
        ifMulti: false,
        /**是否拥有激活项状态 false*/
        ifActive: false,
        /**是否可以输入 false*/
        ifAdd: false,
        /**是否开启子类选择 false*/
        ifSon: false,
        /**至少选择一个，默认选中第一个 false*/
        ifOne: false,
        /**是否父子项联动 false*/
        ifGanged: false,
        /**提示语 请选择*/
        placeholder: '请选择',
        /**下拉无数据提示 暂无数据*/
        noneTip: "暂无数据",
        ifAuto: true,
        ifClose: true,
    }
    /**选中的选项集合 */
    public checkOptions: SelectOptions = [];
    /**输入选项类型*/
    private _inputType: SelectModelType = 'string';
    /**emit出去的选中数据*/
    protected emitModelOptions: SelectModel;
    /**上一次emit出去的选项（用于判断当前的选中改变是否需要触发emit）*/
    protected emitCheckOptions: SelectOptions = [];
    /**弹窗的打开状态 */
    public overlayOpen: boolean = !1;
    /**弹窗的宽度 */
    public overlayWidth: number | string;
    /** 所有选项*/
    public options: SelectOptions = [];
    @ViewChild(CdkOverlayOrigin, { static: true }) cdkOverlayOrigin: CdkOverlayOrigin;
    ngOnChanges(changes: SimpleChanges): void {
        super.ngPerfixChange(changes);
        if (UtilChanges(changes, 'modelOptions') && !UtilIsEqual(this.modelOptions, this.emitModelOptions)) {
            this.setCheckOptions();
        }
        if (UtilChangesValue(changes, 'inOptions')) {
            this.options = this.getOptions(this.inOptions);
            this.setCheckOptions();
        }
    }

    ngOnInit() {
        this.setPara();
        if (this.inOne && !this.checkOptions.length && this.options.length) {
            let option = this.options && this.options[0];
            option._check = true;
            this.modelOptions = option[this.inUuid];
            this.setCheckOptions();
            Promise.resolve().then(() => { this._emitModelOption(true); })
        }
    }

    /**设置配置项 */
    setPara() {
        let para = this.inPara = Object.assign({}, this.defaultPara, this.inPara);
        this.inOutType = this.inOutType ?? para.outType;
        this.inFlag = this.inFlag ?? para.ifFlag;
        this.inCheck = this.inCheck ?? para.ifCheck;
        this.inClear = this.inClear ?? para.ifClear;
        this.inMulti = this.inMulti ?? para.ifMulti;
        this.inActive = this.inActive ?? para.ifActive;
        this.inAdd = this.inAdd ?? para.ifAdd;
        this.inSon = this.inSon ?? para.ifSon;
        this.inGanged = this.inGanged ?? para.ifGanged;
        this.inPlace = this.inPlace ?? para.placeholder;
        this.inTip = this.inTip ?? para.noneTip;
        this.inOne = this.inOne ?? para.ifOne;
        this.inType = this.inType ?? para.type;
        this.inAuto = this.inAuto ?? para.ifAuto;
        this.inClose = this.inClose ?? para.ifClose;
        this.inOverlayWidth = this.inOverlayWidth ?? para.overlayWidth;
    }

    getOptions(options: any[]): any[] {
        options = options.map(e => {
            if (typeof e === 'string' || typeof e === 'number') {
                return { key: e, value: e };
            } else {
                return e
            }
        });
        return options
    }

    /**设置选中 并判断model的类型 string | object | strings | objects */
    setCheckOptions() {
        let option = this.modelOptions || [], value = option[0], id = this.inUuid, checkOptions, inputType;
        if (Array.isArray(option)) {
            if (typeof value !== "object") {
                inputType = 'strings';
                checkOptions = [...option].map(e => { return this._getOptionByValue(e as string); })
            } else {
                inputType = 'objects';
                checkOptions = [...option].map(e => { return this._getOptionByValue(e[id] as string) });
            }
        } else {
            if (typeof option == "string" || typeof option == "number") {
                inputType = 'string';
                checkOptions = (option + '').split(',').map(e => { return this._getOptionByValue(e as string) })
            } else {
                inputType = 'object';
                checkOptions = [option].map(e => { return this._getOptionByValue(e[id] as string) })
            }
        }
        if (!this.inMulti) {
            checkOptions = checkOptions.length ? [checkOptions[0]] : [];
        }
        this._inputType = inputType, this.checkOptions = checkOptions;
        this.emitCheckOptions = UtilArray.copy(this.checkOptions);
    }

    /**通过关键inUuid来获取选项 
     * 没有该选项这创建并加入到选项中 */
    private _getOptionByValue(value: string): SelectOption {
        let option = UtilArray.getObjByValue(this.options, this.inUuid as keyof SelectOption, value, this.inSon ? undefined : '');
        UtilArray.getAncestorsByValue
        if (!option) {
            option = this._createOptionByValue(value);
            this.options.unshift(option)
        }
        return option;
    }

    /**创建新的选项 */
    protected _createOptionByValue(value): SelectOption {
        return { key: value, value, showName: value, _check: true };
    }

    /**打开选框 */
    onOpenOverlay() {
        this.overlayWidth || this._setOpenWidth();
        this.overlayOpen = !0;
    }

    /**设置弹窗宽度 */
    private _setOpenWidth() {
        if (this.inOverlayWidth) {
            this.overlayWidth = this.inOverlayWidth;
        } else {
            let el = this.nativeEl.querySelector('.share-select-panel')
            let rect = el.getBoundingClientRect();
            this.overlayWidth = rect.width || undefined;
        }
    }

    /**清空 */
    onClearNodes() {
        event.stopPropagation();
        this.checkOptions = [];
        this._emitModelOption();
    }

    /**删除选中 */
    onRemoveNode(option: SelectOption) {
        event.stopPropagation();
        UtilArray.itemRemove(this.checkOptions, option);
        this._emitModelOption();
    }

    /**关闭选框并根据输入类型输出选中数据 */
    onCloseOptions(): void {
        this.overlayOpen = !1;
        this._emitModelOption();
    }

    onCheckChange($event: SelectOption[]) {
        this.checkOptions = $event;
        if (this.inClose) {
            this.onCloseOptions();
        }
    }

    /**根据输入类型输出选中数据(this.checkOptions)
     * flag为true时强制弹出
    */
    protected _emitModelOption(flag = false) {
        if (UtilIsEqual(this.emitCheckOptions, this.checkOptions, this.inUuid) && !flag) return;
        /**不copyDeep用户输入类型会导致Equal始终为true */
        let original = this.emitCheckOptions = UtilArray.copyDeep(this.checkOptions);
        let uuids = original.map(e => e[this.inUuid]);
        let outType = this.inOutType || this._inputType;
        if (outType == "string") {
            this.emitModelOptions = uuids.join(',');
        } else if (outType == "strings") {
            this.emitModelOptions = uuids;
        } else if (outType == 'object') {
            this.emitModelOptions = original[0]
        } else {
            this.emitModelOptions = original;
        }
        this.modelOptionsChange.emit(this.emitModelOptions);
    }
}