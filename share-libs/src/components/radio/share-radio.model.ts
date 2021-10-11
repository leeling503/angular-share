
export type RadioIconType = 'radio' | 'check' | 'cricle';

export interface RadioPara {
    /**可多选 */
    ifMulti?: boolean;
    /**能否全部去勾选 */
    ifClear?: boolean;
    /**图标类型 */
    iconType?: RadioIconType;
    /**禁用按钮能否被单选去勾选 默认不可以*/
    ifDisCancel?: boolean;
    /**取哪个属性的值 (key 需要使用 inKey)*/
    key?: string;
}

export interface RadioData {
    /**按钮的唯一标识 */
    key?: string | boolean;
    /**按钮代表的值 */
    value?: string | number | boolean;
    /**是否选中 */
    _check?: boolean;
    /**是否禁用 */
    _dis?: boolean;
}
