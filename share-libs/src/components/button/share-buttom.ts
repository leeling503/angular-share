export interface BtnPara {
    btnClick?: () => {};
    btnSize?: BtnSize;
    btnType?: BtnType;
    btnPerIcon?: string;//前置图标class
    btnSufIcon?: string;//后置图标class
    btnText?: string;
}
export class defaultBtn implements BtnPara {
    btnClick?: () => {};
    btnSize?: BtnSize;
    btnType?: BtnType;
    perIcon?: string;//前置图标class
    sufIcon?: string;//后置图标class
    constructor(para: BtnPara) {
        this.btnClick = para.btnClick;
        this.btnSize = para.btnSize || 'default';
        this.btnType = para.btnType || 'default';
        this.perIcon = para.btnPerIcon;
        this.sufIcon = para.btnSufIcon;
    }
}
export type BtnType = 'primary' | 'danger' | 'default' | 'gray';
export type BtnSize = 'small' | 'default' | 'large';