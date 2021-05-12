import { ShareInputType } from "../models";

/**undefined和null是返回true */
export function UtilIsUndefined(value: any): boolean {
    return value === undefined || value === null
}

/**空数组 undefined null 和 '' 返回true */
export function UtilIsEmpty(value: any): boolean {
    if (Array.isArray(value)) {
        return value.length == 0
    } else if (value === undefined || value === null || value === '') {
        return true;
    } else {
        return false;
    }
}

/**判断是否相等 ， 传入uuid后就只比对对象的key的值是否相等 */
export function UtilIsEqual(cur, value, key?: string) {
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
    } else if (key && cur[key] === value[key] && cur[key]) {
        return true
    }
    return false
}

export function UtilArrayGetValueByKey<T>(arrs: T[], value: string, key: string = 'key'): T | undefined {
    for (let i = 0, len = arrs.length; i < len; i++) {
        let data = arrs[i];
        if (data[key] == value) {
            return data
        } else if (data['children'] && data['children'].length > 0) {
            let a = UtilArrayGetValueByKey(data['children'], value, key);
            if (a) {
                return a as T;
            }
        }
    }
}

/**移除掉数组中指定的item  arr和item不能同时为sting*/
export function UtilArrayRemoveItem(arr: any[], item: any, key?: string) {
    let index;
    if (key) {
        index = arr.findIndex(e => e == item || e[key] == item[key] || e[key] == item || e == item[key])
    } else {
        index = arr.findIndex(e => e == item);
    }
    arr.splice(index, 1)
}

/**不改变引用地址的清空数组 */
export function UtilArrayClear<T>(arr: T[]): T[] {
    arr.length = 0;
    return arr;
}



export function utilValueType(value: any): ShareInputType {
    let T: ShareInputType;
    if (Array.isArray(value)) {
        if (typeof value[0] !== "object") {
            T = 'strings';
        } else {
            T = 'objects';
        }
    } else {
        if (typeof value == "string") {
            T = 'string';
        } else {
            T = 'object';
        }
    }
    return T
}
