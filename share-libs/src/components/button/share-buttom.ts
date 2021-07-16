import { SizeBtn, TypeBtn, ColorEnum, IconClass } from "share-libs/src/enum";

export class ShareBtn<T = any> {
    /**按钮预设大小 */
    size?: SizeBtn = SizeBtn.default;
    /**按钮背景色*/
    type?: TypeBtn = TypeBtn.primary;
    /**前置图标class*/
    iconPer?: IconClass;
    /**后置图标class*/
    iconSuf?: IconClass;
    /**是否禁用*/
    disable?: boolean;
    /**文字*/
    text?: string;
    /**按钮宽（优先级>size） */
    width?: number;
    /**按钮高（优先级>size） */
    height?: number;
    /**背景色 */
    colorBG?: ColorEnum;
    /**边框颜色 */
    colorBD?: ColorEnum;
    /**文字颜色 */
    color?: ColorEnum;
    click?: () => any;
    clickPer?: () => any;
    clickSuf?: () => any;
}
