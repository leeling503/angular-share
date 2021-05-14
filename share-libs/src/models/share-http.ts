interface HttpResult {
    /** 0 表示成功  1表示失败或异常 */
    rlt?: 0 | 1;
    info?: string;
    datas?: any;
}

class HttpSearch {
    currentPage: number = 1;//当前页
    pageRecord: number = 15;//页容量
    ifPage: Boolean = true;//是否分页
}

export { HttpResult, HttpSearch }