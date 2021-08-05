/**移除数组指定item，不改变引用地址*/
function UtilArrayRemoveItem<T>(arr: T[], item: T, key?: string): T[] {
    if (UtilArrayIsNonNull) {
        let index;
        if (key) {
            index = arr.findIndex(e => e == item || e[key] == item[key] || e[key] == item || e == item[key])
        } else {
            index = arr.findIndex(e => e == item);
        }
        arr.splice(index, 1)
    }
    return arr;
}

/**清空数组，不改变引用地址*/
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

/**对象是数组且length > 0*/
function UtilArrayIsNonNull(arr: Array<any>): boolean {
    return UtilArrayIsArray(arr) && arr.length > 0
}

/**将数组及其后代数组中的 指定的key的值设置为 value
 * arr 为数组   key为要设置的key  value为要设置值   children 为子数组所在的key
 */
function UtilArraySetKeyValue<T>(arr: Array<T>, key: keyof T, value: any, children: string = 'children') {
    if (UtilArrayIsNonNull(arr)) {
        for (let i = 0, len = arr.length; i < len; i++) {
            let el = arr[i];
            el[key] = value;
            UtilArraySetKeyValue(el[children], key, value, children);
        }
    }
}

/**当数组arr中某条数据key为指定value时，将该数据及其所有祖先的attr设置为指定的data  
* children为子数组所在的key
* 返回该条数据
*/
function UtilArraySetKeyValueByValue<T>(arr: Array<T>, key: keyof T, value: any, attr: keyof T, data: any, children: string = 'children'): T {
    if (UtilArrayIsNonNull(arr)) {
        for (let i = 0, len = arr.length; i < len; i++) {
            let el = arr[i];
            if (el[key] == value) {
                el[attr] = data;
                return el;
            } else {
                let el_c: T = UtilArraySetKeyValueByValue(el[children], key, value, attr, data);
                if (el_c) {
                    el[attr] = data;
                    return el_c
                }
            }
        }
    }
}

/** 获取数组中key为指定value的对象数组 onlySuper为true表示父类匹配后就不再匹配子类*/
function UtilArrayGetArrByValue<T>(arr: Array<T>, key: keyof T, value: any, onlySuper: boolean = false, children: string = 'children'): T[] {
    let values = [];
    if (UtilArrayIsNonNull(arr)) {
        for (let i = 0, len = arr.length; i < len; i++) {
            let el = arr[i];
            if (el[key] == value) {
                values.push(el);
                if (onlySuper) {
                    continue;
                }
            }
            let datas: T[] = UtilArrayGetArrByValue(el[children], key, value, onlySuper);
            values.push(...datas);
        }
    }
    return values
}

/**获取数组中key为指定value的对象*/
function UtilArrayGetObjByValue<T>(arr: Array<T>, key: keyof T, value: any, children: string = 'children'): T {
    if (UtilArrayIsNonNull(arr)) {
        for (let i = 0, len = arr.length; i < len; i++) {
            let el = arr[i];
            if (el[key] == value) {
                return el;
            } else {
                let obj: T = UtilArrayGetObjByValue(el[children], key, value);
                if (obj) {
                    return obj;
                }
            }
        }
    }
}

/** 获取数组arr中key为指定value的始祖对象*/
function UtilArrayGetAncestorByValue<T>(arr: Array<T>, key: keyof T, value: any, children: string = 'children'): T {
    if (UtilArrayIsNonNull(arr)) {
        for (let i = 0, len = arr.length; i < len; i++) {
            let el = arr[i];
            if (el[key] == value) {
                return el;
            } else {
                let obj: T = UtilArrayGetAncestorByValue(el[children], key, value);
                if (obj) {
                    return el;
                }
            }
        }
    }
}


/**得到含自身和父级的数组,顶级父类排第一
 * arr数组中key等于value或者该对象等于value的父级数组 
*/
export function UtilArrayGetAncestorsByValue<T>(arr: Array<T>, value: any, key: keyof T, children: string = 'children'): T[] {
    if (UtilArrayIsNonNull(arr)) {
        for (let i = 0, len = arr.length; i < len; i++) {
            let el = arr[i];
            if (el[key] == value || el === value) {
                let arrB = []
                arrB.unshift(el)
                return arrB;
            } else {
                let obj: T[] = UtilArrayGetAncestorsByValue(el[children], value, key);
                if (obj) {
                    obj.unshift(el)
                    return obj;
                }
            }
        }
    }
}

/**数组中如果有就删除如果没有就添加*/
export function UtilArrayValueToggle<T>(arr: Array<T>, value: T): T[] {
    if (UtilArrayIsArray(arr)) {
        for (let i = 0, len = arr.length; i < len; i++) {
            let el = arr[i];
            if (el === value) {
                return UtilArrayRemoveItem(arr, value);
            }
        }
        arr.push(value);
    }
    return arr
}
export { UtilArrayClear, UtilArrayRemoveItem, UtilArrayIsArray, UtilArrayIsNonNull, UtilArraySetKeyValue, UtilArraySetKeyValueByValue, UtilArrayGetObjByValue, UtilArrayGetAncestorByValue, UtilArrayGetArrByValue }