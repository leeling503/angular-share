import { CanvasLayer, ParaCanvas } from "./leaflet-canvas-layer";
import { CanvasUtil, InfoLatlng, InfoLine } from "./leaflet-canvas-util";

/**leaflet的动画类 */
export class LeafletAnimatLayer extends CanvasLayer {

    constructor(options?: ParaCanvas) {
        super();
        this.initOptions(options)
    }

    /**所有的粒子效果数据 */
    private _allParticle: ParticleInfo[] = [];
    protected _redraw() {
        this._allParticle.forEach(particle => {
            particle.curPoints = [];
            particle.curve = []
            let points = particle.points = CanvasUtil.transformLatLngsToPoints(this._map, particle.latlngs);
            for (let i = 0, len = points.length; i < len - 1; i++) {
                const e0 = points[i], e1 = points[i + 1];
                let curve = CanvasUtil.getBezierCtrlPoint(e0, e1, particle.degree);
                particle.curve.push(curve);
            }
        })
    }

    /**
     * @desc 二阶贝塞尔，指定百分比的点位置信息
     * @param {number} t 当前百分比
     * @param {Array} p1 起点坐标
     * @param {Array} p2 终点坐标
     * @param {Array} cp 控制点
     */
    getBezierPointByT(t, p1, cp, p2): [number, number] {
        const [x1, y1] = p1;
        const [cx, cy] = cp;
        const [x2, y2] = p2;
        let x = (1 - t) * (1 - t) * x1 + 2 * t * (1 - t) * cx + t * t * x2;
        let y = (1 - t) * (1 - t) * y1 + 2 * t * (1 - t) * cy + t * t * y2;
        return [x, y];
    }


    /**设置所有粒子数据 */
    setAllParticles(particles: ParticleInfo[]) {
        this._allParticle = particles;
        this._redraw();
        this._animat();
    }

    private _animat() {
        this._animationLoop = requestAnimationFrame(() => { this._animat() });
        this._drawParticles();
    }

