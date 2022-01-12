import * as L from "leaflet";
export class CanvasUtil {
    private constructor() { };
    /**图片的缓存 */
    static readonly imgs: { [key: string]: HTMLImageElement } = Object.create(null);

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

    /**画线(没有id将自动生成)*/
    static drawLine(ctx: CanvasRenderingContext2D, line: LineInfo): string {
        let points = line.points || [];
        if (points.length < 2) return;
        this._setCtxFig(ctx, line);
        let s = points[0];
        ctx.beginPath();
        ctx.moveTo(s[0], s[1]);
        for (let i = 1, len = points.length; i < len; i++) {
            let point = points[i];
            ctx.lineTo(point[0], point[1]);
        }
        ctx.stroke();
        this._setCtxFig(ctx);
        line.id = line.id || UtilCreateUuid();
        return line.id;
    }

    /**画贝塞尔曲线(没有id将自动生成)*/
    static drawBezierLine(ctx: CanvasRenderingContext2D, line: LineInfo): string {
        let points = line.points || [];
        if (points.length < 2) return;
        this._setCtxFig(ctx, line);
        let s = points[0], degree = line.degree;
        ctx.beginPath();
        ctx.moveTo(s[0], s[1]);
        for (let i = 1, len = points.length; i < len; i++) {
            let s = points[i - 1], e = points[i];
            let c = this.getBezierCtrlPoint(s, e, degree);
            ctx.quadraticCurveTo(c[0], c[1], e[0], e[1]);
        }
        ctx.stroke();
        this._setCtxFig(ctx);
        line.id = line.id || UtilCreateUuid();
        return line.id;
    }

    /**画矩形(没有id将自动生成)*/
    static drawRect(ctx: CanvasRenderingContext2D, rect: RectInfo): string {
        this._setCtxFig(ctx, rect);
        let points = rect.points || [];
        for (let i = 0, len = points.length; i < len; i++) {
            let point = points[i];
            if (i == 0) {
                ctx.beginPath();
                ctx.moveTo(point[0], point[1])
            } else if (i == len - 1) {
                ctx.lineTo(point[0], point[1]);
                ctx.closePath();
                ctx.stroke();
                ctx.globalAlpha = rect.fillAlpha == undefined ? 1 : rect.fillAlpha;
                ctx.fill();
            } else {
                ctx.lineTo(point[0], point[1]);
            }
        }
        this._setCtxFig(ctx);
        rect.id = rect.id || UtilCreateUuid();
        return rect.id;
    }

    /**绘制小圆点(没有id将自动生成) */
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
    static transformLatLngsToPoints(map: L.Map, latlngs: LatlngInfo[]): LatlngInfo[] {
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

    /**获取贝塞尔曲线的控制点
     * @param s:起点
     * @param e:终点
     * @param degree：曲度等级（越大越弯曲）
     */
    static getBezierCtrlPoint(s: LatlngInfo, e: LatlngInfo, degree: number = 1): [number, number] {
        const e0 = s, e1 = e,
            c = [(e0[0] + e1[0]) / 2, (e0[1] + e1[1]) / 2],
            d = degree;
        let x = c[0] - e0[0],
            y = c[1] - e0[1];
        /**中点到起点间的距离 */
        let len = Math.sqrt(x * x + y * y);
        /**角度 */
        let angle = Math.PI / 2 - Math.asin(y / len);
        let xd = d * Math.cos(angle) * len, yd = d * Math.sin(angle) * len * x / Math.abs(x);
        xd = isNaN(xd) ? 0 : xd; yd = isNaN(yd) ? 0 : yd;
        let curve: [number, number] = [c[0] + xd, c[1] - yd];
        return curve;
    }

    /**根据图片路径地址，获取图片后缓存 , 避免重复请求*/
    private static _getImgPromise(imgUrl: string): Promise<HTMLImageElement> {
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

    static readonly ctxFig: CtxPara = {
        alpha: 1, widthLine: 1, colorLine: 'blue', colorFill: 'white', dash: [10, 0], dashOff: 0, fillAlpha: 1
    }
    /**设置画布的相关配置 */
    private static _setCtxFig(ctx: CanvasRenderingContext2D, fig: CtxPara = {}) {
        fig = Object.assign({}, this.ctxFig, fig);
        ctx.globalAlpha = fig.alpha;
        ctx.globalCompositeOperation = fig.globalCompositeOperation || 'source-over';
        ctx.fillStyle = fig.colorFill;
        ctx.strokeStyle = fig.colorLine;
        ctx.lineWidth = fig.widthLine;
        ctx.setLineDash(fig.dash);
        ctx.lineDashOffset = fig.dashOff;
    }
}

/**纬经度及该点信息 */
export type LatlngInfo = [number, number, any?];

/**canvas的画笔属性配置 */
export interface CtxPara {
    /**透明度 */
    alpha?: number;
    /**填充的颜色透明度 */
    fillAlpha?: number;
    /**填充的颜色 */
    colorFill?: string | CanvasGradient | CanvasPattern;
    /**线条的颜色 */
    colorLine?: string | CanvasGradient | CanvasPattern;
    /**线宽 */
    widthLine?: number;
    /**虚线 线长,间隔长*/
    dash?: [number, number],
    /**虚线偏移*/
    dashOff?: number,
    globalCompositeOperation?: string
}

/**线条渲染 */
export interface LineInfo extends CtxPara {
    /**用于从数据中删除该条线 */
    id?: string;
    /**经纬度必须转换为像素位置后再绘制 (可附带该位置点的信息) */
    latlngs?: LatlngInfo[],
    /**所有点位的像素点(通过经纬度转换过来) */
    points?: LatlngInfo[],
    /**贝塞尔曲线的曲度 数值越大越弯曲 */
    degree?: number,
}

/**矩形渲染 */
export interface RectInfo extends LineInfo { }

/**圆 */
export interface ArcInfo extends LineInfo {
    /**圆半径 */
    size?: number;
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

function UtilCreateUuid(): string {
    let time = new Date().getTime().toString().slice(-7)
    let per = Math.random().toFixed(3).split('.')[1];
    let suf = Math.random().toFixed(3).split('.')[1];
    return per + time + suf
}