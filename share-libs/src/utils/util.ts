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

/**判断是否相等 ， 传入uuid后就只比对对象的key的值是否相等 */
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

/**第一个值不为undefined和null则返回第一个值 */
function UtilSetValue(data1, data2) {
    return data1 ?? data2;
}

export function UtilType(value) {

}

export { UtilIsUndefined, UtilIsFalse, UtilIsEmpty, UtilIsEqual, UtilGetAttrValue, UtilValueType, UtilIsFunction, UtilSetValue }