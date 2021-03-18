import { Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges } from "@angular/core";
import { ShareBaseSearch, ShareResult } from "share-libs/src/model";
import { ShareBaseService } from "share-libs/src/servers";
import { PaginationPage } from "../../pagination/share-pagination.model";
import { TableComponent } from "../table/share-table.component";
import { MultiAllItems, MultiHeadItem, SharePage, TableItem, TableMultiItem, TableSelect } from "../share-table.model";

@Component({
    selector: 'share-table-multi-head',
    templateUrl: './table-multi-head.component.html',
    styleUrls: ['./table-multi-head.component.less']
})
export class TableMultiHeadComponent extends TableComponent implements OnInit {
    constructor(http: ShareBaseService, el: ElementRef) {
        super(http, el);
    }
    @Input() inAllDatas: any[] = [
        { "id": "bbd0d97c-1e32-4c48-b4b0-761d4328d261", "aidsTableCode": "1716.1", "aidsName": "501号灯船实体AIS航标", "locationAttr": "01", "typeCode": "0303", "aidsType": "实体AIS航标", "functionCode": "17", "functionName": "未定义航标类型", "position": "35°53’13.9” N 120°18’50.3”E", "location": "超大型船舶航道", "lightId": "994131628", "lightRange": "01", "manageProperty": "公用", "ownerUnitName": "青岛航标处", "authorityUnitName": "青岛航标处", "usageCode": "01", "usageName": "使用中", "levels": "level_4", },
        { "id": "475ffda2-4e9e-44dc-a547-af263e62f8bf", "aidsTableCode": "1716.13", "aidsName": "青岛港507号实体AIS航标", "locationAttr": "01", "typeCode": "0303", "aidsType": "实体AIS航标", "functionCode": "06", "functionName": "右侧标", "position": "35°55’44.2” N 120°20’37.3”E", "location": "超大型船舶航道", "lightId": "994131630", "lightRange": "01", "manageProperty": "公用", "ownerUnitName": "青岛航标处", "authorityUnitName": "青岛航标处", "usageCode": "01", "usageName": "使用中", "levels": "level_4", },
        { "id": "04089f42-0e1c-4fc8-8b8a-eb21d1141a20", "aidsTableCode": "1716.15", "aidsName": "青岛港511号实体AIS航标", "locationAttr": "01", "typeCode": "0303", "aidsType": "实体AIS航标", "functionCode": "06", "functionName": "右侧标", "position": "35°57’30.3” N 120°21’55.4”E", "location": "超大型船舶航道", "lightId": "994131632", "lightRange": "01", "manageProperty": "公用", "ownerUnitName": "青岛航标处", "authorityUnitName": "青岛航标处", "usageCode": "01", "usageName": "使用中", "levels": "level_4", },
        { "id": "d86adb59-d180-49ef-8d2b-3bd2aa767bcf", "aidsTableCode": "1716.16", "aidsName": "青岛港512号实体AIS航标", "locationAttr": "01", "typeCode": "0303", "aidsType": "实体AIS航标", "functionCode": "05", "functionName": "左侧标", "position": "35°58’10.0” N 120°20’27.9”E", "location": "超大型船舶航道", "lightId": "994131633", "lightRange": "01", "manageProperty": "公用", "ownerUnitName": "青岛航标处", "authorityUnitName": "青岛航标处", "usageCode": "01", "usageName": "使用中", "levels": "level_4", },
        { "id": "8043bd09-1f11-4a2c-8ad2-06733704b52f", "aidsTableCode": "1716.2", "aidsName": "青岛港517号实体AIS航标", "locationAttr": "01", "typeCode": "0303", "aidsType": "实体AIS航标", "functionCode": "06", "functionName": "右侧标", "position": "36°0’1.4” N 120°20’31.9”E", "location": "超大型船舶航道", "lightId": "994131634", "lightRange": "01", "manageProperty": "公用", "ownerUnitName": "青岛航标处", "authorityUnitName": "青岛航标处", "usageCode": "01", "usageName": "使用中", "levels": "level_4", },
        { "id": "b3ef79fa-2627-4d9a-8349-85fa280a1f2d", "aidsTableCode": "1716.21", "aidsName": "青岛港518号灯船实体AIS航标", "locationAttr": "01", "typeCode": "0303", "aidsType": "实体AIS航标", "functionCode": "17", "functionName": "未定义航标类型", "position": "36°0’9.0” N 120°19’57.2”E", "location": "超大型船舶航道", "lightId": "994131635", "lightRange": "01", "manageProperty": "公用", "ownerUnitName": "青岛航标处", "authorityUnitName": "青岛航标处", "usageCode": "01", "usageName": "使用中", "levels": "level_4", },
        { "id": "8a3af8bb-63be-483b-adf3-511553ff6f91", "aidsTableCode": "1716.22", "aidsName": "青岛港20号实体AIS航标", "locationAttr": "01", "typeCode": "0303", "aidsType": "实体AIS航标", "functionCode": "05", "functionName": "左侧标", "position": "36°1’27.7” N 120°16’28.9”E", "location": "青岛港港内主航道", "lightId": "994131603", "lightRange": "01", "manageProperty": "公用", "ownerUnitName": "青岛航标处", "authorityUnitName": "青岛航标处", "usageCode": "01", "usageName": "使用中", "levels": "level_4", },
        { "id": "04ffb140-d9c0-4224-a262-48cb6e6713d6", "aidsTableCode": "", "aidsName": "成山头RBN-DGPS台", "locationAttr": "01", "typeCode": "0306", "aidsType": "RBN-DGPS台站", "position": "37°23’50.8” N 122°40’50.9”E", "location": "", "lightId": "", "lightRange": "200.0", "manageProperty": "公用", "ownerUnitName": "烟台航标处", "authorityUnitName": "烟台航标处", "usageCode": "01", "usageName": "使用中", "remarks": "", "levels": "level_6", },
        { "id": "11601696-a82c-4a9d-95c4-bf4bc648e3f3", "aidsTableCode": "", "aidsName": "北塘RBN-DGPS台站", "locationAttr": "01", "typeCode": "0306", "aidsType": "RBN-DGPS台站", "position": "38°50’11.6” N 117°30’17.5”E", "location": "天津港", "lightId": "608、609", "lightHeight": 300, "lightRange": "200.0", "manageProperty": "公用", "ownerUnitName": "天津航标处", "authorityUnitName": "天津航标处", "usageCode": "01", "usageName": "使用中", "remarks": "", "levels": "level_6", },
        { "id": "450f6e61-7dd2-405e-b964-bd40de5994fc", "aidsTableCode": "", "aidsName": "大三山岛RBN-DGPS台站", "locationAttr": "01", "typeCode": "0306", "aidsType": "RBN-DGPS台站", "position": "38°51’51.3” N 121°49’32.0”E", "location": "", "lightId": "", "lightHeight": 160, "lightRange": "200.0", "manageProperty": "公用", "ownerUnitName": "大连航标处", "authorityUnitName": "大连航标处", "usageCode": "01", "usageName": "使用中", "remarks": "", "levels": "level_6", },
        { "id": "5e811bb8-882e-486a-93ab-b9d7e6d5e138", "aidsTableCode": "", "aidsName": "营口RBN/DGPS台站", "locationAttr": "01", "typeCode": "0306", "aidsType": "RBN-DGPS台站", "position": "40°17’28.7” N 122°6’41.1”E", "location": "鲅鱼圈港区主航道", "lightId": "610/611", "lightHeight": 300, "lightRange": "200.0", "manageProperty": "公用", "ownerUnitName": "营口航标处", "authorityUnitName": "营口航标处", "usageCode": "01", "usageName": "使用中", "remarks": "", "levels": "level_6", },
        { "id": "6a73e6f7-a667-4a44-a11f-1f36cc3544f7", "aidsTableCode": "", "aidsName": "老铁山RBN-DGPS台站", "locationAttr": "01", "typeCode": "0306", "aidsType": "RBN-DGPS台站", "position": "38°43’38.3” N 121°8’5.3”E", "location": "", "lightId": "", "lightHeight": 160, "lightRange": "200.0", "manageProperty": "公用", "ownerUnitName": "大连航标处", "authorityUnitName": "大连航标处", "usageCode": "01", "usageName": "使用中", "remarks": "", "levels": "level_6", },
        { "id": "9882b381-b6fc-4207-a184-ca4f43e73355", "aidsTableCode": "", "aidsName": "王家麦岛RBN-DGPS台站", "locationAttr": "01", "typeCode": "0306", "aidsType": "RBN-DGPS台站", "position": "36°4’22.8” N 120°26’25.8”E", "location": "", "lightId": "RBN A1", "lightHeight": 200, "lightRange": "", "manageProperty": "公用", "ownerUnitName": "青岛航标处", "authorityUnitName": "青岛航标处", "usageCode": "01", "usageName": "使用中", "remarks": "", "levels": "level_6", },
        { "id": "d3c2995b-e555-46ea-976a-ba91908ab98f", "aidsTableCode": "", "aidsName": "秦皇岛RBN-DGPS台站", "locationAttr": "01", "typeCode": "0306", "aidsType": "RBN-DGPS台站", "levelCode": "01A", "levelName": "一级A等", "position": "39°54’41.0” N 119°37’0.7”E", "location": "秦皇岛主航道", "lightId": "", "lightHeight": 200, "lightRange": "", "manageProperty": "公用", "ownerUnitName": "秦皇岛航标处", "authorityUnitName": "秦皇岛航标处", "usageCode": "01", "usageName": "使用中", "remarks": "", "levels": "level_6", },
        { "id": "0151cb3f-6ef0-4a07-b08c-5074f1814c5b", "aidsTableCode": "", "aidsName": "上古林导航台", "locationAttr": "01", "typeCode": "0307", "aidsType": "导航台", "position": "38°50’11.6” N 117°30’17.5”E", "location": "滨州港", "lightRange": "", "manageProperty": "公用", "ownerUnitName": "天津航标处", "authorityUnitName": "天津航标处", "usageCode": "01", "usageName": "使用中", "remarks": "", "levels": "level_7", }];//表格数据
    @Input() inSelectedDatas: Array<any> = [{ id: "d86adb59-d180-49ef-8d2b-3bd2aa767bcf" }, { id: "0151cb3f-6ef0-4a07-b08c-5074f1814c5b" },];//选中的数据
    @Input() inDisableDatas: Array<any> = [
        { id: "d86adb59-d180-49ef-8d2b-3bd2aa767bcf" },
        { id: "475ffda2-4e9e-44dc-a547-af263e62f8bf" }
    ];//禁用数据
    @Input() inAllItems: MultiAllItems = {
        "0307": [
            { title: '', type: 'check', width: 60, styckyLeft: '0px', keyCode: '1001' },
            { title: '序号0307', type: 'serial', property: 'serial', width: 60, styckyLeft: '62px', keyCode: '1002' },
            { title: 'aidsName', property: 'aidsName', width: 150, keyCode: '1003' },
            { title: 'locationAttr', property: 'locationAttr', keyCode: '1004', },
            { title: 'typeCode', property: 'typeCode', width: 200, keyCode: '1005' },
            { title: 'aidsType', property: 'aidsType', width: 180, keyCode: '1006' },
            { title: 'position', property: 'position', width: 180, keyCode: '1007' },
            { title: 'location', property: 'location', width: 180, keyCode: '1008' },
            { title: 'manageProperty', property: 'manageProperty', keyCode: '1009', },
            { title: 'ownerUnitName', property: 'ownerUnitName', keyCode: '1010', type: "expend", width: 180 },
        ],
        "0303": [
            { title: '', type: 'check', width: 60, keyCode: '1001', styckyLeft: '0px' },
            { title: '序号0303', type: 'serial', width: 60, keyCode: '1002', styckyLeft: '62px' },
            { title: 'aidsName', property: 'aidsName', keyCode: '1003', width: 150 },
            { title: 'locationAttr', property: 'locationAttr', keyCode: '1004' },
            { title: 'typeCode', property: 'typeCode', keyCode: '1005', width: 200 },
            { title: 'aidsType', property: 'aidsType', keyCode: '1006', width: 180 },
            { title: 'position', property: 'position', keyCode: '1007', width: 180 },
            { title: 'location', property: 'location', keyCode: '1008', width: 180 },
            { title: 'manageProperty', property: 'manageProperty', keyCode: '1010', type: "expend", width: 100 },
        ],
        "0306": [
            { title: '', type: 'check', width: 60, keyCode: '1001', styckyLeft: '0px' },
            { title: '序号0306', type: 'serial', width: 60, keyCode: '1002', styckyLeft: '62px' },
            { title: 'aidsName', property: 'aidsName', keyCode: '1003', width: 150 },
            { title: 'locationAttr', property: 'locationAttr', keyCode: '1004', width: 90 },
            { title: 'typeCode', property: 'typeCode', keyCode: '1005', width: 200 },
            { title: 'aidsType', property: 'aidsType', keyCode: '1006', width: 180 },
            { title: 'position', property: 'position', keyCode: '1007', width: 180 },
            { title: 'location', property: 'location', keyCode: '1009', type: "expend", width: 180 },
        ]
    };//表格对应数据value的表头的数据
    @Input() inItemKey: string = "typeCode";//从数据中获取表头时的关键字
    tableMultiItems: Array<MultiHeadItem> = [];//html页面使用的数据(含表头和数据)
    page: SharePage = new SharePage();
    searchItem: ShareBaseSearch = new ShareBaseSearch();
    pageRecordOptions: number[] = [15, 20, 30, 50];
    @Output() onSelectChange: EventEmitter<TableSelect> = new EventEmitter();

