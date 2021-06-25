import { Component, Input, SimpleChanges } from "@angular/core";
import * as L from "leaflet";
import { MAPNAME, MapName } from "./model";

@Component({
    selector: 'share-map',
    templateUrl: './share-map.component.html',
    styleUrls: ['./share-map.component.less']
})
export class ShareMapComponent {
    @Input() mapUrl: string = "";
    map: L.Map;
    mapName: MapName = MAPNAME.gaoDeNormalMap;
    ngOnChanges(changes: SimpleChanges): void {
    };

    ngOnInit(): void {
        let map = L.map('share-map', {
            dragging: true,
            zoomControl: false,
            minZoom: 1,
            maxZoom: 18,
            attributionControl: false,
            doubleClickZoom: false,
            closePopupOnClick: false,//点击地图不关闭弹出层
        }).setView([38.712216, 117.22655], 12);
        this.map = map;
    };


}