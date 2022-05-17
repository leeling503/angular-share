const STRNUM: string[] = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09']
function genDate(date: string | Date): Date {
    if (typeof date === 'string') {

    }
    return new Date(date)
}

/**是否是有效的日期字符串或日期对象*/
function ifValid(date: string | Date): boolean {
    let str = new Date(date).toString();
    return str !== 'Invalid Date';
}

/**小于10的一律添加 0，如 1=>> 01  */
function getZero(num: number | string): string {
    return STRNUM[num] || num.toString();
}

/** 获得日期的字符串形式 , 传入 time 则添加返回时分秒字符串"hh:mm:ss" */
function getStr(d: Date, format: string = "YYYY-MM-DD", time?: string): string {
    let year: string = d.getFullYear().toString(),
        month: string = getZero(d.getMonth() + 1),
        date: string = getZero(d.getDate()),
        res = format;
    res = res.replace('YYYY', year);
    res = res.replace('MM', month);
    res = res.replace('DD', date);
    if (time) {
        let h = getZero(d.getHours()),
            m = getZero(d.getMinutes()),
            s = getZero(d.getSeconds());
        time = time.replace('hh', h);
        time = time.replace('mm', m);
        time = time.replace('ss', s);
        res = res + ' ' + time
    }
    return res;
}

/**获取当月的天数（也就是最后一天） @param y 年 @param m 月*/
function getMonthLastDay(y: number, m: number): number {
    if (m == 2) {
        /**闰年2月29天 */
        if ((!(y % 100) && !(y % 400)) || ((y % 100) && !(y % 4))) {
            return 29
        }
        return 28
    } else {
        return [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m]
    }
}

/**获取当前日期是全年的第几天 @param date：当前日期*/
function getFullDay(date: Date): number {
    let y = date.getFullYear(), m = date.getMonth() + 1, d = date.getDate(), res = 0;
    for (let i = 1; i < m; i++) {
        res += getMonthLastDay(y, i)
    }
    return res + d
}

/**获取当前日期是全年的第几周 @param date：当前日期*/
function getFullWeek(date: Date): number {
    let startWeek = new Date(`${date.getFullYear()}-01-01`).getDay();
    /**本年度第一天是周几（周日为0） 表示要补几天 */
    let week = [6, 0, 1, 2, 3, 4, 5][startWeek];
    /**修正后的天数 */
    let fullDay = getFullDay(date) + week;
    return Math.ceil(fullDay / 7)
}

export const UtilDate = {
    STRS: STRNUM,
    /**生成Date对象 */
    genDate: genDate,
    /**是否是有效的日期字符串或日期对象*/
    ifValid: ifValid,
    /** 获得日期的字符串形式 */
    getStr: getStr,
    /**小于10的一律添加 0，如 1=>> 01  */
    getZero: getZero,
    /**获取当月的天数（最后一天日期）*/
    getMonthLastDay: getMonthLastDay,
    /**获取当前日期是全年的第几周 @param date：当前日期*/
    getFullWeek: getFullWeek,
    /**获取当前日期是全年的第几天 @param date：当前日期*/
    getFullDay: getFullDay,
}