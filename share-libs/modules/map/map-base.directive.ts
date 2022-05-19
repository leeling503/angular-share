import { Directive, ElementRef, EventEmitter, Input, Output } from "@angular/core";
import * as L from "leaflet";
/**
 * 海图实例化指令
 */
@Directive({
    selector: '[share-map-base],[map-base]'
})
export class MapBaseDirective {
    constructor(private el: ElementRef) {
        this.nativeEl = this.el.nativeElement;
    }
    /**实例化页面节点id */
    @Input() inId: string;
    /**传递实例化Map实例 */
    @Output() onMapInit: EventEmitter<L.Map> = new EventEmitter();
    private nativeEl: HTMLElement

    ngOnInit(): void {
        let map = L.map(this.inId || this.nativeEl, {
            dragging: true,
            zoomControl: false,
            minZoom: 1,
            maxZoom: 26,
            attributionControl: false,
            doubleClickZoom: false,
            closePopupOnClick: false,//点击地图不关闭弹出层
        }).setView([31.25, 123.06], 10);
        this.onMapInit.emit(map)
    }
}