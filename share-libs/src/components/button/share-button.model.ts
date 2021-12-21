import { SizeBtn, TypeBtn, ColorEnum, IconClass } from "share-libs/src/enum";

/**按钮配置*/
export class ShareParaBtn {
    /**按钮预设大小 */
    size?: SizeBtn = SizeBtn.default;
    /**按钮类型背景色*/
    type?: TypeBtn = TypeBtn.default;
    /**前置图标class*/
    iconPer?: IconClass;
    /**后置图标class*/
    iconSuf?: IconClass;
    /**是否禁用*/
    ifDisable?: boolean;
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
    /**按钮点击事件 */
    click?: ($event) => any;
    /**前置图标点击事件 */
    clickPer?: ($event) => any;
    /**后置图标点击事件 */
    clickSuf?: ($event) => any;
}
