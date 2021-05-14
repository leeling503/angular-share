
function UtilArrayGetValueByKey<T>(arrs: T[], value: string, key: string = 'key'): T | undefined {
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
function UtilArrayRemoveItem(arr: any[], item: any, key?: string) {
    let index;
    if (key) {
        index = arr.findIndex(e => e == item || e[key] == item[key] || e[key] == item || e == item[key])
    } else {
        index = arr.findIndex(e => e == item);
    }
    arr.splice(index, 1)
}

/**不改变引用地址的清空数组 */
function UtilArrayClear<T>(arr: T[]): T[] {
    arr.length = 0;
    return arr;
}

export { UtilArrayClear, UtilArrayRemoveItem, UtilArrayGetValueByKey }