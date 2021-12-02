export type ShareFormItems = ShareFormItem[];
export type ShareFormItemType = 'input' | 'template';
export interface ShareFormItem {
    /**项目标题 */
    title?: string,
    /**对应的key */
    key?: string,
    /**项目类型 */
    type?: ShareFormItemType
    /**宽 (0-100)*/
    width: number;
    /**高度 (37PX的倍数)*/
    height?: number;
    /**数据 */
    values?: any
}