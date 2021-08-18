import { CanvasLayer } from "./leaflet-canvas-layer";
import { CanvasUtil, LatlngInfo } from "./leaflet-canvas-util";

/**leaflet的动画类 */
export class LeafletAnimatLayer extends CanvasLayer {
    /**所有的粒子效果数据 */
    _allParticle: ParticleInfo[];
    protected _redraw() {
        this._allParticle.forEach(particle => {
            particle.curPoints = [];
            particle.index = 0;
            particle.points = CanvasUtil.transformLatLngsToPoints(this._map, particle.latlngs);;
        })
    }

    /**设置所有粒子数据 */
    setAllParticles(particles: ParticleInfo[]) {
        this._allParticle = particles;
        this._redraw();
        this._animat();
    }

    private _animat() {
        this._animationLoop = requestAnimationFrame(this._animat);
        this._drawParticles();
    }

    /**绘制粒子效果 */
    _drawParticles() {
        let particles = this._allParticle, ctx = this._ctx;
        ctx.globalCompositeOperation = "destination-in";
        ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);
        ctx.globalCompositeOperation = "lighter";
        ctx.strokeStyle = "white";
        ctx.fillStyle = "white";
        ctx.shadowColor = "white";
        ctx.shadowBlur = 5;
        particles.forEach(e => {
            this._setParticlePoints(e);
            this._drawParticle(e);
        })
    }

    /**绘制粒子 */
    _drawParticle(particle: ParticleInfo) {
        var ctx = this._ctx;
        let points = particle.curPoints || [];
        for (let i = 0, len = points.length; i < len; i++) {
            let xy = points[i];
            ctx.globalAlpha = 1 - i / len;
            ctx.beginPath();
            ctx.arc(xy[0], xy[1], 1, 0, 2 * Math.PI, false);
            ctx.stroke();
            ctx.fill();
        }
        ctx.stroke();
    }

    /**设置粒子的画布位置 */
    _setParticlePoints(particle: ParticleInfo) {
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
        let size = particle.length || speed, interval = 2;
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

}

export interface ParticleInfo {
    /**所有的经纬度 */
    latlngs: LatlngInfo[];
    /**所属的线条的所有XY坐标 */
    points?: LatlngInfo[];
    /**速度(小于0.1采用百分比)(每帧移动距离) */
    speed?: number;
    /**粒子长度 */
    length?: number;
    /**宽 */
    width?: number;
    /**当前位置 */
    curPoints?: [number, number][];
    /**所属线段序号 */
    index?: number;
    color?: string;
}