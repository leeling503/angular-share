import { Overlay, OverlayRef, OverlayConfig, ScrollStrategy, PositionStrategy, ConnectedPosition } from '@angular/cdk/overlay';
import { Injectable, ElementRef, ComponentRef, EmbeddedViewRef, TemplateRef, ViewContainerRef } from '@angular/core';
import { ComponentPortal, ComponentType, TemplatePortal } from '@angular/cdk/portal';
import { DragDrop } from '@angular/cdk/drag-drop';

/**弹窗服务 */
@Injectable({
    providedIn: 'root'
})
export class ShareOverlayService {
    constructor(private overlay: Overlay, private drag_: DragDrop) { }
    /**显示组件 */
    show<T>(a: ComponentType<T>, b?: ShareOverlayPosition, c?: ShareOverlayConfig): ShareOverlayComponent<T>;
    /**TemplatePortal通过ViewChild和cdkPortal指令
     * ts @ViewChild(CdkPortal, { static: true }) X: TemplatePortal<any>;
     * html <ng-template cdkPortal>  或 <div *cdkPortal>
     **/
    show<T>(a: TemplatePortal<T>, b?: ShareOverlayPosition, c?: ShareOverlayConfig): ShareOverlayTemplate<T>;
    /**显示template (必传第四位ViewContainerRef ， 2，3位可传undefined得到默认值)
    * ts @ViewChild("ddd", { read: ViewContainerRef ,static: true }) X:ViewContainerRef;
    * html <ng-template #ddd>  
    **/
    show<T>(a: TemplateRef<T>, b?: ShareOverlayPosition, c?: ShareOverlayConfig, d?: ViewContainerRef): ShareOverlayTemplate<T>;
    show<T>(
        temp: TemplatePortal<T> | ComponentType<T> | TemplateRef<T>,
        position: ShareOverlayPosition = new ShareOverlayPosition(),
        overlay: ShareOverlayConfig = new ShareOverlayConfig(),
        view?: ViewContainerRef
    ) {
        let protal: TemplatePortal<T> | ComponentPortal<T>;
        if (temp instanceof TemplatePortal) {
            return this.showTemplate(temp, position, overlay)
        } else if (temp instanceof TemplateRef) {
            protal = new TemplatePortal(temp, view);
            return this.showTemplate(protal, position, overlay)
        } else {
            protal = new ComponentPortal(temp);
            return this.showComponent(protal, position, overlay)
        }
    }

    /**显示组件 */
    private showComponent<T>(
        componentPortal: ComponentPortal<T>,
        position: ShareOverlayPosition = new ShareOverlayPosition(),
        overlay: ShareOverlayConfig = new ShareOverlayConfig()): ShareOverlayComponent<T> {
        let overlayComponent: ShareOverlayComponent = {};
        this.setContext(overlayComponent, componentPortal, position, overlay);
        overlayComponent.component = overlayComponent.modalRef.instance;
        return overlayComponent;
    }

    /**显示template  
     * TemplatePortal通过ViewChild和cdkPortal指令    @ViewChild(CdkPortal, { static: true }) X: TemplatePortal<any>;
     * 需要PortalModule模块
     * */
    private showTemplate<T>(
        overlayContext: TemplatePortal<T>,
        position: ShareOverlayPosition = new ShareOverlayPosition(),
        overlay: ShareOverlayConfig = new ShareOverlayConfig()): ShareOverlayTemplate<T> {
        let overlayTemplate: ShareOverlayTemplate = {}
        this.setContext(overlayTemplate, overlayContext, position, overlay);
        return overlayTemplate;
    }

    instanceComponent<T>(overlay: ShareOverlayComponent<T>, pa: Partial<T>) {
        Object.assign(overlay.component, pa);
    }

    private setContext(overlay: ShareOverlay, overlayContext: TemplatePortal | ComponentPortal<any>, position: ShareOverlayPosition, config: ShareOverlayConfig) {
        this.setConfig(position, config);
        let overlayRef = overlay.overlayRef = this.overlay.create(config);
        overlay.modalRef = overlayRef.attach(overlayContext);
        if (config.backdropClick) {
            overlay.overlayRef.backdropClick().subscribe(() => {
                overlayRef.detach()
            })
        }
    }