    /**绘制粒子效果 */
    private _drawParticles() {
        let particles = this._allParticle, ctx = this._ctx;
        ctx.globalCompositeOperation = "destination-in";
        ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);
        ctx.globalCompositeOperation = "source-over";
        particles.forEach(e => {
            if (e.showParticle == false) { return }
            ctx.strokeStyle = e.colorParticle || "white";
            ctx.fillStyle = e.colorParticle || "white";
            ctx.shadowColor = e.colorParticle || "white";
            ctx.shadowBlur = 5;
            this.getCurBezierPoints(e);
            this._drawParticle(e);
        })
    }

    /**绘制粒子 */
    private _drawParticle(particle: ParticleInfo) {
        var ctx = this._ctx;
        let points = particle.curPoints || [];
        for (let i = 0, len = points.length; i < len; i++) {
            let xy = points[i];
            let alpha = (1 - i / len) * (1 / 2);
            // let alpha = Math.cos(Math.PI / 2 * i / len) * (6 / 12);
            ctx.globalAlpha = i == 0 ? 1 : alpha;
            ctx.beginPath();
            ctx.arc(xy[0], xy[1], 1, 0, 2 * Math.PI, false);
            ctx.stroke();
            ctx.fill();
        }
    }

    /**设置粒子的画布位置 */
    private _setParticlePoints(particle: ParticleInfo) {
        /**画布坐标*/
        let points = particle.points || [], i = particle.index || 0, j = i + 1;
        /**画布坐标不足 */
        if (points.length < 2) return;
        /**当前数据已达坐标上限（从开始绘制） */
        if (j >= points.length) {
            i = 0, j = 1, particle.index = 0, particle.curPoints = undefined;
        }
        /**当前粒子坐标，上一点位坐标和下一点位坐标 */
        let cur = particle.curPoints,
            per = points[i],
            nex = points[j];
        /**当前粒子坐标不足（表明可能移动画布或缩放需要重新开始绘制） */
        if (!cur || cur.length < 2) {
            cur = [points[i], points[i]];
        }
        /**点位差值和线段长度 */
        let x = nex[0] - per[0], y = nex[1] - per[1];
        let len = Math.sqrt(x * x + y * y);
        /**每次移动距离*/
        let speed = particle.speed || 3;
        speed = speed < 0.1 ? speed * len : speed;
        /**计算粒子点位 */
        let x0, y0, x1, y1;
        /**终点点位  */
        x1 = cur[0][0] + x * speed / len;
        y1 = cur[0][1] + y * speed / len;
        if ((x > 0 && x1 > nex[0]) || (x < 0 && x1 < nex[0])) {
            x1 = nex[0], y1 = nex[1], particle.index = i + 1;
        }
        /**粒子效果长度 */
        let size = particle.length || speed, interval = 1;
        let curPoints: [number, number][] = [[x1, y1]];
        /**采用多点位渲染粒子效果 */
        for (let i = 0; i < size; i++) {
            /**跳出循环标识 */
            let flag = false;
            x0 = x1 - x * (i * interval) / len, y0 = y1 - y * (i * interval) / len;
            if ((x >= 0 && x0 <= per[0]) || (x <= 0 && x0 >= per[0])) {
                x0 = per[0], y0 = per[1];
                flag = true;
            }
            curPoints.push([x0, y0]);
            if (flag) break;
        }
        ///**两点画线渲染粒子效果 */
        // x0 = x1 - x * size / len, y0 = y1 - y * size / len;
        // if ((x > 0 && x0 < per[0]) || (x < 0 && x0 > per[0])) {
        //   x0 = per[0], y0 = per[1];
        // }
        // curPoints.push([x0, y0]);
        particle.curPoints = curPoints
    }

    private getCurBezierPoints(particle: ParticleInfo) {
        /**画布坐标*/
        let points = particle.points || [], i = particle.index || 0, j = i + 1;
        /**画布坐标不足 */
        if (points.length < 2) return;
        /**当前数据已达坐标上限（从开始绘制） */
        if (j >= points.length) {
            i = 0, j = 1, particle.index = 0, particle.curPoints = undefined, particle.age = 0;
        }
        /**当前粒子坐标，上一点位坐标和下一点位坐标 */
        let cur = particle.curPoints,
            per = points[i],
            nex = points[j],
            ctrl = particle.curve[i];
        /**当前粒子坐标不足（表明可能移动画布或缩放需要重新开始绘制） */
        if (!cur || cur.length < 2) {
            cur = [points[i], points[i]];
        }
        /**点位差值和线段长度 */
        let x = nex[0] - per[0], y = nex[1] - per[1];
        let len = Math.sqrt(x * x + y * y);
        /**每次移动距离占比*/
        let speed = particle.speed || 3;
        speed = speed > 0.1 ? speed / len : speed;
        /**粒子效果长度占比 */
        let size = particle.length || speed,
            interval = 1 / len;
        size = size > 0.1 ? size / len : size;
        /**粒子长度 */
        let length = size * len,
            age = (particle.age || 0) + speed,
            curPoints: [number, number][] = [];
        age = age > 1 ? 1 : age;
        /**计算粒子点位 */
        for (let i = 0; i < length; i++) {
            let t = age - interval * i;
            if (t < 0) { break };
            t = t > 0 ? t : 0;
            let point: [number, number] = this.getBezierPointByT(t, per, ctrl, nex)
            curPoints.push(point)
        }
        if (age == 1) {
            particle.index = ++i;
            age = 0;
        }
        particle.age = age;
        particle.curPoints = curPoints
    }
}

export interface ParticleInfo extends InfoLine {
    /**计算得到的贝塞尔曲线控制点*/
    curve?: [number, number][];
    /**速度(小于0.1采用百分比)(每帧移动距离) */
    speed?: number;
    /**粒子长度 */
    length?: number;
    /**当前粒子点位数据 */
    curPoints?: InfoLatlng[];
    /**生命 0-1*/
    age?: number;
    /**所属线段序号 */
    index?: number;
    /**粒子的颜色 */
    colorParticle?: string;
    /**显示粒子（只有为false才隐藏） */
    showParticle?: boolean;
}