    onChanges(changes: SimpleChanges) {}
    superInit() { }
    superGetListAfter() { this.getTableMultiItems(); };
    getTableMultiItems() {
        let datas = this.inAllDatas, items = this.inAllItems, key = this.inItemKey, tableMultiItems: Array<MultiHeadItem> = [],
            values = [], valueData = {}, heads = [];
        datas.forEach(e => {
            let value = e[key];//该条数据使用的表头的key值
            let datas = valueData[value] = valueData[value] || [];//同一表头的数据归为一组Array
            datas.push(e);
            if (!values.includes(value)) {//判断该表头是否已经存储
                values.push(value);
                let item = Object.assign([], items[value]); //要使用的表头
                heads.push(item);
                tableMultiItems.push({
                    heads: item,
                    datas
                })
            }
        })
        this.tableMultiItems = tableMultiItems;
        this.setDataSerial()
        this.setMultiItems(heads);
    }

    setDataSerial() {
        let index = (this.page.currentPage - 1) * this.page.pageRecord + 1;
        this.tableMultiItems.forEach(e => {
            e.datas.forEach(e => {
                e.serial = index++;
            })
        })
    }

    setMultiItems(heads: Array<TableMultiItem[]>) {
        let len = heads.length;
        if (len > 1) {
            this.configHeadItems(heads)
        }
        this.setHeadItemWidth(heads);
    }

