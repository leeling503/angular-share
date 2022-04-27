import * as L from "leaflet";
import { CanvasLayer, ParaCanvas } from "./leaflet-canvas-layer";
import { CanvasUtil } from "./leaflet-canvas-util";

export class LeafletHeatLayer extends CanvasLayer {

    /** 热力图  传入经纬度坐标[],也可传入系数 [纬度,经度,系数?] */
    constructor(options?: HeatPara) {
        super();
    }
    _map: any;
    /**数据的经纬度集合 */
    private _latlngs: [number, number, number?][] = [];
    /**动画id */
    private _frame!: number;
    /**热力图绘制数据 */
    private _heatData: [number, number, number?][] = [];
    /**用于绘制阴影，决定渲染颜色层级 */
    private _circleShadow!: HTMLCanvasElement
    /**单点渲染半径（ 默认+blur 15 ） */
    private _r!: number;
    /**渐变的二进制数据 */
    private _grad!: Uint8ClampedArray;
    private _gradEl!: HTMLCanvasElement;
    private _maxNum: number = 2;
    /**默认配置 */
    options: HeatPara = {
        className: 'leaflet-heat-canvas',
        radius: 20,
        blur: 10,
        minOpacity: 0.1,
        maxZoom: 3,
        ifTip: true,
        tipX: 80,
        tipY: 20,
        gradient: {
            0.2: 'blue',
            0.4: 'cyan',
            0.6: 'lime',
            0.8: 'yellow',
            1.0: 'red'
        }
    }

    /**重置[纬度，经度]集合*/
    setLatLngs(latlngs: [number, number, number?][]) {
        this._latlngs = latlngs;
        return this._redraw();
    }

    /**添加[纬度，经度],并重绘*/
    addLatLng(latlng: [number, number, number?]) {
        this._latlngs.push(latlng);
        return this._redraw();
    }

    /**更新配置 */
    setOptions(options: HeatPara) {
        L.setOptions(this, options);
        this._updateOptions();
        return this._redraw();
    }

    protected _redraw() {
        if (!this._frame && this._map && !this._map['_animating']) {
            this._frame = L.Util.requestAnimFrame(this._computeHeatData, this);
        }
        return this;
    }

    private _updateOptions() {
        this._generateShadowRadius(this.options.radius, this.options.blur);
        if (this.options.gradient) {
            this._gradient(this.options.gradient);
        }
    }

