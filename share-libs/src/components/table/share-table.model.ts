import { ShareParaBtn } from "../button/share-button.model";

/**view-left居左  view-right居右  border 四周均有边框    simple-border  上下有边框    background-color   背景色交替*/
export type TableClassName = "border" | "simple-border" | "background-color" | "view-left" | 'view-right' | 'view-center';
/**view-left居左  view-right居右  border 四周均有边框  underline 下划线  */
export type TdClassName = "view-left" | 'view-right' | 'view-center' | 'underline' | 'color-blue';
/**check选框 serial序号 tag有背景色的小方块 dot带圆点 btn按钮数组 rule-text需要转换的文本 expend展开*/
export type TdType = 'check' | 'serial' | "rule-tags" | "rule-dots" | 'rule-text' | 'rule-btns' | "expend";
export type TagType = 'green' | 'danger' | "blue" | 'orange' | "pink";
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
export type DotType = TagType;
export type TagRules = TagRule[];
export type DotRules = DotRule[];
export type BtnRules = ShareParaBtn[]
export class TableData {
    [key: string]: any;
    /**按钮组(确定不会出现同类型的td按钮组时使用)*/
    _ruleBtns?: ShareParaBtn[];
    /**按钮组(挂在到数据后之后的变更检测将不会再执行方法) 优先级高 */
    _ruleBtnKey?: { [key: string]: ShareParaBtn[] };
    /**Tag组(不会出现同类型时使用)*/
    _ruleTags?: TagRules;
    /**Tag组 优先级高(有出现同类型时使用)*/
    _ruleTagKey?: { [key: string]: TagRules };
    /**Dot组(不会出现同类型时使用)*/
    _ruleDots?: DotRules;
    /**Dot组 优先级高(有同类型时使用)*/
    _ruleDotKey?: { [key: string]: DotRules };
    /**Text组(不会出现同类型时使用)*/
    _ruleText?: string;
    /**Text组 优先级高(有同类型时使用)*/
    _ruleTextKey?: { [key: string]: string };
}
/**通过泛型获得数据类型T */
export interface TableItem<T extends TableData = any> {
    /**表头名称  */
    title?: string;
    /** 对应data中的key取值 */
    key?: string;
    /**宽度 */
    width?: number;
    /**宽度固定（全部为固定宽度但宽度总和小于表格宽度也会扩展） */
    widthFix?: number
    /**最小宽度 不设置最小为60px*/
    widthMin?: number;
    /**计算后的显示宽度 */
    _width?: number;
    /** 当列是否显示  只有设置为false才不显示*/
    ifShow?: boolean;
    /** 能否过滤掉该选列 只有设置为false才不能取消*/
    filterCan?: boolean;
    /** 是否在过滤选框隐藏*/
    filterHid?: boolean;
    /**该列的类型 */
    type?: TdType;
    /** td的export class view-left居左  view-right居右  is-sticky该列固定 */
    classNames?: TdClassName[];
    /** 列固定居左的距离（设置该距离后会固定列） */
    styckyLeft?: string;
    /**事件回调 */
    onClick?: (data: T, item: TableItem, datas: T[]) => any;
    /**Text类型规则 最好采用UtilTableRuleText生成 */
    ruleText?: (data: T, item: TableItem, datas: T[]) => string[];
    /**tag类型规则 最好采用UtilTableRuleTags生成 */
    ruleTags?: TagRules | ((data: T, item: TableItem, datas: T[]) => TagRules);
    /**dot类型规则 最好采用UtilTableRuleDots生成 */
    ruleDots?: DotRules | ((data: T, item: TableItem, datas: T[]) => DotRules);
    /**Text类型规则 */
    ruleBtns?: BtnRules | ((data: T, item: TableItem, datas: T[]) => BtnRules);
}

export class TableSelect {
    /** 当前操作改变的数据 */
    curChangeDatas: any[];
    /** 选中为 true  取消选中为false */
    changeFlag: boolean;
    /**所有选中的数据 */
    selectedDatas: any[];
    /**所有选中的数据唯一标识 */
    selectedUuids: string[];
    /**
     * @param flag 状态改变为选中（true）未选中（false）
     * @param changes 本次改变变动的数据
     * @param datas 现在所有选中的数据
     * @param uuids 所有选中的数据的唯一标识
     */
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
    /**综合多表头的 */
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