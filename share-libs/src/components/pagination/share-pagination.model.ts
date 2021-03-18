export class PaginationPage {
    currentPage: number = 1;//当前页
    endRow: number;//结束行数
    pageCount: number;//页数
    pageRecord: number;//每页几条
    recordCount: number = 0;//总条数
    startRow: number;//起始行数
    result: any[];
    pageOne: number;
    pageTwo: number;
}

export type PaginationType = "simple" | "default" | 'all';
export type PaginationSize = "big" | "normal" | 'small';
export type PaginationInfoType = "none" | "simple" | "normal" | "detail";
export type JumpType = "first" | "prev" | "next" | "last" | "prev5" | "next5" | 'num';