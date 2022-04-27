export type InputType = "text" | "number";
export type ShareSize = "normal" | "small" | "large";

export enum TypeInput {
    text = 'text',
    /**数字（正负小数） */
    number = 'number',
    /**整数（正负）*/
    int = 'int',
    /**正数*/
    plusInt = 'plusInt',
    /**不允许出现空格 */
    noNull = 'noNull',
}

