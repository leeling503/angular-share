import { Component, EventEmitter, Input, Output, SimpleChanges } from "@angular/core";
import * as L from "leaflet";
import { LeafletCanvasMap } from "share-libs/assets/leaflet/leaflet-canvas";
import { LeafletNetMap, NetMap } from "share-libs/assets/leaflet/leaflet-net-map";
import { LeafletShipMap } from "share-libs/assets/leaflet/leaflet-ship-map";
import { ShareMapBase } from "./share-map-base.service";

@Component({
    selector: 'share-map-base,share-map',
    templateUrl: './share-map-base.component.html',
    styleUrls: ['./share-map-base.component.less']
})
export class ShareMapComponent {
    constructor(private map_: ShareMapBase) { }
    @Input() mapName: NetMap = NetMap.gaoDeNormalMap;
    @Input() map: L.Map;
    @Output() mapChange: EventEmitter<any> = new EventEmitter();
    leafletNetMap: LeafletNetMap;
    ngOnChanges(changes: SimpleChanges): void { };
    ngOnInit(): void {
        let map = L.map('share-map-base', {
            dragging: true,
            zoomControl: false,
            minZoom: 1,
            maxZoom: 26,
            attributionControl: false,
            doubleClickZoom: false,
            closePopupOnClick: false,//点击地图不关闭弹出层
        }).setView([37, 118], 12);
        this.map = map;
        this.leafletNetMap = new LeafletNetMap(NetMap.gaoDeNormalMap).addTo(map);
        let leafletCanvas = new LeafletCanvasMap().addTo(map);
        let pointStr = leafletCanvas.addLatlngRect({ data: [[37, 118], [37, 118.1], [36.9, 118.2], [36.8, 118.1], [36.8, 118], [36.9, 118.1]] });
        // let id = leafletCanvas.addLatlngLine({ data: [[37, 118], [37, 118.1], [36.9, 118.2], [36.8, 118.1], [36.8, 118], [36.9, 118.1]], width: 5, color: 'red' });
        let dist = leafletCanvas.getLatDiffByPoints(2000)
        this.map_.getPoint({ dist, pointStr }).subscribe(res => {
            let datas = res.datas.map(e => [e.x, e.y]);
            leafletCanvas.addLatlngRect({ data: datas, fillColor: 'red', color: 'yellow', fillAlpha: 0.2 });
            console.log(res)
        });
        setTimeout(() => {
            // leafletCanvas.removeById(id)
        }, 10000);
        // setTimeout(() => {
        //     this.leafletNetMap.changeMap(NetMap.geoqNormalMap);
        // }, 5000);
        let ship = new LeafletShipMap().addTo(map);
        ship.addMark({ lat: 37, lng: 118, imgUrl: 'assets/images/icon/com_close_bg_red.png', size: 20, rotate: 20 })
        ship.addMark({ latlng: [37, 118.01], imgUrl: 'assets/images/icon/com_close_bg_red.png', size: 20, rotate: 30 })
        ship.addMark({ latlng: [37, 118.02], imgUrl: 'assets/images/icon/com_close_bg_red.png', size: 20, rotate: 10 })
    };

    ngAfterViewInit(): void {
        this.mapChange.emit(this.map);
    }
}