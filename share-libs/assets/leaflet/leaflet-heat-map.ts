import * as L from "leaflet";

export class HeatLayer extends L.Layer {
    /** 热力图  传入经纬度坐标[],也可传入系数 [纬度,经度,系数?] */
    constructor(options?: L.LayerOptions) { super(options) }
    _latlngs: any[];
    _heat: Simpleheat;
    _canvas: HTMLCanvasElement;
    /**动画id */
    _frame: number;
    options: {
        /**半径 */
        radius?: number,
        /**模糊半径 */
        blur?: number,
        /**渐变色 */
        gradient?: any,
        /**最小阴影透明度 */
        minOpacity?: number,
        pane?: any,
    } = {}
    _map: any;

    initialize(latlngs, options) {
        this._latlngs = latlngs || [];
        L.setOptions(this, options);
    }

    onAdd(map) {
        this._map = map;
        if (!this._canvas) {
            this._initCanvas();
        }
        if (this.options.pane) {
            this.getPane().appendChild(this._canvas);
        } else {
            map._panes.overlayPane.appendChild(this._canvas);
        }
        map.on('moveend', this._reset, this);
        if (map.options.zoomAnimation && L.Browser.any3d) {
            map.on('zoomanim', this._animateZoom, this);
        }
        this._reset();
        return this
    }

    onRemove(map) {
        if (this.options.pane) {
            this.getPane().removeChild(this._canvas);
        } else {
            map.getPanes().overlayPane.removeChild(this._canvas);
        }
        map.off('moveend', this._reset, this);
        if (map.options.zoomAnimation) {
            map.off('zoomanim', this._animateZoom, this);
        }
        return this
    }

    addTo(map) {
        map.addLayer(this);
        return this;
    }

    /**重置[纬度，经度]集合*/
    setLatLngs(latlngs: any[]) {
        this._latlngs = latlngs;
        return this.redraw();
    }

    /**添加[纬度，经度],并重绘*/
    addLatLng(latlng) {
        this._latlngs.push(latlng);
        return this.redraw();
    }

    /**更新配置 */
    setOptions(options) {
        L.setOptions(this, options);
        if (this._heat) {
            this._updateOptions();
        }
        return this.redraw();
    }

    private redraw() {
        if (this._heat && !this._frame && this._map && !this._map['_animating']) {
            this._frame = L.Util.requestAnimFrame(this._redraw, this);
        }
        return this;
    }

    /**初始化画布 */
    private _initCanvas() {
        var canvas = this._canvas = L.DomUtil.create('canvas', 'leaflet-heatmap-layer leaflet-layer');
        var originProp = L.DomUtil.testProp(['transformOrigin', 'WebkitTransformOrigin', 'msTransformOrigin']);
        canvas.style[originProp as string] = '50% 50%';
        var size = this._map.getSize();
        canvas.width = size.x;
        canvas.height = size.y;
        var animated = this._map.options.zoomAnimation && L.Browser.any3d;
        L.DomUtil.addClass(canvas, 'leaflet-zoom-' + (animated ? 'animated' : 'hide'));
        this._heat = new Simpleheat(canvas);
        this._updateOptions();
    }

    private _updateOptions() {
        this._heat.radius(this.options.radius || this._heat.defaultRadius, this.options.blur);
        if (this.options.gradient) {
            this._heat.gradient(this.options.gradient);
        }
    }

    /**重新定位画布并重绘 */
    private _reset() {
        var topLeft = this._map.containerPointToLayerPoint([0, 0]);
        L.DomUtil.setPosition(this._canvas, topLeft);
        var size = this._map.getSize();
        if (this._heat._width !== size.x) {
            this._canvas.width = this._heat._width = size.x;
        }
        if (this._heat._height !== size.y) {
            this._canvas.height = this._heat._height = size.y;
        }
        this._redraw();
    }


