import { Directive, ElementRef, EventEmitter, Input, Output } from "@angular/core";
import * as L from "leaflet";

@Directive({
    selector: '[share-map-base],[map-base]'
})
export class MapBaseDirective {
    constructor(private el: ElementRef) {
        this.nativeEl = this.el.nativeElement;
    }
    nativeEl: HTMLElement
    map: L.Map;
    @Input() inId: string;
    @Output() onMapInit: EventEmitter<L.Map> = new EventEmitter();
    
    ngOnInit(): void {
        let map = L.map(this.inId || this.nativeEl, {
            dragging: true,
            zoomControl: false,
            minZoom: 1,
            maxZoom: 26,
            attributionControl: false,
            doubleClickZoom: false,
            closePopupOnClick: false,//点击地图不关闭弹出层
        }).setView([37, 118], 12);
        this.onMapInit.emit(map)
    }
}