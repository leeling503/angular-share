import { Directive, ElementRef, EventEmitter, Input, Output, SimpleChanges } from "@angular/core";
import * as L from "leaflet";
import { LeafletHeatLayer } from "share-libs/assets/leaflet/leaflet-heat-map";
import { ExMapService } from "share-libs/src/pages/examples/ex-share-map/ex-share-map.service";
import { UtilChangesValue } from "share-libs/src/utils";

@Directive({
    selector: '[share-map-heat],[map-heat]'
})
export class MapHeatDirective {
    constructor(private el: ElementRef, private exMap_: ExMapService) {
        this.nativeEl = this.el.nativeElement;
    }
    heatMap = new LeafletHeatLayer({ ifTip: false })
    nativeEl: HTMLElement
    @Input() map: L.Map;
    ngOnChanges(changes: SimpleChanges): void {
        if (UtilChangesValue(changes, 'map')) {
            this.heatMap.addTo(this.map);
            this.initHeat();
        }
    }
    ngOnInit(): void {}
    
    initHeat(){
        let bounds = this.map.getBounds(), north = bounds.getNorthEast(), south = bounds.getSouthWest();
        let data = {
            lat: north.lat,
            lat1: south.lat,
            lng: north.lng,
            lng1: south.lng,
        }
        this.exMap_.getShips(data).subscribe(res => {
            console.log(res)
        })
        this.map.on('zoomend', () => {
            this.getShipByBounds();
        });
    }

    getShipByBounds() {
        let bounds = this.map.getBounds(), north = bounds.getNorthEast(), south = bounds.getSouthWest();
        let data = {
            lat: north.lat,
            lat1: south.lat,
            lng: north.lng,
            lng1: south.lng,
        }
        this.exMap_.getShips(data).subscribe(res => {
            console.log(res)
            if (res.rlt == 0) {
                let datas = res.datas;
                let data = datas.map(e => { return [e.c, e.b] });
                this.heatMap.setLatLngs(data);
            }
        })
    }
}