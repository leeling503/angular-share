export class SelectConfig {
    showFlag: boolean = true;//是否显示control标签
    showCheck: boolean = false;//是否显示选项多选框
    showClear: boolean = false;//是否显示清空按钮
    multi: boolean = false;//是否是多选同时也会根据传入的数据类型判断
    placeholder: string = '请选择';
    noneTip: string = '暂无数据';
    leastOne: boolean = true;//默认选中第一个，对多选无效
    openWidth: number | string;
}

export class SelectOption {
    id?: string;
    title?: string;
    value: string;
    name: string;
    showName?: string;//选中后显示在框内Name
    children?: SelectOption[];
    showChild?: boolean;//显示子节点
}

export type SelectInput = SelectOption | SelectOption[] | string[] | string | number;
export type SelectInputType = 'SelectOption' | 'string';