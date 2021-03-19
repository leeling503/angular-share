export type TableClassName = "border" | "simple-border" | "background-color";
export interface TableItem {
    title: string;//表头
    width?: number;//宽度
    widthMin?: number; //最小宽度
    type?: tdType;//决定td的类型
    property?: string;//对应data中的key取值
    tagRule?: TagRule[];//tag类型的规则
    classNames?: string;//td的class     view-left居左   view-right居右    is-sticky该列固定
    styckyLeft?: string;//列固定居左的距离（设置该距离后会固定列）;
    ifShow?: boolean;//当列是否显示
}

export interface TagRule {
    tagType: string;//决定tag颜色
    value: string | number;//后台传过来的值
    text: string | number; //值对应的显示的字
}

type tdType = 'check' | 'serial' | "tag" | "expend";

export class SharePage {
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

export class TableSelect {
    curChangeDatas: any[];
    changeFlag: boolean;//选中为 true  取消选中为false
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
    keyCode: string;//多表头中keyCode相同的 title会在同一列
}
//对表头html使用 ，heads表示表头 ， datas表示对应该表头的数据
export interface MultiHeadItem {
    heads: TableMultiItem[];
    datas: any[];
}

export interface MultiAllItems {
    [key: string]: TableMultiItem[]
}