    configHeadItems(heads: Array<TableMultiItem[]>) {
        let maxLength = 0;
        heads.forEach(e => maxLength = maxLength > e.length ? maxLength : e.length);//得到最多表头
        //将第一个表头补充到最大长度
        let head = heads[0];
        for (let j = 0; j < maxLength; j++) {
            head[j] || head.push({ title: '', keyCode: '' });
        }
        //调整表头顺序，以第上一个为准
        let len = heads.length - 1
        for (let i = 0; i < len; i++) {
            let cur = heads[i], next = heads[i + 1];
            let allCode = cur.map(e => e.keyCode);
            for (let j = 0; j < maxLength; j++) {
                let curCode = cur[j].keyCode;
                let index = next.findIndex((e, i) => e.keyCode == curCode && i >= j);
                if (index < 0) {
                    index = next.findIndex((e, i) => !allCode.includes(e.keyCode) && i >= j);
                    if (index < 0) {
                        next.push({ title: '', keyCode: '' });
                        continue;
                    }
                }
                this.swapHeadItem(next, index, j)
            }
        }
    }

    swapHeadItem(data, index, j) {
        let item = data[index];
        data[index] = data[j];
        data[j] = item;
    }

    setHeadItemWidth(heads: Array<TableMultiItem[]>) {
        let allWith = 0, head = heads[0];
        head.forEach(e => e.width && (allWith += e.width) || e.widthMin && (allWith += e.widthMin) || (allWith += 60))
        let tableWidth = this.nativeEl.querySelector('.share-table').clientWidth;
        if (tableWidth <= allWith) {
            for (let i = 0, len = heads[0].length; i < len; i++) {
                let width, widthMin;
                for (let j = 0, len = heads.length; j < len && !width; j++) {
                    width = heads[j][i].width;
                    widthMin = widthMin || heads[j][i].widthMin;
                }
                for (let j = 0, len = heads.length; j < len; j++) {
                    heads[j][i].width = width;
                    heads[j][i].widthMin = widthMin;
                }
            }
            Promise.resolve().then(res => {
                head.forEach(e => e.width || (e.widthMin && (e.width = e.widthMin)) || (e.width = 60))
            })
        } else {
            for (let i = 0, len = heads[0].length; i < len; i++) {
                for (let j = 0, l = heads.length; j < l; j++) {
                    heads[j][i].width = heads[0][i].width;
                }
            }
        }
    }
}

