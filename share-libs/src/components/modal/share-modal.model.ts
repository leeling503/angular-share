import { TemplateRef, Type } from '@angular/core';
import { ShareOverlayConfig, ShareOverlayPosition } from 'share-libs/src/services/share-overlay.service';
import { ShareModalComponent } from './modal/modal.component';

/**T表示传入的组件 如果是template建议填写undefined */
export interface ShareModalPara<T = any, M = ShareModalComponent<T>> {
    /**弹窗属性配置*/
    overlayer?: ShareOverlayConfig;
    /**弹框宽度*/
    width?: number | string;
    /**弹框高度*/
    height?: number | string;
    /**弹出的统一组件属性*/
    modalPara?: Partial<M>;//
    /**弹窗的标题 */
    title?: string;
    /*传入的组件*/
    component?: Type<T>;
    /**传入的template */
    template?: TemplateRef<any>
    /**传给component的数据*/
    componentPara?: Partial<T>;
    /**弹窗的按钮组*/
    btns?: TypeFooterBtn[];
    /**弹窗定位配置 */
    position?: ShareOverlayPosition;
    /**弹窗关闭的回调函数 */
    onCbClose?: (data) => any;
}

export class ShareModalTip {
    /**弹窗的标题 */
    title?: string = "提示";
    /**弹窗的按钮组*/
    btns?: TypeFooterBtn[] = ['primary'];
    /**弹窗关闭的回调函数 */
    onCbClose?: (data) => any;
    /**tip弹窗的类型 */
    type?: TypeModalTip = 'success';
    /**tip弹窗的提示信息 */
    info?: TypeModalTip
    /**弹窗属性配置*/
    overlayer?: ShareOverlayConfig = {};
    /**弹窗定位配置 */
    position?: ShareOverlayPosition = new ShareOverlayPosition();
}

export interface ModalCloseData {
    /**关闭的类型 0是确定  1是取消  2是关闭*/
    type?: 0 | 1 | 2,
    data?: any
}

export type TypeFooterBtn = 'primary' | 'cancel' | 'close';
export type TypeModalTip = 'success' | 'error' | 'confirm' | 'warning' | 'tip';