    private _redraw() {
        if (!this._map) { return; }
        let data = [],
            r = this._heat._r,
            size = this._map.getSize(),
            bounds = new L.Bounds(
                L.point([-r, -r]),
                size.add([r, r])),
            maxZoom = this._map.getMaxZoom() + 3,
            v = 1 / Math.pow(2, Math.max(0, Math.min(maxZoom - this._map.getZoom(), 12))),
            cellSize = r / 2,
            grid = [],
            /**拖动后相对初始化时Ponit的偏移量*/
            panePos = this._map._getMapPanePos(),
            offsetX = panePos.x % cellSize,
            offsetY = panePos.y % cellSize,
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
                var alt = this._latlngs[i][2] !== undefined ? + this._latlngs[i][2] : 1;
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
        this._heat.data(data).draw(this.options.minOpacity);
        this._frame = null;
    }

    /**缩放动画 */
    private _animateZoom(e) {
        var scale = this._map.getZoomScale(e.zoom),
            offset = this._map._getCenterOffset(e.center)._multiplyBy(-scale).subtract(this._map._getMapPanePos());
        L.DomUtil.setTransform(this._canvas, offset, scale);
    }
}

class Simpleheat {
    constructor(canvas: any) {
        this._canvas = canvas = typeof canvas === 'string' ? document.getElementById(canvas) : canvas;
        this._ctx = canvas.getContext('2d');
        this._width = canvas.width;
        this._height = canvas.height;
        this._data = [];
    };
    _canvas: HTMLCanvasElement;
    _ctx: CanvasRenderingContext2D;
    _width: number;
    _height: number;
    _data: any[];
    /**默认半径 */
    defaultRadius: number = 10;
    _circle
    /**单点渲染半径（ 默认+blur 15 ） */
    _r: number;
    /**渐变的二进制数据 */
    _grad: Uint8ClampedArray;
    /**渐变颜色 */
    defaultGradient = {
        0.1: 'blue',
        0.2: 'cyan',
        0.3: 'lime',
        0.4: 'yellow',
        0.5: 'red',
        1.0: 'red'
    };

    data(data) {
        this._data = data;
        return this;
    }

    add(point) {
        this._data.push(point);
        return this;
    }
    clear() {
        this._data = [];
        return this;
    }

    radius(r, blur?) {
        blur = blur === undefined ? 15 : blur;
        var circle = this._circle = this._createCanvas(),
            ctx = circle.getContext('2d'),
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

    /**创建新的画布 */
    _createCanvas() {
        if (typeof document !== 'undefined') {
            return document.createElement('canvas');
        } else {
            return L.DomUtil.create('canvas', 'leaflet-heat-map leaflet-layer');
        }
    }

    resize() {
        this._width = this._canvas.width;
        this._height = this._canvas.height;
    }

    /**创建渐变色 */
    gradient(grad) {
        var canvas = this._createCanvas(),
            ctx = canvas.getContext('2d'),
            gradient = ctx.createLinearGradient(0, 0, 0, 256);
        canvas.width = 1;
        canvas.height = 256;
        for (var i in grad) {
            gradient.addColorStop(+i, grad[i]);
        }
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 1, 256);
        this._grad = ctx.getImageData(0, 0, 1, 256).data;
        return this;
    }

    /**绘制热力图 */
    draw(minOpacity) {
        if (!this._circle) this.radius(this.defaultRadius);
        if (!this._grad) this.gradient(this.defaultGradient);
        var ctx = this._ctx;
        ctx.clearRect(0, 0, this._width, this._height);
        //根据点位创建颜色深度不以的黑色遮罩
        for (var i = 0, len = this._data.length, p; i < len; i++) {
            p = this._data[i];
            ctx.globalAlpha = Math.min(Math.max(p[2], minOpacity === undefined ? 0.2 : minOpacity), 1);
            ctx.drawImage(this._circle, p[0] - this._r, p[1] - this._r);
        }
        var colored = ctx.getImageData(0, 0, this._width, this._height);
        /**根据遮罩的深度不同添加不同的渐变颜色 */
        this._colorize(colored.data, this._grad);
        ctx.putImageData(colored, 0, 0);
        return this;
    }

    /**填充颜色 */
    _colorize(pixels: Uint8ClampedArray, gradient: Uint8ClampedArray): void {
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