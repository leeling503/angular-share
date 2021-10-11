import { Directive, ElementRef, EventEmitter, Input, Output, SimpleChanges } from "@angular/core";
import * as L from "leaflet";
import { LeafletNetMap, NetMap } from "share-libs/assets/leaflet/leaflet-net-map";
import { LeafletTrackMap, PointInfo } from "share-libs/assets/leaflet/leaflet-track-map";
import { UtilChanges, UtilChangesValue } from "share-libs/src/utils";

@Directive({
    selector: '[share-map-track],[map-track]'
})
export class MapTrackDirective {
    constructor(private el: ElementRef) {
        this.nativeEl = this.el.nativeElement;
    }
    nativeEl: HTMLElement
    track: LeafletTrackMap = new LeafletTrackMap();
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
        let trackList = [{ "SPEED": 8.9, "DATE": "2021-07-30 16:30:58", "HEADING": 315, "CODE": "0", "MMSI": "412204970", "LNG": 120.02989, "TURN": -127, "LAT": 37.978207, "COURSE": 214.1, "ACCURACY": "0" }, { "SPEED": 8.7, "DATE": "2021-07-30 16:01:59", "HEADING": 315, "CODE": "0", "MMSI": "412204970", "LNG": 120.07711, "TURN": -127, "LAT": 38.037468, "COURSE": 213.2, "ACCURACY": "0" }, { "SPEED": 8.1, "DATE": "2021-07-30 15:34:04", "HEADING": 315, "CODE": "0", "MMSI": "412204970", "LNG": 120.1224, "TURN": -127, "LAT": 38.096092, "COURSE": 212.2, "ACCURACY": "0" }, { "SPEED": 8.3, "DATE": "2021-07-30 15:04:43", "HEADING": 315, "CODE": "0", "MMSI": "412204970", "LNG": 120.169586, "TURN": -127, "LAT": 38.158333, "COURSE": 209.9, "ACCURACY": "0" }, { "SPEED": 8.2, "DATE": "2021-07-30 14:41:16", "HEADING": 315, "CODE": "0", "MMSI": "412204970", "LNG": 120.207855, "TURN": -127, "LAT": 38.208126, "COURSE": 205.9, "ACCURACY": "0" }, { "SPEED": 9.3, "DATE": "2021-07-30 14:19:26", "HEADING": 315, "CODE": "0", "MMSI": "412204970", "LNG": 120.2429, "TURN": -127, "LAT": 38.253357, "COURSE": 217.3, "ACCURACY": "0" }, { "SPEED": 8.9, "DATE": "2021-07-30 13:58:56", "HEADING": 315, "CODE": "0", "MMSI": "412204970", "LNG": 120.27479, "TURN": -127, "LAT": 38.29793, "COURSE": 222.6, "ACCURACY": "0" }, { "SPEED": 10.1, "DATE": "2021-07-30 13:39:00", "HEADING": 315, "CODE": "0", "MMSI": "412204970", "LNG": 120.30623, "TURN": -127, "LAT": 38.34162, "COURSE": 216.5, "ACCURACY": "0" }, { "SPEED": 9.4, "DATE": "2021-07-30 13:19:31", "HEADING": 315, "CODE": "0", "MMSI": "412204970", "LNG": 120.34268, "TURN": -127, "LAT": 38.38362, "COURSE": 214.6, "ACCURACY": "0" }, { "SPEED": 9.5, "DATE": "2021-07-30 12:58:36", "HEADING": 315, "CODE": "0", "MMSI": "412204970", "LNG": 120.378784, "TURN": -127, "LAT": 38.42874, "COURSE": 205.2, "ACCURACY": "0" }, { "SPEED": 9.1, "DATE": "2021-07-30 12:37:45", "HEADING": 315, "CODE": "0", "MMSI": "412204970", "LNG": 120.41204, "TURN": -127, "LAT": 38.474575, "COURSE": 210.3, "ACCURACY": "0" }, { "SPEED": 8.6, "DATE": "2021-07-30 12:17:38", "HEADING": 315, "CODE": "0", "MMSI": "412204970", "LNG": 120.44366, "TURN": -127, "LAT": 38.516335, "COURSE": 215.1, "ACCURACY": "0" }, { "SPEED": 7.8, "DATE": "2021-07-30 11:54:39", "HEADING": 315, "CODE": "0", "MMSI": "412204970", "LNG": 120.48031, "TURN": -127, "LAT": 38.563114, "COURSE": 213.5, "ACCURACY": "0" }, { "SPEED": 9.0, "DATE": "2021-07-30 11:32:42", "HEADING": 315, "CODE": "0", "MMSI": "412204970", "LNG": 120.515945, "TURN": -127, "LAT": 38.60648, "COURSE": 217.0, "ACCURACY": "0" }, { "SPEED": 8.4, "DATE": "2021-07-30 11:06:58", "HEADING": 315, "CODE": "0", "MMSI": "412204970", "LNG": 120.55577, "TURN": -127, "LAT": 38.65612, "COURSE": 219.8, "ACCURACY": "0" }, { "SPEED": 9.5, "DATE": "2021-07-30 10:41:21", "HEADING": 315, "CODE": "0", "MMSI": "412204970", "LNG": 120.59448, "TURN": -127, "LAT": 38.709385, "COURSE": 204.4, "ACCURACY": "0" }, { "SPEED": 8.4, "DATE": "2021-07-30 10:11:07", "HEADING": 315, "CODE": "0", "MMSI": "412204970", "LNG": 120.63982, "TURN": -127, "LAT": 38.769882, "COURSE": 216.2, "ACCURACY": "0" }, { "SPEED": 7.6, "DATE": "2021-07-30 09:47:14", "HEADING": 315, "CODE": "0", "MMSI": "412204970", "LNG": 120.6787, "TURN": -127, "LAT": 38.81684, "COURSE": 217.2, "ACCURACY": "0" }, { "SPEED": 7.7, "DATE": "2021-07-30 09:24:33", "HEADING": 315, "CODE": "0", "MMSI": "412204970", "LNG": 120.71492, "TURN": -127, "LAT": 38.861465, "COURSE": 214.0, "ACCURACY": "0" }, { "SPEED": 7.7, "DATE": "2021-07-30 09:03:30", "HEADING": 315, "CODE": "0", "MMSI": "412204970", "LNG": 120.74644, "TURN": -127, "LAT": 38.902287, "COURSE": 210.9, "ACCURACY": "0" }, { "SPEED": 8.2, "DATE": "2021-07-30 08:41:28", "HEADING": 315, "CODE": "0", "MMSI": "412204970", "LNG": 120.78184, "TURN": -127, "LAT": 38.944008, "COURSE": 219.3, "ACCURACY": "0" }, { "SPEED": 8.6, "DATE": "2021-07-30 08:16:41", "HEADING": 315, "CODE": "0", "MMSI": "412204970", "LNG": 120.82764, "TURN": -127, "LAT": 38.98852, "COURSE": 214.9, "ACCURACY": "0" }, { "SPEED": 8.1, "DATE": "2021-07-30 07:47:33", "HEADING": 315, "CODE": "0", "MMSI": "412204970", "LNG": 120.88827, "TURN": -127, "LAT": 39.036606, "COURSE": 231.9, "ACCURACY": "0" }, { "SPEED": 7.9, "DATE": "2021-07-30 07:21:34", "HEADING": 315, "CODE": "0", "MMSI": "412204970", "LNG": 120.948975, "TURN": -127, "LAT": 39.07226, "COURSE": 232.0, "ACCURACY": "0" }, { "SPEED": 7.5, "DATE": "2021-07-30 07:00:37", "HEADING": 315, "CODE": "0", "MMSI": "412204970", "LNG": 121.00394, "TURN": -127, "LAT": 39.090588, "COURSE": 256.4, "ACCURACY": "0" }, { "SPEED": 7.9, "DATE": "2021-07-30 06:35:28", "HEADING": 315, "CODE": "0", "MMSI": "412204970", "LNG": 121.06777, "TURN": -127, "LAT": 39.11425, "COURSE": 241.0, "ACCURACY": "0" }, { "SPEED": 7.1, "DATE": "2021-07-30 06:07:44", "HEADING": 315, "CODE": "0", "MMSI": "412204970", "LNG": 121.13563, "TURN": -127, "LAT": 39.141735, "COURSE": 247.5, "ACCURACY": "0" }, { "SPEED": 7.6, "DATE": "2021-07-30 05:40:59", "HEADING": 315, "CODE": "0", "MMSI": "412204970", "LNG": 121.20081, "TURN": -127, "LAT": 39.165276, "COURSE": 243.8, "ACCURACY": "0" }, { "SPEED": 0.0, "DATE": "2021-07-30 05:15:44", "HEADING": 315, "CODE": "0", "MMSI": "412204970", "LNG": 121.24813, "TURN": -127, "LAT": 39.183506, "COURSE": 150.3, "ACCURACY": "0" }, { "SPEED": 0.0, "DATE": "2021-07-29 23:51:36", "HEADING": 315, "CODE": "1", "MMSI": "412204970", "LNG": 121.247986, "TURN": -127, "LAT": 39.181812, "COURSE": 150.3, "ACCURACY": "0" }];
        let latlngs: PointInfo[] = trackList.map(e => { return { lat: e.LAT, lng: e.LNG, time: e.DATE } })
        let ship = this.track;
        ship.addMark({ latlng: [39.183506, 121.24813], url: 'assets/images/icon/com_close_bg_red.png', size: 20, rotate: 20 })
        setTimeout(() => {
            ship.addMark({ latlng: [37.978207, 120.02989], url: 'assets/images/icon/com_close_bg_red.png', size: 20, rotate: 20 })
        }, 2000);
        ship.setTracks([{ infos: latlngs }]);
        let data = ship.getInfosByTime('2021-07-30 06:32:18');
        this.track.subscribeOnClick(e => {
            console.log(e);
        })
    }
}