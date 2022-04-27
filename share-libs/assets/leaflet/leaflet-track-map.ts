import * as L from "leaflet";
import { CanvasLayer, ParaCanvas } from "./leaflet-canvas-layer";
import { InfoArc, CanvasUtil, InfoImage, InfoLine } from "./leaflet-canvas-util";
import * as $ from "jquery";
const NUMSTR = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09']
/**在地图上绘制轨迹
 * 绘制标志
 * 
 */
export class LeafletTrackMap extends CanvasLayer {
    constructor(options?: ParaCanvasTrack) {
        super(options);
        this.initOptions(options);
    }
    options: ParaCanvasTrack = new ParaCanvasTrack();
    private _marks: InfoImage[] = [];
    /**多条轨迹数据 */
    private _allTracks: InfoTrack[] = [];
    /**指针点击所对应的点*/
    private cursorData: InfoPoint[];

    /**获取指定时间各轨迹点的位置信息集合 */
    getInfosByTime(timeStr: string): InfoPoint[] {
        let time = new Date(timeStr);
        let len = this._allTracks.length, curTimeDatas = [];
        for (let i = 0; i < len; i++) {
            let data = this._allTracks[i];
            let info = this._getInfoByTime(time, data);
            curTimeDatas.push(info);
        }
        return curTimeDatas
    }

    setMarks(marks: InfoImage[]) {
        this._marks = marks;
        this._redraw()
    }

    /**设置多条轨迹数据 */
    setTracks(tracks: InfoTrack[]) {
        this._allTracks = tracks.map(e => {
            e.latlngs = e.infos.map(e => [e.lat, e.lng]);
            return e;
        });
        this._redraw();
    }

    /**添加单个标志数据*/
    addMark(data: InfoImage) {
        this._marks.push(data);
        this._map && this._drawMark(data);
    }

    /**绘制所有标志 */
    private _drawMarks() {
        this._marks.forEach(e => {
            this._drawMark(e);
        })
    }

    /**单个标志绘制 */
    private _drawMark(mark: InfoImage) {
        let ctx = this._ctx;
        let latlng = mark.latlng;
        mark.point = CanvasUtil.transformLatLngToPoint(this._map, latlng);
        CanvasUtil.drawImg(ctx, mark);
    }

    /**鼠标移动事件*/
    protected onMouseMove(e: L.LeafletMouseEvent) {
        let containerPoint = e.containerPoint,
            x = containerPoint.x,
            y = containerPoint.y;
        let tracks = this._allTracks;
        let options = this.options;
        let size = options.sizeArc + 2;
        let flag = false;
        this.cursorData = [];
        for (let i = tracks.length - 1; i >= 0; i--) {
            let infos = tracks[i].infos;
            for (let j = 0, len = infos.length; j < len; j++) {
                let info = infos[j], xmin = Math.floor(info.latPoint), ymin = Math.floor(info.lngPoint);
                if (xmin - size <= x && x <= xmin + size && ymin - size <= y && y <= ymin + size) {
                    $(this._canvas).css('cursor', 'pointer');
                    $(this._canvas).css('z-index', '10000');
                    this.cursorData.push(info);
                    flag = true;
                } else if (!flag) {
                    this.cursorData = [];
                    $(this._canvas).css('cursor', 'grab');
                    $(this._canvas).css('z-index', this.options.zIndex);
                }
            }
        }
    }

    //点击事件
    protected onMouseClick(e) {
        if (this.cursorData === undefined || this._map === undefined) {
            return;
        }
        this.cbClick({ e, datas: this.cursorData });
    }

    /**清空画布重新绘制 */
    protected _redraw() {
        if (this._map) {
            this._clearContext();
            this._drawTracks();
            this._drawMarks();
        }
    }

    /**绘制轨迹数据 */
    private _drawTracks() {
        let datas = this._allTracks;
        for (let i = 0, len = datas.length; i < len; i++) {
            let track = datas[i];
            this._drawHistoryTrack(track);
        }
    }

