import * as L from "leaflet";
import { CanvasLayer } from "./leaflet-canvas-layer";
const VELOCITY_SCALE = 1;
const NULL_WIND_VECTOR = 1;
export class LeafletVelocity extends CanvasLayer {
    constructor(options?) {
        super();
        this.initOptions(options)
    }
    data
    _map: L.Map;
    options: any = {
        displayValues: true,
        displayOptions: {
            velocityType: "Velocity",
            position: "bottomleft",
            emptyString: "No velocity data"
        },
        maxVelocity: 10,
        // used to align color scale
        colorScale: null,
        data: null
    }
    _data;
    _frame
    _delegate
    grid
    protected _redraw() {
        throw new Error("Method not implemented.");
    }

    mapBounds
    _startWindy() {
        let bounds = this._map.getBounds(),
            size = this._map.getSize(),// bounds, width, height, extent
            southWest = bounds.getSouthWest(), northEast = bounds.getNorthEast();
        //mapBounds用于确定不同zoom层级下粒子运动速度倍率
        this.mapBounds = {
            south: southWest.lat / 180 * Math.PI,
            north: northEast.lat / 180 * Math.PI,
            east: southWest.lat / 180 * Math.PI,
            west: southWest.lat / 180 * Math.PI,
            width: size.x,
            height: size.y
        }
        this.start([[0, 0], [size.x, size.y]], size.x, size.y);
    }

    /** */
    start(bounds, width, height) {
        stop(); // build grid
        //gridData传过来的数据
        this.grid = this.buildGrid(this.data);
        this.interpolateField(
            this.buildBounds(width, height), function (bounds, field) {
                windy.field = field;
                animate(bounds, field);
            });
    }

    /**构建数据 */
    buildGrid(data) {
        console.log('#####buildGrid-----', data);
        var supported = true;
        if (data.length < 2) supported = false;
        if (!supported) console.log("Windy Error: data must have at least two components (u,v)");
        let builder = this.createBuilder(data);
        var header = builder.header;
        if (header.hasOwnProperty("gridDefinitionTemplate") && header.gridDefinitionTemplate != 0) supported = false;

        if (!supported) {
            console.log("Windy Error: Only data with Latitude_Longitude coordinates is supported");
        }
        supported = true; // reset for futher checks
        let λ0 = header.lo1, //数据的相对经纬度
            φ0 = header.la1,
            Δλ = header.dx,
            Δφ = header.dy, // distance between grid points (e.g., 2.5 deg lon, 2.5 deg lat)
            ni = header.nx, //X方向的数据列数
            nj = header.ny; //Y方向的数据列数
        if (header.hasOwnProperty("scanMode")) {
            var scanModeMask = header.scanMode.toString(2);
            scanModeMask = ('0' + scanModeMask).slice(-8);
            var scanModeMaskArray = scanModeMask.split('').map(Number).map(Boolean);
            if (scanModeMaskArray[0]) Δλ = -Δλ;
            if (scanModeMaskArray[1]) Δφ = -Δφ;
            if (scanModeMaskArray[2]) supported = false;
            if (scanModeMaskArray[3]) supported = false;
            if (scanModeMaskArray[4]) supported = false;
            if (scanModeMaskArray[5]) supported = false;
            if (scanModeMaskArray[6]) supported = false;
            if (scanModeMaskArray[7]) supported = false;
            if (!supported) console.log("Windy Error: Data with scanMode: " + header.scanMode + " is not supported.");
        }
        let date = new Date(header.refTime);
        date.setHours(date.getHours() + header.forecastTime);
        let grid = this.grid = [];
        var p = 0;
        var isContinuous = Math.floor(ni * Δλ) >= 360;
        for (var j = 0; j < nj; j++) {
            //纬度0-180
            var row = [];
            for (var i = 0; i < ni; i++, p++) {
                //经度0-360
                row[i] = builder.data(p);
            }
            if (isContinuous) {
                // For wrapped grids, duplicate first column as last column to simplify interpolation logic
                row.push(row[0]);
            }
            grid[j] = row;
        }
        console.log('#####grid-----', grid);
        return grid; 1
    }

    /**创建数据构建工具 */
    createBuilder(data) {
        console.log('#####createBuilder-----', data);
        var uComp = null,
            vComp = null,
            scalar = null;
        data.forEach(function (record) {
            switch (record.header.parameterCategory + "," + record.header.parameterNumber) {
                case "1,2":
                case "2,2":
                    uComp = record;
                    break;
                case "1,3":
                case "2,3":
                    vComp = record;
                    break;
                default:
                    scalar = record;
            }
        });
        let uData = uComp.data,
            vData = vComp.data;
        return {
            header: uComp.header,
            data: function data(i) {
                return [uData[i], vData[i]];
            }
        };
    }


    buildBounds(width, height) {
        return {
            x: 0,
            y: 0,
            xMax: width,
            yMax: height - 1,
            width: width,
            height: height
        };
    }

