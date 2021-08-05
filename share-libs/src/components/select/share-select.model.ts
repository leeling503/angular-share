export interface SelectPara {
    /**是否显示后缀图标标志 true*/
    ifFlag?: boolean;
    /**是否显示选项多选框  true*/
    ifCheck?: boolean;
    /**是否显示清空按钮 true*/
    ifClear?: boolean;
    /**是否是多选 false*/
    ifMulti?: boolean;
    /**是否拥有激活项状态 false*/
    ifActive?: boolean;
    /**是否可以输入 false*/
    ifInput?: boolean;
    /**是否开启子类选择 false*/
    ifSonCheck?: boolean;
    /**是否拥有激活项状态 false*/
    ifGanged?: boolean;
    /**提示语 请选择*/
    placeholder?: string;
    /**下拉无数据提示 暂无数据*/
    noneTip?: string;
    /**至少选择一个，默认选中第一个 false*/
    leastOne?: boolean;
    openWidth?: number | string;
}

export interface SelectPanelPara {
    /**是否显示后缀图标标志 true*/
    ifFlag?: boolean;
    /**是否显示清空按钮 true*/
    ifClear?: boolean;
    /**是否是多选 false*/
    // ifMulti: boolean = false;
    /**提示语 请选择*/
    placeholder?: string;
    /**下拉无数据提示 暂无数据*/
    noneTip?: string;
    openWidth?: number | string;
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
}
export type SelectModelInputs = string[] | SelectOption[] | string | SelectOption;

export interface SelectAddPara extends SelectPara {
    /**开启默认勾选（默认选中第一个）*/
    defualt?: boolean;
    /**能否新增选项 */
    ifAdd?: boolean;
}
export interface SelectAddOption {
    key?: string;
    value?: string;
    /**选中后显示在框内Name */
    showName?: string;
    /**本身被勾选 */
    _check?: boolean;
}