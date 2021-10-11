/**选项option类型接口 */
export interface ShareOption {
    key: string,
    value: string,
    children?: ShareOption[]
};