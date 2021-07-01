import { BtnSize, BtnType, IconClass } from "share-libs/src/enum";

export class ShareBtn {
    click?: () => {};
    size?: BtnSize = BtnSize.default;
    /**按钮 */
    type?: BtnType = BtnType.primary;
    /**前置图标class*/
    iconPer?: IconClass;
    /**后置图标class*/
    iconSuf?: IconClass;
    /**是否禁用*/
    disable?: boolean;

    text?: string;
    /**按钮宽（优先级>size） */
    width?: number;
    /**按钮高（优先级>size） */
    height?: number;

}
