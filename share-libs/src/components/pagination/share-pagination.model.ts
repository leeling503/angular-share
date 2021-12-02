export interface PaginationPage {
    /**当前页 */
    currentPage?: number;
    /**结束行数 */
    endRow?: number;
    /**总页数 */
    pageCount?: number;
    /**每页几条 */
    pageRecord?: number;
    /**总条数 */
    recordCount?: number;
    /**起始行数 */
    startRow?: number;
    result?: any[];
    pageOne?: number;
    pageTwo?: number;
}

export type PaginationType = "simple" | "default" | 'all';
export type PaginationSize = "big" | "normal" | 'small';
export type PaginationInfoType = "none" | "simple" | "normal" | "detail";
export type JumpType = "first" | "prev" | "next" | "last" | "prev5" | "next5" | 'num';