    interpolateField(bounds, callback) {
        var projection = {};
        /**确定粒子运动速率 */
        let extent = this.mapBounds;
        var mapArea = (extent.south - extent.north) * (extent.west - extent.east);
        var velocityScale = VELOCITY_SCALE * Math.pow(mapArea, 0.4);
        var columns = [];
        for (let x = bounds.x, len = bounds.width; x < len; x += 2) {
            let column = [];
            for (let y = bounds.y; y <= bounds.yMax; y += 2) {
                //得到X , Y 点对应地图上的经纬度
                let latlon = this._map.containerPointToLatLng(L.point(x, y));
                let coord = [latlon.lng, latlon.lat];
                if (coord) {
                    var λ = coord[0], φ = coord[1];
                    if (isFinite(λ)) {
                        //获得 λ, φ 经纬度的风速信息[ U , V , 速度 ]
                        var wind = this.interpolate(λ, φ);
                        if (wind) {
                            //根据地图的缩放级别决定粒子的大小
                            wind = this.distort(projection, λ, φ, x, y, velocityScale, wind);
                            column[y + 1] = column[y] = wind;
                        }
                    }
                }
            }
            columns[x + 1] = columns[x] = column;
        }
        this.createField(columns, bounds, callback);
    }

    interpolate(λ, φ) {
        if (!this.grid) return null;
        let grid = this.grid;
        var i = this.floorMod(λ - λ0, 360) / Δλ; // 得到经度[0, 360)
        var j = (φ0 - φ) / Δφ; // 得到纬度[0, 180)
        var fi = Math.floor(i),
            ci = fi + 1;
        var fj = Math.floor(j),
            cj = fj + 1;
        var row;
        let isValue = this.isValue;
        if (row = grid[fj]) {
            //初始第一个经纬度的数据
            var g00 = row[fi];
            var g10 = row[ci];

            if (isValue(g00) && isValue(g10) && (row = grid[cj])) {
                //初始第一个经纬度+1后的数据
                var g01 = row[fi];
                var g11 = row[ci];

                if (isValue(g01) && isValue(g11)) {
                    return this.bilinearInterpolateVector(i - fi, j - fj, g00, g10, g01, g11);
                }
            }
        }

        return null;
    };

    floorMod(a, n) {
        return a - n * Math.floor(a / n);
    }

    isValue(x) {
        return x !== null && x !== undefined;
    }

    bilinearInterpolateVector(x, y, g00, g10, g01, g11) {
        var rx = 1 - x;
        var ry = 1 - y;
        var a = rx * ry,
            b = x * ry,
            c = rx * y,
            d = x * y;
        //abcd表示ABCD点对（x,y）点的影响系数
        var u = g00[0] * a + g10[0] * b + g01[0] * c + g11[0] * d;
        var v = g00[1] * a + g10[1] * b + g01[1] * c + g11[1] * d;
        //返回（x,y）点的u和v还有速度
        return [u, v, Math.sqrt(u * u + v * v)];
    }
    //projection是一个空的对象
    // λ, φ格点的经纬度
    //x, y格点所在的像素点
    //scale 一个参数，每次粒子运动的距离
    //格点的风向风速
    distort(projection, λ, φ, x, y, scale, wind) {
        var u = wind[0] * scale;
        var v = wind[1] * scale;
        //根据地图的缩放比例决定粒子运动距离
        var d = this.distortion(projection, λ, φ, x, y); // Scale distortion vectors by u and v, then add.
        wind[0] = d[0] * u + d[2] * v;
        wind[1] = d[1] * u + d[3] * v;
        // wind[0] = wind[0] * 0.12;
        // wind[1] = wind[1] * 0.12;
        return wind;
    };

    // λ, φ格点的经纬度
    //x, y格点所在的像素点
    distortion(projection, λ, φ, x, y) {
        var τ = 2 * Math.PI; //    var H = Math.pow(10, -5.2); // 0.00000630957344480193
        //  var H = 0.0000360;          // 0.0000360°φ ~= 4m  (from https://github.com/cambecc/earth/blob/master/public/libs/earth/1.0.0/micro.js#L13)
        var H = 1; // ToDo:   Why does this work?
        var hλ = λ < 0 ? H : -H;
        var hφ = φ < 0 ? H : -H;
        var pλ = this.project(φ, λ + hλ);
        var pφ = this.project(φ + hφ, λ);
        //根据地图的缩放比例决定粒子运动距离
        var k = Math.cos((φ / 360) * τ);
        return [
            (pλ[0] - x) / hλ / k,
            (pλ[1] - y) / hλ / k,
            (pφ[0] - x) / hφ,
            (pφ[1] - y) / hφ
        ];
    };

    project(lat, lon) {
        var xy = this._map.latLngToContainerPoint(L.latLng(lat, lon));
        return [xy.x, xy.y];
    };

    createField(columns, bounds, callback) {
        function field(x, y) {
            var column = columns[Math.round(x)];
            return column && column[Math.round(y)] || NULL_WIND_VECTOR;
        } 
        field.release = function () {
            columns = [];
        };

        field.randomize = function (o) {
            // UNDONE: this method is terrible
            var x, y;
            var safetyNet = 0;
            do {
                x = Math.round(Math.floor(Math.random() * bounds.width) + bounds.x);
                y = Math.round(Math.floor(Math.random() * bounds.height) + bounds.y);
            } while (field(x, y)[2] === null && safetyNet++ < 30);
            o.x = x;
            o.y = y;
            return o;
        };
        callback(bounds, field);
    }
}