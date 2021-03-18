export class SharePage{
    maxSize?: number = 5;//分页按钮个数
    numPages?: number = 1;//当总页数改变时触发，$ event：number等于总页数
    currentPage?: number = 1;//当前页
    pageRecord?: number = 15;//页容量
    recordCount?: number = 0;//总数
    pageCount?: number = 0;//总页数
    pageSize?: string;// 适应getMarkPaging 这个接口
    result?: any;
    datas?: any;
}