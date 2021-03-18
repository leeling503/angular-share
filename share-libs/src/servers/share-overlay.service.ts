import { Overlay, OverlayRef, OverlayConfig } from '@angular/cdk/overlay';
import { Injectable, ElementRef } from '@angular/core';
import { TemplatePortal } from '@angular/cdk/portal';

@Injectable({
    providedIn: 'root'
})
export class ShareOverlayService {
    private overlayRef: OverlayRef;
    constructor(private overlay: Overlay) { }
    createOverlay(position: OverlayPosition, overlayContext: TemplatePortal<any>, config: OverlayConfig = new OverlayConfig()) {
        this.clearOverlay();
        let positionStrategy;
        if (position.type == 'body') {
            positionStrategy = this.getBodyPositionStrategy(position)
        } else {
            positionStrategy = this.getFlexPositionStrategy(position);
        }
        config.positionStrategy = positionStrategy;
        this.overlayRef = this.overlay.create(config)
        this.overlayRef.attach(overlayContext);
        this.overlayRef.backdropClick().subscribe(res => { console.log(res); this.overlayRef.detach() })
        return this.overlayRef;
    }

    getFlexPositionStrategy(position: OverlayPosition) {
        let event: MouseEvent = position.event;
        let originEl: ElementRef;
        if (position.type == 'event') {
            originEl = new ElementRef({
                getBoundingClientRect: (): ClientRect => ({
                    bottom: event.clientY + position.bottom,
                    left: event.clientX + position.left,
                    right: event.clientX + position.right,
                    top: event.clientY + position.top,
                    height: 0,
                    width: 0,
                })
            })
        } else {
            originEl = new ElementRef({
                getBoundingClientRect: (): ClientRect => {
                    let rect = position.element.getBoundingClientRect();
                    return {
                        bottom: rect.bottom + position.bottom,
                        left: rect.left + position.left,
                        right: rect.right + position.right,
                        top: rect.top + position.top,
                        height: rect.height,
                        width: rect.width,
                    }
                }
            })
        }
        const positionStrategy = this.overlay.position().flexibleConnectedTo(originEl).withPositions([{
            originX: 'start',
            originY: 'bottom',
            overlayX: 'start',
            overlayY: 'top',
        }, {
            originX: 'start',
            originY: 'top',
            overlayX: 'start',
            overlayY: 'bottom',
        }])
        return positionStrategy;
    }

    getBodyPositionStrategy(position: OverlayPosition) {
        let positionStrategy = this.overlay.position()
            .global()
        let centerVertically = position.centerVertically;
        if (centerVertically !== undefined && centerVertically !== null) {
            positionStrategy.centerVertically()
        }
        let centerHorizontally = position.centerHorizontally;
        if (centerHorizontally !== undefined && centerHorizontally !== null) {
            positionStrategy.centerHorizontally()
        }
        let top = position.top,
            left = position.left,
            right = position.right,
            bottom = position.bottom;
        if (top || left || right || bottom) {
            positionStrategy.top(top + 'px');
            positionStrategy.left(left + 'px');
            positionStrategy.right(right + 'px');
            positionStrategy.bottom(bottom + 'px');
        }
        return positionStrategy;
    }

    clearOverlay() {
        this.overlayRef && this.overlayRef.detach()
    }

}

export class OverlayPosition {
    type?: 'event' | 'flexible' | 'body' = 'body';//相对鼠标或指定元素或body进行定位
    event?: MouseEvent;//鼠标事件event
    element?: HTMLElement;//指定元素
    centerHorizontally?: boolean = true;//水平居中
    centerVertically?: boolean = true;//垂直居中
    top?: number = 0;//各方位偏移量
    left?: number = 0;//各方位偏移量
    right?: number = 0;//各方位偏移量
    bottom?: number = 0;//各方位偏移量
    width?: string;//宽
    height?: string;//高
}