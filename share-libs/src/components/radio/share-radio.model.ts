
export type RadioIconType = 'radio' | 'check' | 'cricle';
export interface RadiosPara {
    /**可多选 */
    multi?: boolean;
    /**取那个属性的值 */
    valueKey?: string;
    /**能否全部去勾选 */
    clear?: boolean;
    /**图标类型 */
    iconType?: RadioIconType;
    /**禁用按钮能否被单选去勾选 默认可以*/
    disCancel?: boolean;
}
export class RadiosData {
    /**按钮的唯一标识 */
    key?: string;
    /**按钮代表的值 */
    value?: string | number;
    /**是否选中 */
    ifCheck?: boolean;
    /**是否禁用 */
    ifDis?: boolean;
    constructor(data) {
        this.key = data.key;
        this.value = data.value;
        this.ifCheck = data.ifCheck;
        this.ifDis = data.ifDis;
    }
}
