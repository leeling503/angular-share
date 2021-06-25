import { Overlay, OverlayRef, OverlayConfig, ScrollStrategy, PositionStrategy, ConnectedPosition } from '@angular/cdk/overlay';
import { Injectable, ElementRef, ComponentRef, EmbeddedViewRef } from '@angular/core';
import { ComponentPortal, TemplatePortal } from '@angular/cdk/portal';

/**弹窗服务 */
@Injectable({
    providedIn: 'root'
})
export class ShareOverlayService {
    private overlayRef: OverlayRef;
    private ShareOverlayComponent: ShareOverlayComponent<any>;
    private ShareOverlayTemplate: ShareOverlayTemplate<any>;
    constructor(private overlay: Overlay) { }
    showComponent<T>(overlayContext: ComponentPortal<T>, position: ShareOverlayPosition = new ShareOverlayPosition(), config: OverlayConfig = new ShareOverlayConfig()): ShareOverlayComponent<T> {
        this.setConfig<T>(position, config);
        this.ShareOverlayComponent = {};
        this.setContext(this.ShareOverlayComponent, overlayContext, position, config);
        this.ShareOverlayComponent.component = this.ShareOverlayComponent.modalRef.instance;
        return this.ShareOverlayComponent;
    }

    showTemplate<T>(overlayContext: TemplatePortal<T>, position: ShareOverlayPosition = new ShareOverlayPosition(), config: OverlayConfig = new ShareOverlayConfig()): ShareOverlayTemplate<T> {
        this.ShareOverlayTemplate = {};
        this.setContext(this.ShareOverlayTemplate, overlayContext, position, config);
        return this.ShareOverlayTemplate;
    }

    instanceComponent<T>(overlay: ShareOverlayComponent<T>, pa: Partial<T>) {
        Object.assign(overlay.component, pa);
    }

    private setContext<T>(overlay: T, overlayContext, position, config): T {
        this.setConfig<T>(position, config);
        overlay['overlayRef'] = this.overlayRef = this.overlay.create(config);
        let modalRef = this.overlayRef.attach(overlayContext);
        overlay['modalRef'] = modalRef;
        overlay['overlayRef'].backdropClick().subscribe(res => {
            this.overlayRef.detach()
        })
        return overlay;
    }

    private setConfig<T>(position: ShareOverlayPosition, config: OverlayConfig) {
        this.clearOverlay();
        let positionStrategy;
        if (position.type == "event" || position.type == "ele") {
            positionStrategy = this.getFlexPositionStrategy(position);
        } else {
            positionStrategy = this.getBodyPositionStrategy(position)
        }
        config.positionStrategy = positionStrategy;
    }

    private getFlexPositionStrategy(position: ShareOverlayPosition) {
        let event: MouseEvent = position.event;
        let originEl: ElementRef;
        let x = position.x,
            y = position.y;
        if (position.type == 'event') {
            if (!position.event) {
                return this.getBodyPositionStrategy(position);
            }
            originEl = new ElementRef({
                getBoundingClientRect: (): ClientRect => ({
                    bottom: event.clientY + y,
                    left: event.clientX + x,
                    right: event.clientX + x,
                    top: event.clientY + y,
                    height: 0,
                    width: 0,
                })
            })
        } else {
            if (!position.element) {
                return this.getBodyPositionStrategy(position);
            }
            originEl = new ElementRef({
                getBoundingClientRect: (): ClientRect => {
                    let rect = position.element.getBoundingClientRect();
                    return {
                        bottom: rect.bottom + y,
                        left: rect.left + x,
                        right: rect.right + x,
                        top: rect.top + y,
                        height: rect.height,
                        width: rect.width,
                    }
                }
            })
        }
        const positionStrategy = this.overlay.position().flexibleConnectedTo(originEl).withPositions(position.withPositions)
        return positionStrategy;
    }

    private getBodyPositionStrategy(position: ShareOverlayPosition) {
        let positionStrategy = this.overlay.position()
            .global()
        if (position.centerVertically) {
            positionStrategy.centerVertically()
        }
        if (position.centerHorizontally === true) {
            positionStrategy.centerHorizontally()
        }
        let x = position.x,
            y = position.y;
        if (x || y) {
            positionStrategy.top(y + 'px');
            positionStrategy.left(x + 'px');
        }
        return positionStrategy;
    }

    clearOverlay() {
        this.overlayRef && this.overlayRef.detach()
    }

}

export class ShareOverlayConfig extends OverlayConfig {
    /** */
    hasBackdrop = true;
    /** */
    backdropClass = 'transparent';
    /** */
    positionStrategy?: PositionStrategy;
    /** */
    scrollStrategy?: ScrollStrategy;
    /** */
    panelClass = 'share-overlay-panel';
    /** */
    width?: number | string;
    /** */
    height?: number | string;
    /** */
    minWidth?: number | string;
    /** */
    minHeight?: number | string;
    /** */
    maxWidth?: number | string;
    /** */
    maxHeight?: number | string;
    /** */
    disposeOnNavigation?: boolean;
}

export class ShareOverlayPosition {
    /**相对 鼠标 | 指定元素 | body 进行定位*/
    type?: 'event' | 'ele' | 'body' = 'body';
    /**鼠标事件event*/
    event?: MouseEvent;
    /**指定元素*/
    element?: HTMLElement;
    /**水平居中*/
    centerHorizontally?: boolean = true;
    /**垂直居中 */
    centerVertically?: boolean = true;
    /**x方位偏移量正数向右偏移 */
    x?: number = 0;
    /**y方位偏移量正数向下偏移 */
    y?: number = 0;
    /**宽 */
    width?: string;
    /**高 */
    height?: string;
    /**定位点链接位 */
    withPositions?: ConnectedPosition[] = [{
        originX: 'end',
        originY: 'bottom',
        overlayX: 'start',
        overlayY: 'top',
    }]
}

export interface ShareOverlay<T> {
    overlayRef?: OverlayRef;
}

export interface ShareOverlayComponent<T> extends ShareOverlay<T> {
    modalRef?: ComponentRef<T>;
    component?: T
}
export interface ShareOverlayTemplate<T> extends ShareOverlay<T> {
    modalRef?: EmbeddedViewRef<T>;
}