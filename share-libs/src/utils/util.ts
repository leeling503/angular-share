/**各位加00变为00-09 */
export const STRNUM: string[] = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09']


/**undefined和null是返回true */
function UtilIsUndefined(value: any): boolean {
    return value === undefined || value === null
}

/**undefined\null\false\ '' 返回true */
function UtilIsFalse(value: any): boolean {
    return value === undefined || value === null || value === false || value === ""
}

/**空数组 undefined null 和 '' 返回true */
function UtilIsEmpty(value: any): boolean {
    if (Array.isArray(value)) {
        return value.length == 0
    } else if (value === undefined || value === null || value === '') {
        return true;
    } else {
        return false;
    }
}

/**判断是否相等 ， 传入key后就只比对对象的key的值是否相等 , flag 为true则强制比较key值 */
function UtilIsEqual(cur, value, key?: string) {
    if (cur === value) {
        return true
    } else if (Array.isArray(value) && Array.isArray(cur)) {
        if (value.length === cur.length) {
            let flag = value.every(e => cur.includes(e))
            if (key && !flag) {
                let curUuids = cur.map(e => e && e[key])
                flag = value.every(e => curUuids.includes(e[key]))
            }
            return flag
        }
        return false
    } else if (key && cur[key] && cur[key] === value[key]) {
        return true
    }
    return false
}

/**当对象的属性为undefined或null时返回默认值value */
function UtilGetAttrValue(obj: any, key: string, value) {
    if (obj[key] === undefined || obj[key] === null) {
        return value
    } else {
        return obj[key]
    }
}

/**判断value是字符串还是对象或者数组 */
function UtilValueType(value: any) {
    let o;
    if (Array.isArray(value)) {
        if (typeof value[0] !== "object") {
            o = 'strings';
        } else {
            o = 'objects';
        }
    } else {
        if (typeof value == "string") {
            offscreenBuffering = 'string';
        } else {
            o = 'object';
        }
    }
    return o
}

/**存在并且是function */
function UtilIsFunction(v) {
    return v && typeof v === 'function'
}

export class UtilSleep {
    constructor() { }
    private promise: Promise<any>;
    /**回调函数 ， 延时（单位为秒） */
    sleep(cb: (data?: any) => any, time: number = 5): UtilSleep {
        this.promise = (this.promise || new Promise((resolve, reject) => { resolve(0) }))
            .then((res) => {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        let data = cb(res);
                        resolve(data)
                    }, time * 1000);
                })
            })
        return this
    }
}

export { UtilIsUndefined, UtilIsFalse, UtilIsEmpty, UtilIsEqual, UtilGetAttrValue, UtilValueType, UtilIsFunction }

/**生成指定间隔的字符数组 @param inter:间隔大小， @param max:最大数  @param min:最小数 @param flag:个位数转为 00 */
function genIntervalStrs(inter: number = 1, max: number = 23, min: number = 0, flag: boolean = true): string[] {
    let res = [], str;
    for (let i = min; i <= max;) {
        str = STRNUM[i] || (i + '');
        i = i + inter;
        res.push(str)
    }
    return res;
}

export const Util = {
    /**生成指定间隔的字符数组 */
    genIntervalNums: genIntervalStrs,
    /**判断是否相等 ，传入key后就只比对对象的key的值是否相等 */
    ifEqual: UtilIsEqual
}