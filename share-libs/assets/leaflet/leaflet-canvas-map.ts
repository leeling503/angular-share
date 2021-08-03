
import * as L from "leaflet";
import { identity } from "lodash";
import { CanvasLayer } from "./leaflet-canvas-layer";
import { ArcInfo, CanvasUtil, ImageInfo, LatlngInfo, LineInfo, RectInfo } from "./leaflet-canvas-util";

type Shape = 'all' | 'line' | 'rect' | 'img' | 'arc'

/**画线和闭合矩形 */
export class LeafletCanvasMap extends CanvasLayer {
    options
    /**所有的线的经纬度数据 */
    private _allLines: LineInfo[] = [];
    /**所有的矩形经纬度数据 */
    private _allRects: RectInfo[] = [];
    /**所有的小圆经纬度数据 */
    private _allArcs: ArcInfo[] = [];
    /**所有的图片经纬度数据 */
    private _allImgs: ImageInfo[] = [];
    /**刚刚通过经纬度画完的矩形 */
    private _curLatLngs: LatlngInfo[] = [];

    _redraw() {
        this._clearContext();
        this._allRects.forEach(rect => {
            rect.points = CanvasUtil.transformLatLngsToPoints(this._map, rect.latlngs);
            CanvasUtil.drawRect(this._ctx, rect)
        })
        this._allLines.forEach(line => {
            line.points = CanvasUtil.transformLatLngsToPoints(this._map, line.latlngs);
            CanvasUtil.drawLine(this._ctx, line);
        })
        this._allImgs.forEach(img => {
            img.point = CanvasUtil.transformLatLngToPoint(this._map, img.latlng);
            CanvasUtil.drawImg(this._ctx, img);
        })
    }

    /**清空画布（可选参数为内容的形状）*/
    clearCanvasByType(shape: Shape = 'all') {
        switch (shape) {
            case 'line': this._allLines = []; break;
            case 'rect': this._allRects = []; break;
            case 'img': this._allImgs = []; break;
            case 'arc': this._allArcs = []; break;
            case 'all': this._allLines = [];
                this._allRects = [];
                this._allImgs = [];
                this._allArcs = [];
        }
        this._redraw();
    }
    /**设置矩形数据 */
    setAllRect(rects: RectInfo[]) {
        this._allRects = rects; this._redraw();
    }
    /**设置线数据 */
    setAllLines(lines: LineInfo[]) {
        this._allLines = lines; this._redraw();
    }
    /**设置图片数据 */
    setAllImg(imgs: ImageInfo[]) {
        this._allImgs = imgs; this._redraw();
    }
    /**设置原点数据 */
    setAllArc(arcs: ArcInfo[]) {
        this._allArcs = arcs; this._redraw();
    }
    /**添加矩形*/
    addLatlngRect(rect: RectInfo): string {
        if (!rect.latlngs || rect.latlngs.length == 0) return '';
        this._curLatLngs = rect.latlngs;
        rect.points = CanvasUtil.transformLatLngsToPoints(this._map, rect.latlngs);
        CanvasUtil.drawRect(this._ctx, rect);
        this._allRects.push(rect);
        return rect.id;
    }
    /**添加线 */
    addLatlngLine(line: LineInfo): string {
        if (!line.latlngs || line.latlngs.length == 0) return;
        line.points = CanvasUtil.transformLatLngsToPoints(this._map, line.latlngs);
        CanvasUtil.drawLine(this._ctx, line);
        this._allLines.push(line);
        return line.id;
    }

    /**根据id移除数据 */
    removeById(id: string, shape?: Shape) {
        switch (shape) {
            case 'img': this._allImgs = this._allImgs.filter(e => e.id !== id); break;
            case 'arc': this._allArcs = this._allArcs.filter(e => e.id !== id); break;
            case 'line': this._allLines = this._allLines.filter(e => e.id !== id); break;
            case 'rect': this._allRects = this._allRects.filter(e => e.id !== id); break;
            default: this._allImgs = this._allImgs.filter(e => e.id !== id);
                this._allArcs = this._allArcs.filter(e => e.id !== id);
                this._allRects = this._allRects.filter(e => e.id !== id);
                this._allLines = this._allLines.filter(e => e.id !== id); break;
        }
        this._redraw();
    }

    /**获取指定间隔距离的经度差值 
     * @param 间隔距离 
     * @param 纬度点位集合(纬度不同，相同距离差值不一样) 
     */
    getLatDiffByPoints(distance: number = 100, lats: LatlngInfo[] = this._curLatLngs): number {
        return CanvasUtil.getLatDiffByPoints(distance, lats)
    }

    getExpend(a) {
        let dis = this.getLatDiffByPoints(100)
        let c = expend(a, dis);
        this.addLatlngRect({ latlngs: c });
        console.log(c)
    }
}

function expend(polygon: any[], expand: number) {
    let len = polygon.length;
    let new_polygon = [];
    for (let i = 0; i < len; i++) {
        let p = polygon[i];
        let p1 = polygon[i == 0 ? len - 1 : i - 1];
        let p2 = polygon[i == len - 1 ? 0 : i + 1];

        let v1x = p1[0] - p[0];
        let v1y = p1[1] - p[1];
        let n1 = norm(v1x, v1y);
        v1x /= n1;
        v1y /= n1;

        let v2x = p2[0] - p[0];
        let v2y = p2[1] - p[1];
        let n2 = norm(v2x, v2y);
        v2x /= n2;
        v2y /= n2;

        let l = -expand / Math.sqrt((1 - (v1x * v2x + v1y * v2y)) / 2);

        let vx = v1x + v2x;
        let vy = v1y + v2y;
        let n = l / norm(vx, vy);
        vx *= n;
        vy *= n;

        new_polygon[i] = [vx + p[0], vy + p[1]];
    }

    return new_polygon;
}
function norm(x: number, y: number) {
    return Math.sqrt(x * x + y * y);
}