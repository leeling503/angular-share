
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

/**判读对象是否是数组 */
function UtilArrayIsArray(arr: Array<any>): boolean {
    if (Array.isArray) {
        return Array.isArray(arr)
    } else {
        return Object.prototype.toString.call(arr) === '[object Array]'
    }
}

/**判读数组是否不为空  length > 0*/
function UtilArrayNonNull(arr: Array<any>): boolean {
    return UtilArrayIsArray(arr) && arr.length > 0
}

/**将数组及其子数组中的 指定的key的值设置为 value
 * arr 为数组   key为要设置的key  value为要设置值   children 为子数组所在的key
 */
function UtilArraySetKeyValue(arr: Array<any>, key: string, value: any, children: string = 'children') {
    if (UtilArrayNonNull(arr)) {
        for (let i = 0, len = arr.length; i < len; i++) {
            let el = arr[i];
            el[key] = value;
            UtilArraySetKeyValue(el[children], key, value);
        }
    }
}

/**当某一条数据的key为指定value时， 将该数据及其祖先数据的key设置为指定的value  
 * arr 为数组   key为和value比较的  value为值   
 * attr为设置的key  value为设置的值  children 为子数组所在的key
 */
function UtilArraySetKeyValueByValue(
    arr: Array<any>, key: string, value: any, attr: string, data: any, children: string = 'children'
) {
    if (UtilArrayNonNull(arr)) {
        for (let i = 0, len = arr.length; i < len; i++) {
            let el = arr[i];
            if (el[key] == value) {
                el[attr] = data;
                return true;
            } else {
                let flag = UtilArraySetKeyValueByValue(el[children], key, value, attr, data);
                if (flag) {
                    el[attr] = data;
                }
            }
        }
    }
}

/**
 * 获取数组中key的value为指定值的对象
 */
function UtilArrayGetOByValue<T>(arr: Array<T>, key: string, value: any, children: string = 'children'): T {
    if (UtilArrayNonNull(arr)) {
        for (let i = 0, len = arr.length; i < len; i++) {
            let el = arr[i];
            if (el[key] == value) {
                return el;
            } else {
                let obj: T = UtilArrayGetOByValue(el[children], key, value);
                if (obj) {
                    return obj;
                }
            }
        }
    }
}

/**
 * 通过指定值获取数组中的祖先, key为比对的属性value为指定值
 */
function UtilArrayGetAncestorByValue<T>(arr: Array<T>, key: string, value: any, children: string = 'children'): T {
    if (UtilArrayNonNull(arr)) {
        for (let i = 0, len = arr.length; i < len; i++) {
            let el = arr[i];
            if (el[key] == value) {
                return el;
            } else {
                let obj: T = UtilArrayGetOByValue(el[children], key, value);
                if (obj) {
                    return el;
                }
            }
        }
    }
}

export { UtilArrayClear, UtilArrayRemoveItem, UtilArrayGetValueByKey, UtilArrayIsArray, UtilArrayNonNull, UtilArraySetKeyValue, UtilArraySetKeyValueByValue, UtilArrayGetOByValue, UtilArrayGetAncestorByValue }