    /**单条轨迹绘制 */
    private _drawHistoryTrack(track: InfoTrack) {
        let ctx = this._ctx,
            zoom = this._map.getZoom();
        let options = this.options;
        let sizeArc = options.sizeArc;
        track.widthLine = options.widthLine;
        track.colorLine = track.colorLine || options.colorLine;
        track.points = track.infos.map(e => {
            let point = CanvasUtil.transformLatLngToPoint(this._map, [e.lat, e.lng]);
            e.latPoint = point[0], e.lngPoint = point[1];
            return point
        });
        CanvasUtil.drawLine(ctx, track);
        if (zoom > 8) {
            let arc: InfoArc = Object.assign({}, track);
            arc.colorFill = options.colorArcFill;
            arc.size = zoom > 14 ? sizeArc : 2;
            arc.colorLine = options.colorArc;
            CanvasUtil.drawArc(ctx, arc);
        }
    }

    /**获得指定时间的位置信息 */
    private _getInfoByTime(time: Date, track: InfoTrack): InfoPoint {
        let infos = track.infos,
            len = infos.length,
            sData: InfoPoint = infos[0],
            eData: InfoPoint = infos[len - 1];
        if (time <= new Date(sData.time)) {
            sData = sData, eData = infos[1] || sData;
        } else if (time >= new Date(eData.time)) {
            eData = eData, sData = infos[len - 2] || eData;
        } else {
            for (let i = 0; i < len; i++) {
                sData = infos[i], eData = infos[i + 1];
                let s = new Date(sData.time), e = new Date(eData.time);
                if (s <= time && e >= time) {
                    break;
                }
            }
        }
        return this._computeDate(sData, eData, time)
    }

    /**计算位置信息 */
    private _computeDate(sData: InfoPoint, eData: InfoPoint, time: Date): InfoPoint {
        if (sData == eData) { return sData };
        let angleY = Math.atan((eData.lngPoint - sData.lngPoint) / (eData.latPoint - sData.latPoint));
        angleY = eData.latPoint < sData.latPoint ? angleY + Math.PI : angleY;
        /**计算指定时间的经纬度 */
        let s = new Date(sData.time).getTime(), e = new Date(eData.time).getTime(), cur = time.getTime();
        let percentage = (cur - s) / (e - s);
        percentage = percentage > 1 ? 1 : percentage < 0 ? 0 : percentage;
        let lat = sData.lat + (eData.lat - sData.lat) * percentage, lng = sData.lng + (eData.lng - sData.lng) * percentage;
        let reportTime = this._formatTime(time);
        let id = sData.id;
        return { id, lat, lng, time: reportTime, rotate: angleY }
    }

    /**格式化时间 */
    private _formatTime(timeNum): string {
        let date = new Date(timeNum), hour = date.getHours(), minu = date.getMinutes();
        let h = NUMSTR[hour] || hour, m = NUMSTR[minu] || minu;
        let time = h + ':' + m;
        return time;
    }
}

/**轨迹类型 */
type TrackType = '';

export interface InfoTrack extends InfoLine {
    infos: InfoPoint[];
    type?: TrackType;
}

export interface InfoPoint extends InfoImage {
    /**点位信息 */
    lat: number;
    lng: number;
    /**经纬度对应的像素点 */
    latPoint?: number;
    lngPoint?: number;
    /**信息播发时间 */
    time?: string;
    /**点位类型 ship表示船 ， arc表示小圆点 */
    type?: TrackType;
}

/**
 * 轨迹绘制的配置
 */
export class ParaCanvasTrack implements ParaCanvas {
    pane?: string = 'sl-track';
    className?: string = 'sl-track';
    zIndex?: number = 100;
    minIcon?: string;
    /**圆点大小 */
    sizeArc?: number = 3;
    /**圆点颜色 ( rgb(),rgba(),#fff )*/
    colorArc?: string = "steelblue";
    /**圆点填充色*/
    colorArcFill?: string = "#CCFF99";
    alpha?: number;
    /**线条宽度 */
    widthLine?: number = 2;
    /**线条颜色 */
    colorLine?: string = "darkorange";
    arcClick?: (e: any) => (any | void);
}
