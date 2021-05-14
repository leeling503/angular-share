import { AbstractControl, ValidatorFn } from "@angular/forms";

/**
 * 正则表达式校验
 * @param reg
 */
function UtilRegValidator(reg: RegExp, text?: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        const value = control.value;
        //如果类型是number 直接转为string类型，不然match 方法会报错
        const result = value ? (value + '').match(reg) : null;
        return result == null ? { 'errMsg': { value: text + "不符合规则" } } : null;
    };
}
export { UtilRegValidator }