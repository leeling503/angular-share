
export function utilIsEmpty(value: any): boolean {
    if (Array.isArray(value)) {
        return value.length == 0
    } else if (value === undefined || value === null || value === '') {
        return true;
    } else {
        return false;
    }
}

/**判断是否相等 ， 传入uuid后就只比对uuid对应的值是否相等 */
export function utilIsEqual(cur, value, uuid?: string) {
    if (cur === value) {
        return true
    } else if (Array.isArray(value) && Array.isArray(cur)) {
        if (value.length === cur.length) {
            let flag = value.every(e => cur.includes(e))
            if (uuid && !flag) {
                let curUuids = cur.map(e => e && e[uuid])
                flag = value.every(e => curUuids.includes(e[uuid]))
            }
            return flag
        }
        return false
    } else if (uuid && cur[uuid] === value[uuid]) {
        return true
    }
    return false
}

/**移除掉数组中指定的item  arr和item不能同时为sting*/
export function utilArrayRemoveItem(arr: any[], item: any, key?: string) {
    let index;
    if (key) {
        index = arr.findIndex(e => e == item || e[key] == item[key] || e[key] == item || e == item[key])
    } else {
        index = arr.findIndex(e => e == item);
    }
    arr.splice(index, 1)
}

/**不改变引用地址的清空数组 */
export function utilArrayClear<T>(arr: T[]): T[] {
    arr.splice(0, arr.length);
    return arr;
}