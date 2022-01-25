import { Directive, ElementRef, EventEmitter, Input, Output, SimpleChanges } from "@angular/core";
import * as L from "leaflet";
import { AISDATA } from "share-libs/assets/leaflet/data";
import { LeafletNetMap, NetMap } from "share-libs/assets/leaflet/leaflet-net-map";
import { LeafletTrackMap, InfoPoint } from "share-libs/assets/leaflet/leaflet-track-map";
import { UtilChanges, UtilChangesValue } from "share-libs/src/utils";

/**该指令示例为绘制轨迹图 */
@Directive({
    selector: '[share-map-track],[map-track]'
})
export class MapTrackDirective {
    constructor(private el: ElementRef) {
        this.nativeEl = this.el.nativeElement;
    }
    nativeEl: HTMLElement
    track: LeafletTrackMap = new LeafletTrackMap({ pane: 'wqj', className: 'track' });
    @Input() map: L.Map;
    @Input() inMapName: NetMap;
    ngOnChanges(changes: SimpleChanges): void {
        if (UtilChangesValue(changes, 'map')) {
            this.track.addTo(this.map)
        }
        if (UtilChangesValue(changes, 'inMapName')) {
        }
    }
    ngOnInit(): void {
        let trackList = AISDATA.datas[0];
        let latlngs: InfoPoint[] = trackList.map(e => { return { lat: e.latitude, lng: e.longitude, time: e.reportTime } })
        let ship = this.track;
        ship.addMark({ latlng: [39.183506, 121.24813], url: 'assets/images/icon/com_close_bg_red.png', size: 20, rotate: 20 })
        setTimeout(() => {
            ship.addMark({ latlng: [37.978207, 120.02989], url: 'assets/images/icon/com_close_bg_red.png', size: 20, rotate: 20 })
        }, 2000);
        ship.setTracks([{ infos: latlngs }]);
        let data = ship.getInfosByTime('2022-01-23 05:23');
        console.log(data);
        this.track.onClick(e => {
            console.log(e);
        })
    }
}