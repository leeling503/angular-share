import * as L from "leaflet";

export class LeafletShipMap extends L.Layer {
    options: {
        pane
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
    /**多条船舶数据集合 */
    private _datas: MarkInfo[][] = [];
    /***/
    private _marks: MarkInfo[] = [];
    _map: L.Map;//由主项目传入, 进行复杂的联动
    cursorData: MarkInfo;//指针点击所对应的点
    private _imgCache: { [key: string]: HTMLImageElement } = {};//image对象的图片的Promise请求的缓存
    intervalPart: [];//动画点绘制区域
    _arcSize = 0;
    _alpha = 1;
    _lineWidth = 1;
    _arcClick: (e, data) => any;
    private _canvas: HTMLCanvasElement;
    private _ctx: CanvasRenderingContext2D;

    initialize(options) {
        L.setOptions(this, options);
        this._arcSize = this.options.arcSize;
        this._alpha = this.options.alpha;
        this._arcClick = this.options.arcClick;
    }

    onAdd(map: L.Map) {
        this._map = map;
        if (!this._canvas) {
            this._initCanvas();
        }
        if (this.options.pane) this.getPane().appendChild(this._canvas);
        map.on('viewreset', this._reset, this);
        map.on('move', this._reset, this);
        map.on("mousemove", this._mousemove, this)
        map.on('moveend', this._reset, this);
        map.on("click", this._clickmap, this)
        if (map.options.zoomAnimation && L.Browser.any3d) {
            map.on('zoomanim', this._animateZoom, this);
        }
        this._reset();
        return this
    }

    onRemove(map) {
        L.DomUtil.remove(this._canvas);
        map.off('viewreset', this._reset, this);
        map.off('move', this._reset, this);
        map.on("mousemove", this._mousemove, this)
        map.off('moveend', this._reset, this);
        if (map.options.zoomAnimation) {
            map.off('zoomanim', this._animateZoom, this);
        }
        return this
    }

    /**清除画布并重绘 */
    private _reset() {
        var topLeft = this._map.containerPointToLayerPoint([0, 0]);
        L.DomUtil.setPosition(this._canvas, topLeft);
        var size = this._map.getSize();
        this._canvas.width = size.x;
        this._canvas.height = size.y;
        this._resetDraw();
    }

    /**获取指定时间各轨迹点的位置信息集合 */
    getInfosByTime(time): MarkInfo[] {
        time = new Date(time);
        let len = this._datas.length, curTimeDatas = [];
        for (let i = 0; i < len; i++) {
            let data = this._datas[i];
            let info = this._getInfoByTime(time, data);
            curTimeDatas.push(info);
        }
        return curTimeDatas
    }

    animation() {

    }

    setMarks(marks: MarkInfo[]) {
        this._marks = marks;
        this._resetDraw()
    }

    /**添加单个标志数据*/
    addMark(data: MarkInfo) {
        this._marks.push(data);
        this._drawMark(data);
    }

    /**绘制所有标志 */
    private _drawMarks() {
        this._marks.forEach(e => {
            this._drawMark(e);
        })
    }

    /**单个标志绘制 */
    private _drawMark(mark: MarkInfo) {
        let ctx = this._ctx;
        let latlng: [number, number] = mark.latlng || [mark.lat, mark.lng], size = mark.size, imgUrl = mark.imgUrl, rotate = mark.rotate || 0;
        let ll = this._transformlatLngToContainerPoint(latlng), x = size[0] || size, y = size[1] || size;
        if (size < 10) { imgUrl = this.options.minIcon; }
        this._getImgPromise(imgUrl)
            .then((img: HTMLImageElement) => {
                rotate = rotate / 180 * Math.PI;
                ctx.translate(ll.x, ll.y);
                ctx.rotate(rotate);
                ctx.drawImage(img, -x / 2, -y / 2, x, y);
                ctx.rotate(-rotate);
                ctx.translate(-ll.x, -ll.y);
            })
    }

    //鼠标移动事件
    private _mousemove(e) {
        let containerPoint = e.containerPoint,
            x = containerPoint.x,
            y = containerPoint.y,
            datas = this._datas,
            size = this._arcSize + 2;
        let shipInfos = datas.flat();
        for (let i = shipInfos.length - 1; i >= 0; i--) {
            let ship = shipInfos[i], xmin = Math.floor(ship.latPoint), ymin = Math.floor(ship.lngPoint);
            if (xmin - size <= x && x <= xmin + size && ymin - size <= y && y <= ymin + size) {
                $("body #map canvas").css('cursor', 'pointer');
                this.cursorData = ship;
                return
            } else {
                this.cursorData = undefined
                $("body #map canvas").css('cursor', '');
            }
        }
    }

    //点击事件
    _clickmap(event) {
        if (this.cursorData === undefined || this._map === undefined) {
            return;
        }
        this._arcClick(event, this.cursorData);
    }

    /**初始化画布 */
    private _initCanvas() {
        this._canvas = L.DomUtil.create('canvas', 'leaflet-ship-map leaflet-layer');
        var originProp = "" + L.DomUtil.testProp(['transformOrigin', 'WebkitTransformOrigin', 'msTransformOrigin']);
        this._canvas.style[originProp] = '50% 50%';
        var size = this._map.getSize();
        this._canvas.width = size.x;
        this._canvas.height = size.y;
        this._ctx = this._canvas.getContext('2d');
        var animated = this._map.options.zoomAnimation && L.Browser.any3d;
        L.DomUtil.addClass(this._canvas, 'leaflet-zoom-' + (animated ? 'animated' : 'hide'));
        L.extend(this._canvas, {
            onselectstart: L.Util.falseFn,
            onmousemove: L.Util.falseFn,
            onload: L.bind(this._onCanvasLoad, this)
        });
    }

    private _onCanvasLoad() {
        this.fire('load');
    }

    /**清空画布重新绘制 */
    private _resetDraw() {
        this._clearContext();
        this._drawTracks();
        this._drawMarks();
    }

    /**是否成功清除画布 */
    private _clearContext() {
        let map = this._map;
        if (L.Browser.canvas && map) {
            let ctx = this._ctx, ww = this._canvas.width, hh = this._canvas.height;
            ctx.clearRect(0, 0, ww, hh);
            return true
        }
        return false
    }

    /**获得指定时间的位置信息 */
    private _getInfoByTime(time: Date, datas: MarkInfo[]): MarkInfo {
        let len = datas.length, sData: MarkInfo, eData: MarkInfo;
        if (time <= new Date(datas[0].reportTime)) {
            sData = datas[0], eData = datas[1] || sData;
        } else if (time >= new Date(datas[len - 1].reportTime)) {
            eData = datas[len - 1], sData = datas[len - 2] || eData;
        } else {
            for (let i = 0; i < len; i++) {
                sData = datas[i], eData = datas[i + 1];
                let s = new Date(sData.reportTime), e = new Date(eData.reportTime);
                if (s <= time && e >= time) {
                    break;
                }
            }
        }
        return this._computeDate(sData, eData, time)
    }

    /**计算位置信息 */
    private _computeDate(sData: MarkInfo, eData: MarkInfo, time: Date): MarkInfo {
        if (sData == eData) { return sData };
        let angleY = Math.atan((eData.lngPoint - sData.lngPoint) / (eData.latPoint - sData.latPoint));
        angleY = eData.latPoint < sData.latPoint ? angleY + Math.PI : angleY;
        /**计算指定时间的经纬度 */
        let s = new Date(sData.reportTime).getTime(), e = new Date(eData.reportTime).getTime(), cur = time.getTime();
        let percentage = (cur - s) / (e - s);
        percentage = percentage > 1 ? 1 : percentage < 0 ? 0 : percentage;
        let lat = sData.lat + (eData.lat - sData.lat) * percentage, lng = sData.lng + (eData.lng - sData.lng) * percentage;
        let reportTime = this._formatTime(time);
        let id = sData.id;
        return { id, lat, lng, reportTime, rotate: angleY }
    }

    /**绘制轨迹数据 */
    private _drawTracks() {
        let datas = this._datas;
        for (let i = 0, len = datas.length; i < len; i++) {
            let track = datas[i];
            let colorsLen = this._colors.length;
            let color = this._colors[i % colorsLen] || this._colors[0];
            let red = color.red, green = color.green, blue = color.blue, alpha = this._alpha;
            let colorStr = 'rgba(' + red + ',' + green + ',' + blue + ',' + alpha + ')';
            this._drawHistoryTrack(track, colorStr);
        }
    }

    /**单条轨迹绘制 */
    private _drawHistoryTrack(datas, color) {
        let cxt = this._ctx, point = undefined, perX, perY;
        cxt.lineWidth = 2, cxt.strokeStyle = color;
        for (let i = 0, len = datas.length; i < len; i++) {
            let data = datas[i];
            data.lat = data.lat || data.latitude;
            data.lng = data.lng || data.longitude;
            let latLng: [number, number] = [data.lat, data.lng];
            if (!latLng[0] || !latLng[1]) {
                continue;
            }
            point = this._transformlatLngToContainerPoint(latLng);
            let x = point.x, y = point.y;
            data.latPoint = x;
            data.lngPoint = y;
            this._drawArc(x, y);
            if (perX !== undefined) {
                this._drawLine(perX, perY, x, y);
            }
            perX = x, perY = y;
        }
    }

    private _drawArc(x, y) {
        let zoom = this._map.getZoom();
        if (zoom <= 12) {
            return;
        }
        let size = this._arcSize;
        size = zoom > 14 ? size : 2;
        let cxt = this._ctx;
        cxt.beginPath();
        cxt.arc(x, y, size, 0, Math.PI * 2, true);
        cxt.stroke();
    }

    private _drawLine(perX, perY, curX, curY) {
        let cxt = this._ctx;
        cxt.beginPath();
        cxt.moveTo(perX, perY);
        cxt.lineTo(curX, curY);
        cxt.stroke();
    }

    /**根据图片路径地址，获取图片后缓存 , 避免重复请求*/
    private _getImgPromise(imgUrl): Promise<any> {
        let img = this._imgCache[imgUrl];
        if (!img) {
            return new Promise((resolve, reject) => {
                let img = new Image();
                img.onload = () => {
                    this._imgCache[imgUrl] = img;
                    resolve(img)
                };
                img.src = `${imgUrl}`
            })
        }
        return Promise.resolve(img)
    }

    /**得到坐标系点位 */
    private _transformlatLngToContainerPoint(latlngs: [number, number]): L.Point {
        let p = this._map.latLngToContainerPoint(latlngs);
        return p
    }

    /**格式化时间 */
    private _formatTime(timeNum): string {
        let date = new Date(timeNum), hour = date.getHours(), minu = date.getMinutes();
        let h = hour > 9 ? hour : '0' + hour, m = minu > 9 ? minu : '0' + minu;
        let time = h + ':' + m;
        return time;
    }

    /**动画效果 */
    private _animateZoom(e) {
        let map: any = this._map;
        var scale = map.getZoomScale(e.zoom),
            offset = map._getCenterOffset(e.center)._multiplyBy(-scale).subtract(map._getMapPanePos());
        L.DomUtil.setTransform(this._canvas, offset, scale);
    }
}

/**标志信息 */
interface MarkInfo {
    id?: string;
    lat?: number;
    lng?: number;
    latlng?: [number, number];
    rotate: number;
    /**经纬度对应的像素点 */
    latPoint?: number;
    lngPoint?: number;
    /**标志大小 */
    size?: [number, number] | number;
    /**标志图标 */
    imgUrl?: string;
    /**标志类型 */
    type?: string;
    /**信息播发时间 */
    reportTime?: string;
}