    /**计算热力图数据 */
    private _computeHeatData() {
        let map: any = this._map;
        if (!map) { return; }
        let data: [number, number, number?][] = [],
            r = this._r,
            size = this._map.getSize(),
            bounds = new L.Bounds(
                L.point([-r, -r]),
                size.add([r, r])),
            maxZoom = this.options.maxZoom!,
            num = Math.pow(2, Math.max(2, Math.min(maxZoom - this._map.getZoom(), 12))),
            v = 1 / num,
            cellSize = r / 2,
            grid: any[] = [],
            /**拖动后相对初始化时Ponit的偏移量*/
            panePos = map._getMapPanePos(),
            offsetX = panePos.x % cellSize, offsetY = panePos.y % cellSize,
            i, len, p, cell, x, y, j, len2, k;
        /**对点位进行计算 */
        for (i = 0, len = this._latlngs.length; i < len; i++) {
            /**得到像素点位 */
            p = this._map.latLngToContainerPoint(this._latlngs[i]);
            /**判断点位是否在范围内 */
            if (bounds.contains(p)) {
                /** X，Y拖动后同一经纬度对应的Point会变化，为确保热力图和之前的一模一样，故需要减去偏移量*/
                x = Math.floor((p.x - offsetX) / cellSize) + 2;
                y = Math.floor((p.y - offsetY) / cellSize) + 2;
                /**阴影等级（热力等级）*/
                var alt = this._latlngs[i][2] !== undefined ? + this._latlngs[i][2]! : 1;
                k = alt * v;
                grid[y] = grid[y] || [];
                cell = grid[y][x];
                if (!cell) {
                    /**初始 */
                    grid[y][x] = [p.x, p.y, k];
                } else {
                    /**当grid[y][x]已经存在，表示这两个经纬度归在同一个半径cellSize
                     经过几次叠加后，热力等级不一样 */
                    cell[0] = (cell[0] * cell[2] + p.x * k) / (cell[2] + k);
                    cell[1] = (cell[1] * cell[2] + p.y * k) / (cell[2] + k);
                    cell[2] += k;
                }
            }
        }
        /**对grid进行格式，获得 整数点位和合理的热力等级*/
        for (i = 0, len = grid.length; i < len; i++) {
            if (grid[i]) {
                for (j = 0, len2 = grid[i].length; j < len2; j++) {
                    cell = grid[i][j];
                    if (cell) {
                        data.push([
                            Math.round(cell[0]),
                            Math.round(cell[1]),
                            Math.min(cell[2], 1)
                        ]);
                    }
                }
            }
        }
        /**去设置热力图数据并绘制 */
        this._heatData = data;
        this._drawByData();
        if (this.options && this.options.ifTip) {
            this._addGradient(num);
        }
        this._frame = 0;
    }
    /**添加等级标识 */
    private _addGradient(num: any) {
        let ctx = this._ctx, x = this.options.tipX!, y = this.options.tipY!;
        ctx.globalAlpha = 0.5;
        ctx.drawImage(this._gradEl, x, y, 20, 128);
        ctx.fillText('0', x + 25, y);
        ctx.fillText(num, x + 25, y + 128);
    }
    /**根据数据重绘制热力图 */
    private _drawByData() {
        var ctx = this._ctx;
        ctx.clearRect(0, 0, this._width, this._height);
        if (!this._circleShadow) this._generateShadowRadius(this.options.radius);
        if (!this._grad) this._gradient(this.options.gradient);
        let minOpacity = this.options.minOpacity || 0.05;
        //根据点位创建颜色深度不一的黑色遮罩
        for (var i = 0, len = this._heatData.length, p; i < len; i++) {
            p = this._heatData[i];
            ctx.globalAlpha = Math.min(Math.max(p[2]!, minOpacity), 1);
            ctx.drawImage(this._circleShadow, p[0] - this._r, p[1] - this._r);
        }
        var colored = ctx.getImageData(0, 0, this._width, this._height);
        /**根据遮罩的深度不同添加不同的渐变颜色 */
        this._colorize(colored.data, this._grad);
        ctx.putImageData(colored, 0, 0);
        return this;
    }
    /**生成单个的阴影半径 */
    private _generateShadowRadius(r: any, blur?: any) {
        blur = blur === undefined ? 15 : blur;
        let circle = this._circleShadow = CanvasUtil.createCanvas(),
            ctx = circle.getContext('2d')!,
            r2 = this._r = r + blur;
        circle.width = circle.height = r2 * 2;
        ctx.shadowOffsetX = ctx.shadowOffsetY = r2 * 2;
        ctx.shadowBlur = blur;
        ctx.shadowColor = 'black';
        ctx.beginPath();
        ctx.arc(-r2, -r2, r, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
        return this;
    }
    /**创建渐变色 */
    private _gradient(grad: any) {
        let canvas = this._gradEl = CanvasUtil.createCanvas(),
            ctx = canvas.getContext('2d')!,
            gradient = ctx.createLinearGradient(0, 0, 0, 256);
        canvas.width = 1;
        canvas.height = 256;
        for (var i in grad) {
            gradient.addColorStop(+i, grad[i]);
        }
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 10, 256);
        this._grad = ctx.getImageData(0, 0, 1, 256).data;
        return this;
    }
    /**填充颜色 */
    private _colorize(pixels: Uint8ClampedArray, gradient: Uint8ClampedArray): void {
        for (var i = 0, len = pixels.length, j; i < len; i += 4) {
            j = pixels[i + 3] * 4;
            if (j) {
                pixels[i] = gradient[j];
                pixels[i + 1] = gradient[j + 1];
                pixels[i + 2] = gradient[j + 2];
            }
        }
    }
}

interface HeatPara extends ParaCanvas {
    /**半径 */
    radius?: number,
    /**模糊级数(越大影响范围越大影响系数越小，最好不要超过半径的两倍) */
    blur?: number,
    /**渐变色 */
    gradient?: any,
    /**最小阴影透明度 */
    minOpacity?: number,
    /**单位变红 */
    maxNum?: number,
    /**决定了不同层级变红的数量*/
    maxZoom?: number,
    /**是否显示等级标识tip */
    ifTip?: boolean,
    /**tip偏移量*/
    tipX?: number,
    /**tip偏移量 */
    tipY?: number,
}