export class ShareBtnPara {
    btnClick?: () => {};
    btnSize?: BtnSize = "default";
    btnType?: BtnType = "primary";
    /**前置图标class*/
    btnPerIcon?: string;
    /**后置图标class*/
    btnSufIcon?: string;
    /** 是否禁用*/
    btnDisable?: boolean;
    btnText?: string;
}
export type BtnType = 'primary' | 'danger' | 'default' | 'gray';
export type BtnSize = 'small' | 'default' | 'large';