
export class RadiosPara {
    /**可多选 */
    multi?: boolean;
    /**能否取消 */
    clear?: boolean;
    /**图标类型 */
    iconType?: RadioIconType;
    /** */
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
export type RadioIconType = 'radio' | 'check' | 'cricle';