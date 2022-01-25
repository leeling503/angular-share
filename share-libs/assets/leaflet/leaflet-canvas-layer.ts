import * as L from "leaflet";
import { CanvasUtil } from "./leaflet-canvas-util";
/**
 * 生成canvas图层的基础类
 */
export abstract class CanvasLayer extends L.Layer {
    constructor(options?: ParaCanvas) {
        super(options);
        L.setOptions(this, options)
    }
    options: ParaCanvas;
    /**生成的canvas画布，onAdd调用时生成 */
    protected _canvas: HTMLCanvasElement;
    /**画布的内容信息 */
    protected _ctx: CanvasRenderingContext2D;
    protected _width: number;
    protected _height: number;
    /**动画循环的id标识 */
    protected _animationLoop: number;
    /**点击事件的回调 */
    protected cbClick: (e) => any = (e) => { }
    /**鼠标移动事件的回调 */
    protected cbMove: (e) => any = (e) => { }
    /**添加点击事件 （传入点击事件回调） */
    onClick(cb: (e) => any) { this.cbClick = cb; };
    /**添加鼠标移动事件 （传入点击事件回调） */
    onMove(cb: (e) => any) { this.cbMove = cb; };

    /**初始化设置配置 */
    initOptions(options: ParaCanvas = this.options) {
        console.log(options)
        L.setOptions(this, options)
    }

    /**addTo时会自动调用 */
    onAdd(map: L.Map) {
        this._map = map;
        if (!this._canvas) this._initCanvas();
        if (this.options.pane) {
            /**如果指定的pane不存在就自己创建（往map添加div Pane） */
            (this.getPane(this.options.pane) || map.createPane(this.options.pane)).appendChild(this._canvas);
            console.log(this.options.pane, this.getPane());
        } else
            map.getPanes().overlayPane.appendChild(this._canvas);
        map.on('viewreset', this._reset, this);
        map.on('moveend', this._reset, this);
        map.on("mousemove", this.onMouseMove, this)
        map.on("click", this.onMouseClick, this)
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
        map.off("mousemove", this.onMouseMove, this)
        map.off("click", this.onMouseClick, this)
        if (map.options.zoomAnimation) {
            map.off('zoomanim', this._animateZoom, this);
        }
        if (this._animationLoop) cancelAnimationFrame(this._animationLoop);
        return this
    }

    protected onRemoveLayer(e) { }
    protected onMouseMove(e) { }
    protected onMouseClick(e) { }

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
        this._canvas = L.DomUtil.create('canvas', `leaflet-layer ${this.options.className || 'leaflet-canvas-map'}`);
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

/**
 * canvas画布的部分配置
 */
export interface ParaCanvas {
    /**画布挂载的div节点;
     * map默认创建 mapPane tilePane shadowPane overlayPane markerPane tooltipPane popupPane,
     * 不存在时CanvasLayer会调用创建方法 
     * 类名会去掉Pane， 例如XPane和X都生成类名为 leaflet-X-pane的div节点，但是属于不同的pane
     */
    pane?: string;
    /**画布的class名称 */
    className?: string
    /**画布层级  默认100，最大400(受挂载的div影响，可修改) */
    zIndex?: number;

}