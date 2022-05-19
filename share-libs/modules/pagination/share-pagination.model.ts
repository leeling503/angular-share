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
/**分页器类型 */
export type TypePagination = "simple" | "default" | 'all';
/**分页器大小 */
export type SizePagination = "big" | "normal" | 'small';
/**分页器类型 */
export type TypePaginationInfo = "none" | "simple" | "normal" | "detail";
/**分页器跳转类型 */
export type TypeJump = "first" | "prev" | "next" | "last" | "prev5" | "next5" | 'num';