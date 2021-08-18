import { Directive, ElementRef, EventEmitter, Input, Output, SimpleChanges } from "@angular/core";
import * as L from "leaflet";
import { LeafletNetMap, NetMap } from "share-libs/assets/leaflet/leaflet-net-map";
import { UtilChanges, UtilChangesValue } from "share-libs/src/utils";

@Directive({
    selector: '[share-map-net],[map-net]'
})
export class MapNetDirective {
    constructor(private el: ElementRef) {
        this.nativeEl = this.el.nativeElement;
    }
    nativeEl: HTMLElement
    netMap: LeafletNetMap = new LeafletNetMap(NetMap.gaoDeNormalMap);
    @Input() map: L.Map;
    @Input() inMapName: NetMap;
    ngOnChanges(changes: SimpleChanges): void {
        if (UtilChangesValue(changes, 'map')) {
            this.netMap.addTo(this.map)
        }
        if (UtilChangesValue(changes, 'inMapName')) {
            this.netMap.changeMap(this.inMapName);
        }
    }
    ngOnInit(): void {
        this.netMap.addTo(this.map)
    }
}