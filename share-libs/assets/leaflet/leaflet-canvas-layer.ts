import * as L from "leaflet";
import { CanvasUtil } from "./leaflet-canvas-util";

export abstract class CanvasLayer extends L.Layer {
    constructor() { super(); }
    options: CanvasPara;
    protected _canvas: HTMLCanvasElement;
    protected _ctx: CanvasRenderingContext2D;
    protected _width: number;
    protected _height: number;
    protected _animationLoop: number;

    /**初始化设置配置 */
    initOptions(options?: CanvasPara) {
        L.setOptions(this, options)
    }

    /**addTo时会自动调用 */
    onAdd(map: L.Map) {
        this._map = map;
        if (!this._canvas) this._initCanvas();
        if (this.options.pane)
            this.getPane().appendChild(this._canvas);
        else
            map.getPanes().overlayPane.appendChild(this._canvas);
        map.on('viewreset', this._reset, this);
        map.on('moveend', this._reset, this);
        map.on("mousemove", this._onMouseMove, this)
        map.on("click", this._onClickCanvas, this)
        if (map.options.zoomAnimation && L.Browser.any3d) {
            /**缩放动画 */
            map.on('zoomanim', this._animateZoom, this);
        };
        this._reset()
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
        map.off("mousemove", this._onMouseMove, this)
        map.off("click", this._onClickCanvas, this)
        if (map.options.zoomAnimation) {
            map.off('zoomanim', this._animateZoom, this);
        }
        if (this._animationLoop) cancelAnimationFrame(this._animationLoop);
        return this
    }

    protected _onMouseMove(e) { }
    protected _onClickCanvas(e) { }
    /**重画，需要先清空画布 */
    protected abstract _redraw();

    private _reset() {
        var topLeft = this._map.containerPointToLayerPoint([0, 0]);
        L.DomUtil.setPosition(this._canvas, topLeft);
        var size = this._map.getSize();
        this._canvas.width = this._width = size.x;
        this._canvas.height = this._height = size.y;
        this._redraw();
    }

    /**初始化画布 */
    private _initCanvas() {
        this._canvas = L.DomUtil.create('canvas', `leaflet-layer ${this.options.nameClass || 'leaflet-canvas-map'}`);
        var originProp = "" + L.DomUtil.testProp(['transformOrigin', 'WebkitTransformOrigin', 'msTransformOrigin']);
        this._canvas.style[originProp] = '50% 50%';
        this._canvas.style['z-index'] = this.options.zIndex || 100;
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

    /**是否成功清除 */
    protected _clearContext(): boolean {
        let map = this._map;
        if (L.Browser.canvas && map) {
            let ctx = this._ctx, ww = this._canvas.width, hh = this._canvas.height;
            ctx.clearRect(0, 0, ww, hh); // 清空画布
            return true
        }
        return false
    }

    /**缩放动画 */
    private _animateZoom(e: any) {
        CanvasUtil.animateZoom(e, this._canvas, this._map)
    }

}

export interface CanvasPara {
    pane?: any;
    /**画布的class名称 */
    nameClass?: string
    /**画布层级  默认100，最大400 */
    zIndex?: number;
}