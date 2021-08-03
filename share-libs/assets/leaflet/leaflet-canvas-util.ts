import * as L from "leaflet";

export class CanvasUtil {
    /**图片的缓存 */
    static readonly imgs: { [key: string]: HTMLImageElement } = Object.create(null);
    static readonly ctxFig: CtxConfig = {
        alpha: 1, lineWidth: 1, colorLine: 'blue', colorFill: 'green', dash: [0, 0], dashOff: 0, fillAlpha: 0.2
    }
    /**绘制图片 */
    static drawImg(ctx: CanvasRenderingContext2D, img: ImageInfo): string {
        let point = img.point || [], x = point[0], y = point[1], size = img.size,
            url = img.url, rotate = img.rotate || 0, alpha = img.alpha === 0 ? 0 : img.alpha || 1,
            sizeX: number = size[0] || size, sizeY: number = size[1] || size;
        this._getImgPromise(url)
            .then((img: HTMLImageElement) => {
                rotate = rotate / 180 * Math.PI;
                ctx.globalAlpha = alpha;
                ctx.translate(x, y);
                ctx.rotate(rotate);
                ctx.drawImage(img, -sizeX / 2, -sizeY / 2, sizeX, sizeY);
                ctx.rotate(-rotate);
                ctx.translate(-x, -y);
            })
        img.id = img.id || UtilCreateUuid()
        return img.id;
    }
    /**画线
     * @param isClose 是否闭合
     */
    static drawLine(ctx: CanvasRenderingContext2D, line: LineInfo, isClose: boolean = false): string {
        let points = line.points || [];
        this._setCtxFig(ctx, line);
        for (let i = 0, len = points.length; i < len; i++) {
            let point = points[i];
            if (i == 0) {
                ctx.beginPath();
                ctx.moveTo(point[0], point[1])
            } else if (i == len - 1) {
                ctx.lineTo(point[0], point[1]);
                isClose && ctx.closePath();
                ctx.stroke();
            } else {
                ctx.lineTo(point[0], point[1]);
            }
        }
        this._setCtxFig(ctx);
        line.id = line.id || UtilCreateUuid()
        return line.id;
    }
    /**画矩形*/
    static drawRect(ctx: CanvasRenderingContext2D, rect: RectInfo): string {
        this.drawLine(ctx, rect, true);
        ctx.fillStyle = rect.colorFill || this.ctxFig.colorFill;
        ctx.globalAlpha = rect.fillAlpha == 0 ? 0 : rect.fillAlpha || this.ctxFig.fillAlpha;
        ctx.fill();
        this._setCtxFig(ctx);
        rect.id = rect.id || UtilCreateUuid()
        return rect.id;
    }
    /**绘制小圆点 */
    static drawArc(ctx: CanvasRenderingContext2D, arc: ArcInfo): string {
        let points = arc.points || [], size = arc.size || 10;
        this._setCtxFig(ctx, arc);
        for (let i = 0, len = points.length; i < len; i++) {
            ctx.beginPath();
            let point = points[i]
            ctx.arc(point[0], point[1], size, 0, 2 * Math.PI, false);
            ctx.stroke();
            ctx.fill()
        }
        this._setCtxFig(ctx);
        arc.id = arc.id || UtilCreateUuid()
        return arc.id;
    }
    /**将经纬度数组转换为坐标系 */
    static transformLatLngsToPoints<T>(map: L.Map, latlngs: LatlngInfo<T>[]): LatlngInfo<T>[] {
        return latlngs.map(e => this.transformLatLngToPoint(map, e));
    }
    /**得到坐标系点位 */
    static transformLatLngToPoint(map: L.Map, latlngInfo: LatlngInfo): LatlngInfo {
        let e = latlngInfo;
        let latlng: [number, number] = [e[0], e[1]], info = e[2];
        let p = map.latLngToContainerPoint(latlng);
        return info ? [p.x, p.y, info] : [p.x, p.y]
    }

