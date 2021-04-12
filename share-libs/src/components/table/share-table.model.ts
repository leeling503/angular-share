export type TableClassName = "border" | "simple-border" | "background-color";
export interface TableItem {
    /**表头名称  */
    title: string;//
    /**宽度 */
    width?: number;//宽度 
    /**最小宽度 不设置最小为60px*/
    widthMin?: number;
    /**计算后的显示宽度 */
    _width?: number;
    /**该列的类型 */
    type?: TdType;
    /** 对应data中的key取值 */
    key?: string;
    /** td的class view-left居左  view-right居右  is-sticky该列固定 */
    classNames?: string;
    /** 列固定居左的距离（设置该距离后会固定列） */
    styckyLeft?: string;
    /** 当列是否显示  只有设置为false才不显示*/
    ifShow?: boolean;
    /** 能否过滤掉该选列 只有设置为false才不能取消*/
    canFilter?: boolean;
    /**text类型函数 */
    cbText?: (data: any, item: TableItem) => string;
    /**tag类型回调函数 */
    cbTag?: (data: any, item: TableItem) => TagRule;
    /**tag类型回调函数 */
    cbDot?: (data: any, item: TableItem) => DotRule;
}
/** 
 * 'check'  选款   'serial'  序号   "tag" 拥有背景色的小方块 
 */
type TdType = 'check' | 'serial' | "tag" | "dot" | 'text' | "expend";

type TagType = 'green' | 'danger' | "blue" | 'orange' | "pink";
type DotType = TagType;

export interface TagRules {
    [key: string]: TagRule
}
export interface DotRules {
    [key: string]: DotRule
}

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

export interface DotRule extends TagRule { }

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






export var CbUtileTagFun = function (data: any, item: TableItem, tags: TagRules, defualt?: TagRule): TagRule {
    let key = data[item.key];
    let tag = tags[key] || defualt || { value: '', text: '无数据', class: 'blue', color: '#FFF' };
    data['_tagText' + key] = tag.text;
    data['_tagClass' + key] = tag.class;
    data['_tagColor' + key] = tag.color || '#FFF';
    return tag;
}
export var CbUtileDotFun = function (data: any, item: TableItem, tags: DotRules, defualt?: DotRule): DotRule {
    let key = data[item.key];
    let tag = tags[key] || defualt || { value: '', text: '无数据', class: 'blue', color: '#333' };
    data['_dotText' + key] = tag.text;
    data['_dotClass' + key] = tag.class;
    data['_dotColor' + key] = tag.color || '#333';
    return tag;
}

export var CbUtileTextFun = function (data: any, item: TableItem) {
    let text = data["_textText" + item.key] = data[item.key]
    return text;
}
