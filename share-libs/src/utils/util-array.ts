/**清空数组，不改变引用地址*/
export function UtilArrayClear<T>(arr: T[]): T[] {
    arr.length = 0;
    return arr;
}

/**移除数组指定item，会改变原数组，不改变引用地址*/
export function UtilArrayRemoveItem<T>(arr: T[], item: T, key?: keyof T): T[] {
    if (UtilArrayIsNonNull(arr)) {
        let index;
        if (key) {
            index = arr.findIndex(e => e == item || e[key] == item[key])
        } else {
            index = arr.findIndex(e => e == item);
        }
        arr.splice(index, 1)
    }
    return arr || [];
}

/**判断数组（包含其子项）中的key是否全为value */
export function UtilArrayEvery<T>(arr: Array<T>, value: any, key: keyof T, children?: string) {
    if (UtilArrayIsNonNull(arr)) {
        for (let i = 0, len = arr.length; i < len; i++) {
            const ele = arr[i];
            if (ele[key] !== value) {
                return false
            } else {
                if (children && !UtilArrayEvery(ele[children], value, key, children)) {
                    return false
                }
            }
        }
    }
    return true;
}

/**判断数组（包含其子项）中是否存在key为value的选项 */
export function UtilArraySome<T>(arr: Array<T>, value: any, key: keyof T, children?: string): boolean {
    if (UtilArrayIsNonNull(arr)) {
        for (let i = 0, len = arr.length; i < len; i++) {
            const ele = arr[i];
            if (ele === value || (key && ele[key] === value)) {
                return true;
            } else {
                if (children && UtilArraySome(ele[children], value, key, children)) {
                    return true
                }
            }
        }
    }
    return false;
}


/**数组中如果有就删除如果没有就添加(对象可指定key)*/
export function UtilArrayValueToggle<T>(arr: Array<T>, value: T, key?: keyof T): T[] {
    if (UtilArrayIsArray(arr)) {
        for (let i = 0, len = arr.length; i < len; i++) {
            let el = arr[i];
            if (el === value) {
                return UtilArrayRemoveItem(arr, value, key);
            }
        }
        arr.push(value);
    }
    return arr
}

/**浅复制（改变引用地址） */
export function UtilArrayCopy<T>(arr: T[]): T[] {
    let r: T[] = [];
    if (UtilArrayIsNonNull(arr)) {
        r = [...arr]
    }
    return r
}

/**判读对象是否是数组 */
export function UtilArrayIsArray(arr: Array<any>): boolean {
    if (Array.isArray) {
        return Array.isArray(arr)
    } else {
        return Object.prototype.toString.call(arr) === '[object Array]'
    }
}

/**对象是数组且length > 0*/
export function UtilArrayIsNonNull(arr: Array<any>): boolean {
    return UtilArrayIsArray(arr) && arr.length > 0
}

/**将数组及其后代数组中的 指定的key的值设置为 value
 * arr 为数组   key为要设置的key  value为要设置值   children 为子数组所在的key
 * children 为 ''  表示不设置子项
 */
export function UtilArraySetKeyValue<T>(arr: Array<T>, key: keyof T, value: any, children: string = 'children') {
    if (UtilArrayIsNonNull(arr)) {
        for (let i = 0, len = arr.length; i < len; i++) {
            let el = arr[i];
            el[key] = value;
            if (children) {
                UtilArraySetKeyValue(el[children], key, value, children);
            }
        }
    }
}

/**当数组arr中某条数据key为指定value时，将该数据及其所有祖先的attr设置为指定的data  
* children为子数组所在的key
* 返回该条数据(路由服务中启用)
*/
export function UtilArraySetKeyValueByValue<T>(arr: Array<T>, key: keyof T, value: any, attr: keyof T, data: any, children: string = 'children'): T {
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

/**当数组arr中某条数据key为指定value时，将所有祖先的attr设置为指定的data  
* children为子数组所在的key
* 返回该条数据(路由服务中启用)
*/
export function UtilArraySetValueByValue<T>() { }

/**两个数组（A,B），
 * 如果A中的某个数据a存在于B中，或者该数据的attr属性等于B中某条数据的attr，
 * 则将A中该数据的key设置为value
 */
export function UtilArraysSetValueByOther<T>(A: T[], B: T[], key: keyof T, value: any, attr?: keyof T): void {
    if (UtilArrayIsNonNull(A) && UtilArrayIsNonNull(B)) {
        A.forEach(a => {
            if (B.some(b => b == a || (attr && a[attr] == b[attr]))) {
                a[key] = value
            }
        })
    }
}

/** 获取数组中key为指定value的对象数组 onlySuper为true表示父类匹配后就不再匹配子类*/
export function UtilArrayGetArrByValue<T>(arr: Array<T>, key: keyof T, value: any, onlySuper: boolean = false, children: string = 'children'): T[] {
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

/**获取数组及其子项中获得key为指定value的对象
 * children 为 ''  表示不查找子项
*/
export function UtilArrayGetObjByValue<T>(arr: Array<T>, key: keyof T, value: any, children: string = 'children'): T {
    if (UtilArrayIsNonNull(arr)) {
        for (let i = 0, len = arr.length; i < len; i++) {
            let el = arr[i];
            if (el[key] == value) {
                return el;
            } else if (children) {
                let obj: T = UtilArrayGetObjByValue(el[children], key, value);
                if (obj) {
                    return obj;
                }
            }
        }
    }
}

/** 获取数组arr中key为指定value的始祖对象*/
export function UtilArrayGetAncestorByValue<T>(arr: Array<T>, key: keyof T, value: any, children: string = 'children'): T {
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
export function UtilArrayGetAncestorsByValue<T>(arr: Array<T>, value: any, key?: keyof T, children: string = 'children'): T[] {
    if (UtilArrayIsNonNull(arr)) {
        for (let i = 0, len = arr.length; i < len; i++) {
            let el = arr[i];
            if (el === value || (key && el[key] == value)) {
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

/**两个数组（A,B），
 * 如果A中的某个数据a不存在于B中，或者该数据的attr属性在B中找不到对应的，
 * 则将A中该数据的放置额外的数组中并返回该数组
 */
export function UtilArraysGetSpareArr<T>(A: T[], B: T[], attr?: keyof T): T[] {
    let res: T[] = []
    if (UtilArrayIsNonNull(A) && UtilArrayIsNonNull(B)) {
        A.forEach(a => {
            if (B.some(b => b == a || (attr && a[attr] == b[attr]))) {

            } else {
                res.push(a)
            }
        })
    }
    return res
}

/**两个数组（A,B），
 * 如果A中的某个数据a不存在于B中，或者该数据的attr属性在B中找不到对应的，
 * 则将A中该数据的放置额外的数组中并返回该数组
 */
export function UtilArraysGetSpareArrByKey<T>(A: T[], B: T[], key: keyof T, children: string): T[] {
    let res: T[] = []
    if (UtilArrayIsNonNull(A) && UtilArrayIsNonNull(B)) {
        A.forEach(a => {
            if (!UtilArraySome(B, a[key], key, children)) {
                res.push(a)
            }
        })
    }
    return res
}