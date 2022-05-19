interface HttpResult {
    /** 0 表示成功  1表示失败或异常 */
    rlt?: 0 | 1;
    /**错误信息或者后台返回的信息提示 */
    info?: string;
    /**是否属于异常 */
    error?: boolean;
    /**数据 */
    datas?: any;
}

class HttpSearch {
    currentPage: number = 1;//当前页
    pageRecord: number = 15;//页容量
    ifPage: boolean = true;//是否分页
}

export { HttpResult, HttpSearch }