export class ShareBaseSearch{
    currentPage?: number = 1;//当前页
    pageRecord?: number = 15;//页容量
    ifPage?: Boolean = true;//是否分页
    orderSql?: string;// 排序
}