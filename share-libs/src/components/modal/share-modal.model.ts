import { OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { TemplateRef, Type, ComponentRef } from '@angular/core';
import { ShareModalComponent } from './modal.component';

export interface ShareModalPara<T = any, M = ShareModalComponent<T>> {
    modalWidth?: number;//弹框宽度
    modalHeight?: number;//弹框高度
    modalPara?: Partial<M>;//ShareModalComponent的属性
    modalComponent?: Type<T>;//传入的组件
    modalComponentPara?: Partial<T>;//传给template或component的数据
    overlayerConfig?: OverlayConfig;
}

export class ModalContentStyles {
    "background-color"?: string;
    width?: string;
    "min-width"?: string;
    "max-width"?: string;
    height?: string;
    "min-height"?: string;
    "max-height"?: string;
}