    /**获取指定间隔距离的经度差值 
     * @param 间隔距离 
     * @param 纬度点位集合(纬度不同，相同距离差值不一样) 
     */
    static getLatDiffByPoints(distance: number = 100, latLng: LatlngInfo[]): number {
        let lng = 0.00001, lat = latLng.map(e => e[0]).reduce((s, v) => s + v) / latLng.length;
        let positionA: [number, number] = [lat, 100],
            positionB: [number, number] = [lat, 100 + lng];
        let xMeasure = L.latLng(positionA).distanceTo(positionB);
        return distance / xMeasure * lng
    }

    /**缩放动画 */
    static animateZoom(e, canvas: HTMLCanvasElement, map: any) {
        var scale = map.getZoomScale(e.zoom),
            offset = map._getCenterOffset(e.center)._multiplyBy(-scale).subtract(map._getMapPanePos());
        L.DomUtil.setTransform(canvas, offset, scale);
    }
    /**创建一个画布 */
    static createCanvas(): HTMLCanvasElement {
        if (typeof document !== 'undefined') {
            return document.createElement('canvas');
        } else {
            return L.DomUtil.create('canvas', 'leaflet-canvas-util leaflet-layer');
        }
    }
    /**根据图片路径地址，获取图片后缓存 , 避免重复请求*/
    private static _getImgPromise(imgUrl: string): Promise<any> {
        let img = this.imgs[imgUrl];
        if (!img) {
            return new Promise((resolve, reject) => {
                let img = new Image();
                img.onload = () => {
                    this.imgs[imgUrl] = img;
                    resolve(img)
                };
                img.src = `${imgUrl}`
            })
        }
        return Promise.resolve(img)
    }

    /**设置相关配置 */
    private static _setCtxFig(
        ctx: CanvasRenderingContext2D,
        fig: CtxConfig = {}) {
        fig = Object.assign({}, this.ctxFig, fig);
        ctx.globalAlpha = fig.alpha;
        ctx.fillStyle = fig.colorFill;
        ctx.strokeStyle = fig.colorLine;
        ctx.lineWidth = fig.lineWidth;
        ctx.setLineDash(fig.dash);
        ctx.lineDashOffset = fig.dashOff;
    }
}
export type LatlngInfo<T = any> = [number, number, T?];
/**canvas的画笔属性配置 */
export interface CtxConfig {
    /**透明度 */
    alpha?: number;
    /**填充的颜色透明度 */
    fillAlpha?: number;
    /**填充的颜色 */
    colorFill?: string | CanvasGradient | CanvasPattern;
    /**线条的颜色 */
    colorLine?: string | CanvasGradient | CanvasPattern;
    /**线宽 */
    lineWidth?: number;
    /**虚线 线长,间隔长*/
    dash?: [number, number],
    /**虚线偏移*/
    dashOff?: number,
}
/**图片渲染 */
export interface ImageInfo {
    id?: string,
    /**在canvas中的位置  经纬度（需要转换为像素点X,Y）*/
    latlng?: LatlngInfo,
    /**图片的像素点(通过经纬度转换过来) */
    point?: LatlngInfo,
    /**图片大小 */
    size?: number | [number, number]
    /**图片路径 */
    url?: string,
    /**图片旋转角度 */
    rotate?: number,
    /**透明度 */
    alpha?: number;
}
/**线条渲染 */
export interface LineInfo extends CtxConfig {
    /**用于从数据中删除该条线 */
    id?: string;
    /**经纬度必须转换为像素位置后再绘制 (可附带该位置点的信息) */
    latlngs?: LatlngInfo[],
    /**所有点位的像素点(通过经纬度转换过来) */
    points?: LatlngInfo[],
}
/**矩形渲染 */
export interface RectInfo extends LineInfo { }
/**圆 */
export interface ArcInfo extends LineInfo {
    size?: number;
}
function UtilCreateUuid(): string {
    let time = new Date().getTime().toString().slice(-7)
    let per = Math.random().toFixed(3).split('.')[1];
    let suf = Math.random().toFixed(3).split('.')[1];
    return per + time + suf
}