/**各位加00变为00-09 */
const STRS: string[] = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09']

/** 获得日期的字符串形式 */
function getStr(d: Date, format: string = "YYYY-MM-DD"): string {
    let year: string = d.getFullYear().toString(),
        month: string = STRS[d.getMonth() + 1] || (d.getMonth() + 1).toString(),
        date: string = d.getDate().toString(),
        res = format;
    res = res.replace('YYYY', year);
    res = res.replace('MM', month);
    res = res.replace('DD', date);
    return res;
}

export const UtilDate = {
    STRS: STRS,
    getStr: getStr
}