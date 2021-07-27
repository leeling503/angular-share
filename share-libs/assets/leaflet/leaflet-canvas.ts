
import * as L from "leaflet";
class LineItem {
    /**用于移除的id */
    id?: string;
    /**线条宽度 */
    width?: number;
    /**线条颜色 */
    color?: string;
    /**线条点位 */
    data: [number, number][];
    /**虚线样式 (线长，间隔距离)*/
    dash?: [number, number];
    /**虚线偏移距离 */
    dashOffset?: number;
    constructor(item: LineItem = { data: [] }) {
        this.width = item.width || 2;
        this.color = item.color || 'blue';
        this.data = item.data || [];
        this.dash = item.dash || [0, 0];
        this.dashOffset = item.dashOffset || 0;
        this.id = item.id || createUuid();
    }
}

class RectItem extends LineItem {
    /**填充区透明度 */
    fillAlpha?: number;
    /**填充区颜色 */
    fillColor?: string;
    clipData?: [number, number][];
    constructor(item: RectItem = { data: [] }) {
        super(item);
        this.fillAlpha = item.fillAlpha || 0.2;
        this.fillColor = item.fillColor || 'green';
    }
}

function createUuid() {
    let per = Math.random().toFixed(3).split('.')[1];
    let suf = Math.random().toFixed(3).split('.')[1];
    return per + suf
}

/**画线和闭合矩形 */
export class LeafletCanvasMap extends L.Layer {
    options
    private _canvas: HTMLCanvasElement;
    private _context: CanvasRenderingContext2D;
    /**所有的线的经纬度数据 */
    private _allLines: LineItem[] = [];
    /**所有的矩形经纬度数据 */
    private _allRects: RectItem[] = [];
    /**刚刚通过经纬度画完的矩形 */
    private _curLatLngs: [number, number][] = [];

    /**addTo时会自动调用 */
    onAdd(map) {
        this._map = map;
        if (!this._canvas) this._initCanvas();
        if (this.options.pane) this.getPane().appendChild(this._canvas);
        else map._panes.overlayPane.appendChild(this._canvas);
        map.on('moveend', this._reset, this);
        map.on('resize', this._reset, this);
        // map.on('click', this._executeListeners, this);
        // map.on('mousemove', this._executeListeners, this);
        if (map.options.zoomAnimation && L.Browser.any3d) {
            /**缩放动画 */
            map.on('zoomanim', this._animateZoom, this);
        }
        return this
    }

    /**移除时会自动调用 */
    onRemove(map: L.Map) {
        if (this.options.pane) {
            this.getPane().removeChild(this._canvas);
        } else {
            map.getPanes().overlayPane.removeChild(this._canvas);
        }
        map.off('moveend', this._reset, this);
        map.off('resize', this._reset, this);
        if (map.options.zoomAnimation) {
            map.off('zoomanim', this._animateZoom, this);
        }
        return this
    }

    /**初始化画布 */
    private _initCanvas() {
        this._canvas = L.DomUtil.create('canvas', 'leaflet-canvas-map leaflet-layer');
        var originProp = "" + L.DomUtil.testProp(['transformOrigin', 'WebkitTransformOrigin', 'msTransformOrigin']);
        this._canvas.style[originProp] = '50% 50%';
        var size = this._map.getSize();
        this._canvas.width = size.x;
        this._canvas.height = size.y;
        this._context = this._canvas.getContext('2d');
        var animated = this._map.options.zoomAnimation && L.Browser.any3d;
        L.DomUtil.addClass(this._canvas, 'leaflet-zoom-' + (animated ? 'animated' : 'hide'));
    }

    private _reset() {
        var topLeft = this._map.containerPointToLayerPoint([0, 0]);
        L.DomUtil.setPosition(this._canvas, topLeft);
        var size = this._map.getSize();
        this._canvas.width = size.x;
        this._canvas.height = size.y;
        this._redraw();
    }

    private _redraw() {
        this._clearContext();
        /**画闭合矩形 */
        this._allRects.forEach(rect => {
            let points = this._transformLatlngToPoint(rect.data);
            this._drawRectByPoint(points, rect);
        })
        this._allLines.forEach(line => {
            let points = this._transformLatlngToPoint(line.data);
            this._drawLineByPoint(points, line);
        })
    }

    /**是否成功清除 */
    private _clearContext(): boolean {
        let map = this._map;
        if (L.Browser.canvas && map) {
            let ctx = this._context, ww = this._canvas.width, hh = this._canvas.height;
            ctx.clearRect(0, 0, ww, hh); // 清空画布
            return true
        }
        return false
    }

    /**清空画布 */
    clearContext() {
        this._allLines = [];
        this._allRects = [];
        this._redraw();
    }

    /**清空矩形 */
    clearRect() {
        this._allRects = [];
        this._redraw();
    }

