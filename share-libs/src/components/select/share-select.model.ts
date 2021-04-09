export class SelectConfig {
    /**是否显示control标签 */
    ifFlag: boolean = true;
    /**是否显示选项多选框  */
    ifCheck: boolean = true;
    /**是否显示清空按钮 */
    ifClear: boolean = true;
    /**是否是多选 */
    ifMulti: boolean = false;
    /**是否拥有激活项状态 */
    ifActive: boolean = false;
    /**提示语 */
    placeholder: string = '请选择';
    /**下拉无数据提示 */
    noneTip: string = '暂无数据';
    /**至少选择一个，默认选中第一个 */
    leastOne: boolean = false;
    openWidth: number | string;
}

export class SelectOption {
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
export type SelectModelInputs = string[] | SelectOption[] | string | SelectOption
