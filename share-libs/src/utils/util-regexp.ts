import { AbstractControl, ValidatorFn } from "@angular/forms";

/**正则表达式校验 */
export function UtilRegValidator(reg: RegExp, text?: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        const value = control.value;
        //如果类型是number 直接转为string类型，不然match 方法会报错
        const result = value ? (value + '').match(reg) : null;
        return result == null ? { 'errMsg': { value: text + "不符合规则" } } : null;
    };
}

/**通过正则给字符串中的数字增加到指定位数 */
export function UtilRegAddNumber(str: string, length: number = 3) {
    let result = str.replace(/\d*、*/g, function ($) {
        if ($) {
            let strs = $.split("")
            while (strs.length < length) {
                strs.unshift('0')
            }
            return strs.join('')
        } else {
            return ""
        }
    })
    return result;
}

/**对相似名称（只有数字不同）进行合并处理 */
export function UtilRegCombineNames(names: string[]): string {
    let combines: string[] = [];
    /**排序 */
    names.sort((a, b) => parseInt(b.replace(/\D/g, '')) - parseInt(a.replace(/\D/g, '')));
    names.forEach(name => {
        let similar: string | false = false;
        for (let i = 0; i < combines.length; i++) {
            const el = combines[i];
            if (similar = UtilIsSimilar(name, el)) {
                combines[i] = similar;
                continue;
            }
        }
        if (!similar) {
            combines.push(name)
        }
    })
    return combines.join('，')
}

function UtilIsSimilar(a: string, b: string) {
    a = a.trim(); b = b.trim();
    if (a.replace(/\d*、*/g, "") == b.replace(/\d*、*/g, '')) {
        let pre = '';
        a.replace(/\d*、*/g, function ($) { pre += $; return "" });
        pre += '、';
        b.replace(/\d*、*/g, function ($) { pre += $; return "" })
        let c = a.replace(/\d+、*\D*/g, '');
        let d = a.replace(/\D*\d+、*/g, '');
        return c + pre + d;
    } else {
        return false
    }
}