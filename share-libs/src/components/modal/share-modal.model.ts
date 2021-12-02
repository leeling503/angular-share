import { TemplateRef, Type } from '@angular/core';
import { ShareOverlayConfig, ShareOverlayPosition } from 'share-libs/src/services/share-overlay.service';
import { ShareModalTipComponent } from './modal-tip/modal-tip.component';
import { ShareModalComponent } from './modal/modal.component';

/**T表示传入的组件 如果是template建议填写undefined */
export interface ShareModalPara<T = any, M = ShareModalComponent<T>> {
    /**弹窗属性配置*/
    overlayer?: ShareOverlayConfig;
    /**弹窗定位配置 */
    position?: ShareOverlayPosition;
    /**弹出的统一组件属性*/
    modalPara?: Partial<M>;//
    /**弹框宽度*/
    width?: number | string;
    /**弹框高度*/
    height?: number | string;
    /**弹窗的标题 */
    title?: string;
    /**传入的template */
    template?: TemplateRef<any>
    /*传入的组件*/
    component?: Type<T>;
    /**传给component的数据*/
    componentPara?: Partial<T>;
    /**弹窗的按钮组*/
    btns?: TypeFooterBtn[];
}

export class ShareModalTip implements ShareModalPara<ShareModalTipComponent> {
    /**弹窗的标题 */
    title?: string = "提示";
    /**弹窗的按钮组*/
    btns?: TypeFooterBtn[] = ['primary'];
    /**tip弹窗的类型 */
    type?: TypeModalTip = 'success';
    /**tip弹窗的提示信息 */
    info?: any = "操作成功！";
    /**弹窗属性配置*/
    overlayer?: ShareOverlayConfig = new ShareOverlayConfig({
        width: 370,
        height: 220,
        backdropClick: false,
        backdropClass: 'E_O_shade'
    });
    /**弹窗定位配置 */
    position?: ShareOverlayPosition = new ShareOverlayPosition();
    /**tip提示组件 */
    component?: Type<ShareModalTipComponent> = ShareModalTipComponent;
    /**tip提示组件的属性 */
    componentPara?: Partial<ShareModalTipComponent>;
}

/**modal打开，关闭后的回调函数参数 */
export interface ShareModalCbData<T> {
    /**关闭的类型 0是确定  1是取消  2是关闭(勿动 ， 会影响弹窗关闭前的判断)*/
    closeType?: 0 | 1 | 2,
    /**弹窗主组件 */
    data?: ShareModalComponent<T>
}
/**弹窗脚部按钮类型 */
export type TypeFooterBtn = 'primary' | 'cancel' | 'close';
/**提示弹窗类型 */
export type TypeModalTip = 'success' | 'error' | 'confirm' | 'warning' | 'tip' | 'none';