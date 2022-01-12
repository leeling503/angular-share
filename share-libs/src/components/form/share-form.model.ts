import { TemplateRef } from "@angular/core";

export type ShareFormItems = ShareFormItem[];
export type ShareFormItemType = 'input' | 'template';
export interface ShareFormItem {
    /**项目标题 */
    title?: string,
    /**对应的key */
    key?: string,
    /**项目类型 */
    type?: ShareFormItemType
    /**整项宽度百分比 (0-100)*/
    width: number;
    /**内容绝对宽度需要自己带宽度单位 */
    widthV?: string;
    /**高度 (37PX的倍数)*/
    height?: number;
    /**该单项的value输出模版 */
    ref?: TemplateRef<any>
    /**数据单位 */
    unit?: string;
    /**必填项目 */
    require?: boolean;
}