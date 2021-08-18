import * as L from "leaflet";
import { CanvasLayer } from "./leaflet-canvas-layer";
import { ArcInfo, CanvasUtil, ImageInfo, LineInfo } from "./leaflet-canvas-util";
import * as $ from "jquery"
/**绘制轨迹 */
export class LeafletTrackMap extends CanvasLayer {
    options: {
        pane,
        map: undefined,
        minIcon: string,
        arcSize: 3,//圆大小
        alpha: 0.5,//透明度
        lineWidth: 1,//线宽
        arcClick: (e) => {},
    };
    private _colors: { red: number, green: number, blue: number }[] = [
        { red: 0, green: 155, blue: 255 },
        { red: 85, green: 0, blue: 125 },
        { red: 255, green: 155, blue: 0 }
    ];
    private _marks: ImageInfo[] = [];
    /**多条轨迹数据 */
    private _allTracks: TrackInfo[] = [];
    private cursorData: PointInfo;//指针点击所对应的点
    intervalPart: [];//动画点绘制区域
    private _arcSize = 3;
    private _alpha = 0.5;
    _arcClick: (e, data) => any = (e, data) => { console.log(e, data) };

    initialize(options) {
        L.setOptions(this, options);
    }

    /**获取指定时间各轨迹点的位置信息集合 */
    getInfosByTime(timeStr: string): PointInfo[] {
        let time = new Date(timeStr);
        let len = this._allTracks.length, curTimeDatas = [];
        for (let i = 0; i < len; i++) {
            let data = this._allTracks[i];
            let info = this._getInfoByTime(time, data);
            curTimeDatas.push(info);
        }
        return curTimeDatas
    }

    setMarks(marks: ImageInfo[]) {
        this._marks = marks;
        this._redraw()
    }

    /**设置多条轨迹数据 */
    setTracks(tracks: TrackInfo[]) {
        this._allTracks = tracks.map(e => {
            e.latlngs = e.infos.map(e => [e.lat, e.lng]);
            return e;
        });
        this._redraw();
    }

    /**添加单个标志数据*/
    addMark(data: ImageInfo) {
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
    private _drawMark(mark: ImageInfo) {
        let ctx = this._ctx;
        let latlng = mark.latlng;
        mark.point = CanvasUtil.transformLatLngToPoint(this._map, latlng);
        CanvasUtil.drawImg(ctx, mark);
    }

    //鼠标移动事件
    protected _onMouseMove(e) {
        let containerPoint = e.containerPoint,
            x = containerPoint.x,
            y = containerPoint.y,
            tracks = this._allTracks,
            size = this._arcSize + 2;
        for (let i = tracks.length - 1; i >= 0; i--) {
            let infos = tracks[i].infos;
            for (let j = 0, len = infos.length; j < len; j++) {
                let info = infos[j], xmin = Math.floor(info.latPoint), ymin = Math.floor(info.lngPoint);
                if (xmin - size <= x && x <= xmin + size && ymin - size <= y && y <= ymin + size) {
                    $(this._canvas).css('cursor', 'pointer');
                    $(this._canvas).css('z-index', '10000');
                    this.cursorData = info;
                    console.log(info)
                    return
                } else {
                    this.cursorData = undefined
                    $(this._canvas).css('cursor', 'grab');
                    $(this._canvas).css('z-index', '10');
                }
            }
        }
    }

    //点击事件
    protected _onClickCanvas(e) {
        if (this.cursorData === undefined || this._map === undefined) {
            return;
        }
        this._arcClick(e, this.cursorData);
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
    private _drawHistoryTrack(track: TrackInfo) {
        let ctx = this._ctx,
            zoom = this._map.getZoom();
        track.lineWidth = 2;
        track.colorLine = track.colorLine || 'blue';
        track.points = track.infos.map(e => {
            let point = CanvasUtil.transformLatLngToPoint(this._map, [e.lat, e.lng]);
            e.latPoint = point[0], e.lngPoint = point[1];
            return point
        });
        CanvasUtil.drawLine(ctx, track);
        if (zoom > 8) {
            let arc: ArcInfo = track;
            arc.colorFill = 'white';
            arc.size = zoom > 14 ? this._arcSize : 2;
            CanvasUtil.drawArc(ctx, arc);
        }
    }

    /**获得指定时间的位置信息 */
    private _getInfoByTime(time: Date, track: TrackInfo): PointInfo {
        let infos = track.infos,
            len = infos.length,
            sData: PointInfo = infos[0],
            eData: PointInfo = infos[len - 1];
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
    private _computeDate(sData: PointInfo, eData: PointInfo, time: Date): PointInfo {
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
        let h = hour > 9 ? hour : '0' + hour, m = minu > 9 ? minu : '0' + minu;
        let time = h + ':' + m;
        return time;
    }
}
/**轨迹类型 */
type TrackType = '';
export interface PointInfo extends ImageInfo {
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

export interface TrackInfo extends LineInfo {
    infos: PointInfo[];
    type?: TrackType;
}