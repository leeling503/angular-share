import { Component, EventEmitter, Input, Output, SimpleChanges } from "@angular/core";
import * as L from "leaflet";
import { LeafletCanvasMap } from "share-libs/assets/leaflet/leaflet-canvas-map";
import { LeafletTrackMap, PointInfo } from "share-libs/assets/leaflet/leaflet-track-map";
import { LeafletNetMap, NetMap } from "share-libs/assets/leaflet/leaflet-net-map";
import { ShareMapBase } from "./share-map-base.service";
import { LeafletVelocity } from "share-libs/assets/leaflet/leaflet-velocity-map";

@Component({
    selector: 'share-map-base,map-base',
    templateUrl: './map-base.component.html',
    styleUrls: ['./map-base.component.less']
})
export class MapComponent {
    constructor(private map_: ShareMapBase) { }
    @Input() mapName: NetMap = NetMap.tianDiTuNormalMap;
    @Input() map: L.Map;
    @Output() mapChange: EventEmitter<any> = new EventEmitter();
    ngOnChanges(changes: SimpleChanges): void { };
    ngOnInit(): void { }
    onMapInit(map: L.Map) {
        this.map = map;
        let leafletCanvas = new LeafletCanvasMap().addTo(map);
        leafletCanvas.addTo(map);
        let pointStr = leafletCanvas.addLatlngRect({ latlngs: [[37, 118], [36.975, 118.05], [37, 118.1], [36.9, 118.2], [36.8, 118.1], [36.8, 118], [36.9, 118.1]] });
        leafletCanvas.getExpend([[37, 118], [36.9, 118.05], [37, 118.1], [36.9, 118.2], [36.8, 118.1], [36.8, 118], [36.9, 118.1]])
        let id = leafletCanvas.addLatlngLine({ latlngs: [[37, 118], [37, 118.1], [36.9, 118.2], [36.8, 118.1], [36.8, 118], [36.9, 118.1]], lineWidth: 5, colorLine: 'red' });
        let dist = leafletCanvas.getLatDiffByPoints(1000)
        setTimeout(() => { leafletCanvas.removeById(id) }, 10000);
        let velo = new LeafletVelocity({ nameClass: 'leaflet-velocity' }).addTo(map);
    }
    ngAfterViewInit(): void {
        this.mapChange.emit(this.map);
    }
}