    /**设置弹窗的定位策略 */
    private setConfig(position: ShareOverlayPosition, config: ShareOverlayConfig) {
        let positionStrategy;
        if (position.type == "event" || position.type == "ele") {
            positionStrategy = this.getFlexPositionStrategy(position);
        } else {
            positionStrategy = this.getBodyPositionStrategy(position)
        }
        config.positionStrategy = positionStrategy;
    }

    /**得到相对定位的策略 */
    private getFlexPositionStrategy(position: ShareOverlayPosition) {
        let event: MouseEvent = position.event;
        let originEl: ElementRef;
        let x = position.x || 0,
            y = position.y || 0;
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
    /**得到body定位的策略 */
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
        x !== undefined && positionStrategy.left(x + 'px');
        y !== undefined && positionStrategy.top(y + 'px');
        return positionStrategy;
    }
}

/**弹窗的属性配置*/
export class ShareOverlayConfig extends OverlayConfig {
    /**是否启用背景遮罩*/
    hasBackdrop?: boolean;
    /**背景遮罩的class*/
    backdropClass?: 'E_O_shade' | 'E_O_transparent';
    /**点击遮罩是否关闭 */
    backdropClick?: boolean;
    /** */
    positionStrategy?: PositionStrategy;
    /** */
    scrollStrategy?: ScrollStrategy;
    /**弹窗面板的class*/
    panelClass?: string;
    /**弹窗宽(定位相对于body时百分比是相对body，但另外两种情况不一样)*/
    width?: number | string;
    /**弹窗高(定位相对于body时百分比是相对body，但另外两种情况不一样)*/
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
    constructor(data: ShareOverlayConfig = {}) {
        super();
        /** 当??不兼容时 可采用UtilSetValue(data.hasBackdrop ,true) */
        this.hasBackdrop = data.hasBackdrop ?? true;
        this.backdropClass = data.backdropClass || 'E_O_transparent';
        this.panelClass = data.panelClass || 'E_O_panel';
        this.width = data.width ?? null;
        this.height = data.height ?? null;
        this.maxWidth = data.maxWidth ?? "95%";
        this.maxHeight = data.maxHeight ?? "95%";
        this.minWidth = data.minWidth ?? 100;
        this.minHeight = data.minHeight ?? 100;
        this.backdropClick = data.backdropClick ?? true;
        this.positionStrategy = data.positionStrategy;
        this.scrollStrategy = data.scrollStrategy;
        this.disposeOnNavigation = data.disposeOnNavigation;
    }
}

/**弹窗的定位配置*/
export class ShareOverlayPosition {
    /**相对 鼠标（需配置event属性） | 指定元素（需配置element属性） | body 进行定位 */
    type?: 'event' | 'ele' | 'body';
    /**鼠标事件event*/
    event?: MouseEvent;
    /**指定元素*/
    element?: HTMLElement;
    /**水平居中*/
    centerHorizontally?: boolean;
    /**垂直居中 */
    centerVertically?: boolean;
    /**x方位偏移量(left)正数向右偏移 */
    x?: number;
    /**y方位偏移量(top)正数向下偏移 */
    y?: number;
    /**定位点链接位 */
    withPositions?: ConnectedPosition[]
    constructor(data: any = {}) {
        this.type = data.type || 'body';
        this.event = data.event
        this.element = data.element
        this.centerHorizontally = data.centerHorizontally ?? true;
        this.centerVertically = data.centerVertically ?? true;
        this.x = data.x;
        this.y = data.y;
        this.withPositions = data.withPositions || [{
            originX: 'end',
            originY: 'bottom',
            overlayX: 'start',
            overlayY: 'top',
        }]
    }
}

export interface ShareOverlay {
    /**弹出层Ref，可销毁弹出层 */
    overlayRef?: OverlayRef;
    /**内容madalRef，可销毁弹出内容(弹出层遮罩依旧存在) */
    modalRef?: any;
}

export interface ShareOverlayComponent<T = any> extends ShareOverlay {
    modalRef?: ComponentRef<T>;
    component?: T
}
export interface ShareOverlayTemplate<T = any> extends ShareOverlay {
    modalRef?: EmbeddedViewRef<T>;
}