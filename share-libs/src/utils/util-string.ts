
/** 指定的分隔符flag将一个string分割成子字符串数组 */
function split(str: string, flag: string): any[] {
    if (typeof str === "undefined") {
        return []
    } else {
        (str + '').split(flag)
    }
}


/**数组操作工具对象 */
export const UtilStr = {
    split: split
}