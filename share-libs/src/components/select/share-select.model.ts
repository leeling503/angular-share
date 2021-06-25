class SelectConfig {
    /**是否显示control标签 true*/
    ifFlag: boolean = true;
    /**是否显示选项多选框  true*/
    ifCheck: boolean = true;
    /**是否显示清空按钮 true*/
    ifClear: boolean = true;
    /**是否是多选 false*/
    ifMulti: boolean = false;
    /**是否拥有激活项状态 false*/
    ifActive: boolean = false;
    /**是否拥有激活项状态 false*/
    ifInput: boolean = true;
    /**提示语 请选择*/
    placeholder: string = '请选择';
    /**下拉无数据提示 暂无数据*/
    noneTip: string = '暂无数据';
    /**至少选择一个，默认选中第一个 false*/
    leastOne: boolean = false;
    openWidth: number | string;
}

interface SelectOption {
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
type SelectModelInputs = string[] | SelectOption[] | string | SelectOption;

class SelectAddConfig extends SelectConfig {
    /**开启默认勾选（默认选中第一个）*/
    defualt: boolean;
    /**能否新增选项 */
    ifAdd: boolean;
}
interface SelectAddOption {
    key?: string;
    value?: string;
    /**选中后显示在框内Name */
    showName?: string;
    /**本身被勾选 */
    _check?: boolean;
}

export {
    SelectConfig, SelectOption, SelectModelInputs,
    SelectAddConfig, SelectAddOption
}
