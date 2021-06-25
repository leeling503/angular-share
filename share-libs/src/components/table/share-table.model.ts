import { UtilTableRuleTags } from "share-libs/src/utils";

/**view-left居左  view-right居右  border 四周均有边框    simple-border  上下有边框    background-color   背景色交替*/
export type TableClassName = "border" | "simple-border" | "background-color" | "view-left" | 'view-right' | 'view-center';
/**view-left居左  view-right居右  border 四周均有边框  underline 下划线  */
export type TdClassName = "view-left" | 'view-right' | 'view-center' | 'underline' | 'color-blue';
/**通过泛型获得数据类型T */
export interface TableItem<T = any> {
    /**表头名称  */
    title: string;
    /**宽度 */
    width?: number;
    /**宽度固定（不会缩放，除非是最后一行） */
    widthFix?: number
    /**最小宽度 不设置最小为60px*/
    widthMin?: number;
    /**计算后的显示宽度 */
    _width?: number;
    /**该列的类型 */
    type?: TdType;
    /** 对应data中的key取值 */
    key?: string;
    /** td的export class view-left居左  view-right居右  is-sticky该列固定 */
    classNames?: TdClassName[];
    /** 列固定居左的距离（设置该距离后会固定列） */
    styckyLeft?: string;
    /** 当列是否显示  只有设置为false才不显示*/
    ifShow?: boolean;
    /** 能否过滤掉该选列 只有设置为false才不能取消*/
    canFilter?: boolean;
    /**事件回调 */
    onClick?: (data: T, item: TableItem) => any;
    /**tag类型规则 最好采用UtilTableRuleTags生成 */
    ruleTags?: TagRules;
    /**dot类型规则 最好采用UtilTableRuleDots生成 */
    ruleDots?: DotRules;
    /**Text类型规则 最好采用UtilTableRuleText生成 */
    ruleText?: object;
    /**Text类型规则 */
    ruleBtns?: (data: T) => BtnRules<T> | BtnRules<T>;
}
/**check选框 serial序号 tag有背景色的小方块 dot带圆点 btn按钮数组 rule-text需要转换的文本 expend展开*/
export type TdType = 'check' | 'serial' | "rule-tag" | "rule-dot" | 'rule-text' | 'rule-btns' | "expend";
export type TagType = 'green' | 'danger' | "blue" | 'orange' | "pink";
export type DotType = TagType;
export type TagRules = { [key: string]: TagRule }
export type DotRules = { [key: string]: DotRule }
export type BtnRules<T = any> = BtnRule<T>[]
export interface TagRule {
    /**决定tag颜色 */
    class: TagType;
    /**后台传过来的值*/
    value?: string | number;//后台传过来的值
    /** 显示的字*/
    text: string | number;
    /** 字体颜色*/
    color?: string;
}
export interface DotRule extends TagRule { };
export interface BtnRule<T = any> {
    text?: string;
    /**图标 */
    icon?: string;
    /**点击事件 */
    onClick?: (data: T, item, datas?: T[]) => void
}

export class SharePage {
    numPages?: number = 1;//当总页数改变时触发，$ event：number等于总页数
    currentPage?: number = 1;//当前页
    pageRecord?: number = 15;//页容量
    recordCount?: number = 0;//总数
    pageCount?: number = 0;//总页数
    pageSize?: string;// 适应getMarkPaging 这个接口
    result?: any;
    datas?: any;
}

export class TableSelect {
    /** 当前操作改变的数据 */
    curChangeDatas: any[];
    /** 选中为 true  取消选中为false */
    changeFlag: boolean;
    /**所有选中的数据 */
    selectedDatas: any[];
    selectedUuids: string[];
    constructor(flag: boolean, changes: any[], datas, uuids) {
        this.curChangeDatas = changes;
        this.changeFlag = flag;
        this.selectedDatas = datas;
        this.selectedUuids = uuids;
    }
}

export interface TableMultiItem extends TableItem {
    checkFlag?: boolean;
    /** 多表头中keyCode相同的 title会在同一列 */
    keyCode: string;
    /**计算后同列的keycode */
    _keyCode?: string;
    /**多表头同列所有th隐藏才被隐藏 */
    _ifShow?: boolean;
    _styckyLeft?: string;
}

//多表头html使用 ，heads表示表头 ， datas表示对应该表头的数据
export interface TableMultiHeadItem {
    /**表头信息 */
    heads: TableMultiItem[];
    /**表格数据 */
    datas: any[];
}

export interface TableMultiAllItems {
    [key: string]: TableMultiItem[]
}