    /**清空线 */
    clearLines() {
        this._allLines = [];
        this._redraw();
    }

    /**设置所有的矩形数据 */
    setAllRect(rects: RectItem[]) {
        this._allRects = rects;
        this._redraw();
    }

    /**设置所有的线数据 */
    setAllLines(lines: LineItem[]) {
        this._allLines = lines;
        this._redraw();
    }

    /**根据经纬度生成矩形; 返回该经纬度的闭合字符串，方便调用扩展接口 */
    addLatlngRect(rect: RectItem): string {
        if (!rect.data || rect.data.length == 0) return '';
        rect = new RectItem(rect);
        this._curLatLngs = rect.data;
        this._allRects.push(rect);
        let points = this._transformLatlngToPoint(rect.data);
        // let clipData = this._transformLatlngToPoint(rect.clipData)
        this._drawRectByPoint(points, rect);
        let pointStr = rect.data.map(e => e.join(',')).join(';') + ';' + rect.data[0].join(',');
        return pointStr;
    }

    /**根据经纬度生成线 */
    addLatlngLine(line: LineItem): string {
        if (!line.data || line.data.length == 0) return;
        line = new LineItem(line);
        this._allLines.push(line);
        let points = this._transformLatlngToPoint(line.data);
        this._drawLineByPoint(points, line);
        return line.id;
    }

    /**移除矩形（倒数第几个） */
    removeRect(index: number = 1) {
        let len = this._allRects.length - index;
        this._allRects.splice(len, 1);
        this._redraw();
    }

    removeById(id: string) {
        this._allRects = this._allRects.filter(e => e.id !== id);
        this._allLines = this._allLines.filter(e => e.id !== id);
        this._redraw();
    }

    /**获取指定间隔距离的经度差值 
     * @param 间隔距离 
     * @param 纬度点位集合(纬度不同，相同距离差值不一样) 
     */
    getLatDiffByPoints(distance: number = 100, lats: [number, number][] = this._curLatLngs): number {
        let lng = 0.00001, lat = lats.map(e => e[0]).reduce((s, v) => s + v) / lats.length;
        let positionA: [number, number] = [lat, 100],
            positionB: [number, number] = [lat, 100 + lng];
        let xMeasure = L.latLng(positionA).distanceTo(positionB);
        return distance / xMeasure * lng
    }

    /**将经纬度转换为坐标系 */
    private _transformLatlngToPoint(data: [number, number][]): [number, number][] {
        let pointList: [number, number][] = data.map(e => {
            let point = this.getlatLngToContainerPoint(e);
            return [point.x, point.y]
        });
        return pointList;
    }

    /**根据坐标轴生成矩形 */
    private _drawRectByPoint(datas: [number, number][], rect: RectItem, clipData: [number, number][] = []) {
        let ctx = this._context;
        this._setCtxStyle(rect);
        for (let i = 0, len = datas.length; i < len; i++) {
            let site = datas[i].map(e => (e + 0) * 1);
            if (i == 0) {
                ctx.beginPath();
                ctx.moveTo(site[0], site[1])
            } else if (i == len - 1) {
                ctx.lineTo(site[0], site[1]);
                ctx.closePath();
                ctx.stroke();

                ctx.globalAlpha = rect.fillAlpha;
                ctx.fill();
            } else {
                ctx.lineTo(site[0], site[1]);

            }
        }
    }

    /**根据坐标轴生成线  */
    private _drawLineByPoint(points: [number, number][], line: LineItem) {
        let ctx = this._context;
        this._setCtxStyle(line)
        for (let i = 0, len = points.length; i < len; i++) {
            let point = points[i];
            if (i == 0) {
                ctx.beginPath();
                ctx.moveTo(point[0], point[1])
            } else if (i == len - 1) {
                ctx.lineTo(point[0], point[1]);
                ctx.stroke();
            } else {
                ctx.lineTo(point[0], point[1]);
            }
        }
    }

    private _setCtxStyle(pen: RectItem) {
        let ctx = this._context;
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'xor';
        ctx.strokeStyle = pen.color;
        ctx.lineWidth = pen.width;
        ctx.setLineDash(pen.dash);
        ctx.lineDashOffset = pen.dashOffset;
        ctx.fillStyle = pen.fillColor;
    }

    /**得到坐标系点位 */
    private getlatLngToContainerPoint(latlngs: [number, number]): L.Point {
        let p = this._map.latLngToContainerPoint(latlngs);
        return p
    }

    private _animateZoom(e) {
        let map: any = this._map;
        var scale = map.getZoomScale(e.zoom),
            offset = map._getCenterOffset(e.center)._multiplyBy(-scale).subtract(map._getMapPanePos());
        L.DomUtil.setTransform(this._canvas, offset, scale);
    }
}