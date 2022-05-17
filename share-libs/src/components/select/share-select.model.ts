export interface SelectPara {
    /**提示语 请选择*/
    placeholder?: string;
    /**emit出去的类型 */
    outType?: SelectModelType;
    /**下拉无数据提示 暂无数据*/
    noneTip?: string;
    /**弹窗宽度 */
    overlayWidth?: number | string;
    /**类型 */
    type?: SelectOpenType;
    /**是否显示后缀图标标志 true*/
    ifFlag?: boolean;
    /**是否显示选项多选框  true*/
    ifCheck?: boolean;
    /**是否显示清空按钮 false*/
    ifClear?: boolean;
    /**是否是多选 false*/
    ifMulti?: boolean;
    /**是否拥有激活项状态(true只有在ifCheck也为true时生效) false */
    ifActive?: boolean;
    /**是否可以输入添加选项 false*/
    ifAdd?: boolean;
    /**至少选择一个，默认选中第一个 false*/
    ifOne?: boolean;
    /**是否开启子类选择 false*/
    ifSon?: boolean;
    /**是否父子项联动 false*/
    ifGanged?: boolean;
    /**是否不需要按钮，关闭弹窗就自动更新 */
    ifAuto?: boolean;
    /**是否选中就自动关闭弹窗（多选不推荐） */
    ifClose?: boolean;
}
/**select选框的open框类型 */
export enum SelectOpenType {
    /**基础选择框（普通） */
    base = "base",
    /**具有选项和确定取消按钮的弹窗 */
    add = 'add',
    /**父子项不在同一面板 */
    panel = "panel"
}

export interface SelectOption {
    key?: string;
    value?: string;
    /**选中后显示在框内Name */
    showName?: string;
    /**子项 */
    children?: SelectOption[];
    /**显示子节点*/
    showChild?: boolean;
    /**本身被勾选 */
    _check?: boolean;
    /**有子项被勾选 */
    _mix?: boolean;
    /**禁用 */
    _dis?: boolean;
    /**用户自行添加 */
    _add?: boolean;
}
/**选项组 */
export type SelectOptions = SelectOption[];
/**输入model类型 */
export type SelectModel = string | SelectOption | string[] | SelectOption[];
/**输入类型 */
export type SelectModelType = 'string' | 'object' | 'strings' | 'objects';
