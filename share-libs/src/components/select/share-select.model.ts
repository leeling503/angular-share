export class SelectConfig {
    /**是否显示control标签 */
    showFlag: boolean = true;
    /**是否显示选项多选框  */
    showCheck: boolean = true;
    /**是否显示清空按钮 */
    showClear: boolean = true;
    /**是否是多选同时也会根据传入的数据类型判断 */
    multi: boolean = true;
    /**是否拥有激活项状态 */
    hasActive: boolean = false;
    /**提示语 */
    placeholder: string = '请选择';
    /**下拉无数据提示 */
    noneTip: string = '暂无数据';
    /**默认选中第一个，对多选无效  */
    leastOne: boolean = true;
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
