import { Component, EventEmitter, Input, Output, SimpleChanges } from "@angular/core";
import * as L from "leaflet";
import { LeafletCanvasMap } from "share-libs/assets/leaflet/leaflet-canvas-map";
import { LeafletTrackMap, InfoPoint } from "share-libs/assets/leaflet/leaflet-track-map";
import { LeafletNetMap, NetMap } from "share-libs/assets/leaflet/leaflet-net-map";
import { ShareMapBase } from "./share-map-base.service";
@Component({
    selector: 'share-map-base,map-base',
    templateUrl: './map-base.component.html',
    styleUrls: ['./map-base.component.less']
})
export class MapComponent {
    constructor(private map_: ShareMapBase) { }
    /**输入地图名称 */
    @Input() mapName: NetMap = NetMap.tianDiTuNormalMap;
    @Input() map: L.Map;
    @Output() mapChange: EventEmitter<any> = new EventEmitter();
    ngOnChanges(changes: SimpleChanges): void { };
    ngOnInit(): void { }
    onMapInit(map: L.Map) {
        this.map = map;
        let leafletCanvas = new LeafletCanvasMap().addTo(map);
        leafletCanvas.addLatlngRect({ latlngs: [[35, 115], [37, 115], [37, 118], [35, 118]], colorFill: "rgba(255,0,0)", fillAlpha: 0.1 })
        leafletCanvas.addLatlngRect({ latlngs: [[35.5, 116], [36, 116], [36, 117], [35.5, 117]], colorFill: "rgba(0,255,0)", fillAlpha: 0.1, globalCompositeOperation: 'xor' })
        leafletCanvas.addLatlngRect({ latlngs: [[35.1, 116], [35.3, 116], [35.3, 119], [35.1, 119]], colorFill: "rgba(0,0,255)", fillAlpha: 1, globalCompositeOperation: 'xor' })
        // let velo = new LeafletVelocity({ nameClass: 'leaflet-velocity' }).addTo(map);
    }
    ngAfterViewInit(): void {
        this.mapChange.emit(this.map);
    }
}