import { Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges } from "@angular/core";
import { ShareBaseSearch } from "share-libs/src/models";
import { ShareBaseHttpService } from "share-libs/src/services";
import { TableComponent } from "../table/share-table.component";
import { MultiAllItems, MultiHeadItem, SharePage, TableItem, TableMultiItem, TableSelect } from "../share-table.model";

@Component({
    selector: 'share-table-multi-head',
    templateUrl: './table-multi-head.component.html',
    styleUrls: ['./table-multi-head.component.less']
})
export class TableMultiHeadComponent extends TableComponent implements OnInit {
    constructor(http: ShareBaseHttpService, el: ElementRef) {
        super(http, el);
    }
    /**表格数据 */
    @Input() inAllDatas: any[] = [
        { "id": "bbd0d97c-1e32-4c48-b4b0-761d4328d261", "aidsTableCode": "1716.1", "aidsName": "501号灯船实体AIS航标", "locationAttr": "01", "typeCode": "0303", "aidsType": "实体AIS航标", "functionCode": "17", "functionName": "未定义航标类型", "position": "35°53’13.9” N 120°18’50.3”E", "location": "超大型船舶航道", "lightId": "994131628", "lightRange": "01", "managekey": "公用", "ownerUnitName": "青岛航标处", "authorityUnitName": "青岛航标处", "usageCode": "01", "usageName": "使用中", "levels": "level_4", }, { "id": "0151cb3f-6ef0-4a07-b08c-5074f1814c5b", "aidsTableCode": "", "aidsName": "上古林导航台", "locationAttr": "01", "typeCode": "0307", "aidsType": "导航台", "position": "38°50’11.6” N 117°30’17.5”E", "location": "滨州港", "lightRange": "", "managekey": "公用", "ownerUnitName": "天津航标处", "authorityUnitName": "天津航标处", "usageCode": "01", "usageName": "使用中", "remarks": "", "levels": "level_7", }, { "id": "0151cb3f-6ef0-4a07-b08c-5074f1814c5b", "aidsTableCode": "", "aidsName": "上古林导航台", "locationAttr": "01", "typeCode": "0307", "aidsType": "导航台", "position": "38°50’11.6” N 117°30’17.5”E", "location": "滨州港", "lightRange": "", "managekey": "公用", "ownerUnitName": "天津航标处", "authorityUnitName": "天津航标处", "usageCode": "01", "usageName": "使用中", "remarks": "", "levels": "level_7", }, { "id": "0151cb3f-6ef0-4a07-b08c-5074f1814c5b", "aidsTableCode": "", "aidsName": "上古林导航台", "locationAttr": "01", "typeCode": "0307", "aidsType": "导航台", "position": "38°50’11.6” N 117°30’17.5”E", "location": "滨州港", "lightRange": "", "managekey": "公用", "ownerUnitName": "天津航标处", "authorityUnitName": "天津航标处", "usageCode": "01", "usageName": "使用中", "remarks": "", "levels": "level_7", },
        { "id": "475ffda2-4e9e-44dc-a547-af263e62f8bf", "aidsTableCode": "1716.13", "aidsName": "青岛港507号实体AIS航标", "locationAttr": "01", "typeCode": "0303", "aidsType": "实体AIS航标", "functionCode": "06", "functionName": "右侧标", "position": "35°55’44.2” N 120°20’37.3”E", "location": "超大型船舶航道", "lightId": "994131630", "lightRange": "01", "managekey": "公用", "ownerUnitName": "青岛航标处", "authorityUnitName": "青岛航标处", "usageCode": "01", "usageName": "使用中", "levels": "level_4", },
        { "id": "04089f42-0e1c-4fc8-8b8a-eb21d1141a20", "aidsTableCode": "1716.15", "aidsName": "青岛港511号实体AIS航标", "locationAttr": "01", "typeCode": "0303", "aidsType": "实体AIS航标", "functionCode": "06", "functionName": "右侧标", "position": "35°57’30.3” N 120°21’55.4”E", "location": "超大型船舶航道", "lightId": "994131632", "lightRange": "01", "managekey": "公用", "ownerUnitName": "青岛航标处", "authorityUnitName": "青岛航标处", "usageCode": "01", "usageName": "使用中", "levels": "level_4", },
        { "id": "d86adb59-d180-49ef-8d2b-3bd2aa767bcf", "aidsTableCode": "1716.16", "aidsName": "青岛港512号实体AIS航标", "locationAttr": "01", "typeCode": "0303", "aidsType": "实体AIS航标", "functionCode": "05", "functionName": "左侧标", "position": "35°58’10.0” N 120°20’27.9”E", "location": "超大型船舶航道", "lightId": "994131633", "lightRange": "01", "managekey": "公用", "ownerUnitName": "青岛航标处", "authorityUnitName": "青岛航标处", "usageCode": "01", "usageName": "使用中", "levels": "level_4", },
        { "id": "8043bd09-1f11-4a2c-8ad2-06733704b52f", "aidsTableCode": "1716.2", "aidsName": "青岛港517号实体AIS航标", "locationAttr": "01", "typeCode": "0303", "aidsType": "实体AIS航标", "functionCode": "06", "functionName": "右侧标", "position": "36°0’1.4” N 120°20’31.9”E", "location": "超大型船舶航道", "lightId": "994131634", "lightRange": "01", "managekey": "公用", "ownerUnitName": "青岛航标处", "authorityUnitName": "青岛航标处", "usageCode": "01", "usageName": "使用中", "levels": "level_4", },
        { "id": "b3ef79fa-2627-4d9a-8349-85fa280a1f2d", "aidsTableCode": "1716.21", "aidsName": "青岛港518号灯船实体AIS航标", "locationAttr": "01", "typeCode": "0303", "aidsType": "实体AIS航标", "functionCode": "17", "functionName": "未定义航标类型", "position": "36°0’9.0” N 120°19’57.2”E", "location": "超大型船舶航道", "lightId": "994131635", "lightRange": "01", "managekey": "公用", "ownerUnitName": "青岛航标处", "authorityUnitName": "青岛航标处", "usageCode": "01", "usageName": "使用中", "levels": "level_4", },
        { "id": "8a3af8bb-63be-483b-adf3-511553ff6f91", "aidsTableCode": "1716.22", "aidsName": "青岛港20号实体AIS航标", "locationAttr": "01", "typeCode": "0303", "aidsType": "实体AIS航标", "functionCode": "05", "functionName": "左侧标", "position": "36°1’27.7” N 120°16’28.9”E", "location": "青岛港港内主航道", "lightId": "994131603", "lightRange": "01", "managekey": "公用", "ownerUnitName": "青岛航标处", "authorityUnitName": "青岛航标处", "usageCode": "01", "usageName": "使用中", "levels": "level_4", },
        { "id": "04ffb140-d9c0-4224-a262-48cb6e6713d6", "aidsTableCode": "", "aidsName": "成山头RBN-DGPS台", "locationAttr": "01", "typeCode": "0306", "aidsType": "RBN-DGPS台站", "position": "37°23’50.8” N 122°40’50.9”E", "location": "", "lightId": "", "lightRange": "200.0", "managekey": "公用", "ownerUnitName": "烟台航标处", "authorityUnitName": "烟台航标处", "usageCode": "01", "usageName": "使用中", "remarks": "", "levels": "level_6", },
        { "id": "11601696-a82c-4a9d-95c4-bf4bc648e3f3", "aidsTableCode": "", "aidsName": "北塘RBN-DGPS台站", "locationAttr": "01", "typeCode": "0306", "aidsType": "RBN-DGPS台站", "position": "38°50’11.6” N 117°30’17.5”E", "location": "天津港", "lightId": "608、609", "lightHeight": 300, "lightRange": "200.0", "managekey": "公用", "ownerUnitName": "天津航标处", "authorityUnitName": "天津航标处", "usageCode": "01", "usageName": "使用中", "remarks": "", "levels": "level_6", },
        { "id": "450f6e61-7dd2-405e-b964-bd40de5994fc", "aidsTableCode": "", "aidsName": "大三山岛RBN-DGPS台站", "locationAttr": "01", "typeCode": "0306", "aidsType": "RBN-DGPS台站", "position": "38°51’51.3” N 121°49’32.0”E", "location": "", "lightId": "", "lightHeight": 160, "lightRange": "200.0", "managekey": "公用", "ownerUnitName": "大连航标处", "authorityUnitName": "大连航标处", "usageCode": "01", "usageName": "使用中", "remarks": "", "levels": "level_6", },
        { "id": "5e811bb8-882e-486a-93ab-b9d7e6d5e138", "aidsTableCode": "", "aidsName": "营口RBN/DGPS台站", "locationAttr": "01", "typeCode": "0306", "aidsType": "RBN-DGPS台站", "position": "40°17’28.7” N 122°6’41.1”E", "location": "鲅鱼圈港区主航道", "lightId": "610/611", "lightHeight": 300, "lightRange": "200.0", "managekey": "公用", "ownerUnitName": "营口航标处", "authorityUnitName": "营口航标处", "usageCode": "01", "usageName": "使用中", "remarks": "", "levels": "level_6", },
        { "id": "6a73e6f7-a667-4a44-a11f-1f36cc3544f7", "aidsTableCode": "", "aidsName": "老铁山RBN-DGPS台站", "locationAttr": "01", "typeCode": "0306", "aidsType": "RBN-DGPS台站", "position": "38°43’38.3” N 121°8’5.3”E", "location": "", "lightId": "", "lightHeight": 160, "lightRange": "200.0", "managekey": "公用", "ownerUnitName": "大连航标处", "authorityUnitName": "大连航标处", "usageCode": "01", "usageName": "使用中", "remarks": "", "levels": "level_6", },
        { "id": "9882b381-b6fc-4207-a184-ca4f43e73355", "aidsTableCode": "", "aidsName": "王家麦岛RBN-DGPS台站", "locationAttr": "01", "typeCode": "0306", "aidsType": "RBN-DGPS台站", "position": "36°4’22.8” N 120°26’25.8”E", "location": "", "lightId": "RBN A1", "lightHeight": 200, "lightRange": "", "managekey": "公用", "ownerUnitName": "青岛航标处", "authorityUnitName": "青岛航标处", "usageCode": "01", "usageName": "使用中", "remarks": "", "levels": "level_6", },
        { "id": "d3c2995b-e555-46ea-976a-ba91908ab98f", "aidsTableCode": "", "aidsName": "秦皇岛RBN-DGPS台站", "locationAttr": "01", "typeCode": "0306", "aidsType": "RBN-DGPS台站", "levelCode": "01A", "levelName": "一级A等", "position": "39°54’41.0” N 119°37’0.7”E", "location": "秦皇岛主航道", "lightId": "", "lightHeight": 200, "lightRange": "", "managekey": "公用", "ownerUnitName": "秦皇岛航标处", "authorityUnitName": "秦皇岛航标处", "usageCode": "01", "usageName": "使用中", "remarks": "", "levels": "level_6", },
        { "id": "0151cb3f-6ef0-4a07-b08c-5074f1814c5b", "aidsTableCode": "", "aidsName": "上古林导航台", "locationAttr": "01", "typeCode": "0307", "aidsType": "导航台", "position": "38°50’11.6” N 117°30’17.5”E", "location": "滨州港", "lightRange": "", "managekey": "公用", "ownerUnitName": "天津航标处", "authorityUnitName": "天津航标处", "usageCode": "01", "usageName": "使用中", "remarks": "", "levels": "level_7", },
        { "id": "475ffda2-4e9e-44dc-a547-af263e62f8bf", "aidsTableCode": "1716.13", "aidsName": "青岛港507号实体AIS航标", "locationAttr": "01", "typeCode": "0303", "aidsType": "实体AIS航标", "functionCode": "06", "functionName": "右侧标", "position": "35°55’44.2” N 120°20’37.3”E", "location": "超大型船舶航道", "lightId": "994131630", "lightRange": "01", "managekey": "公用", "ownerUnitName": "青岛航标处", "authorityUnitName": "青岛航标处", "usageCode": "01", "usageName": "使用中", "levels": "level_4", },
        { "id": "04089f42-0e1c-4fc8-8b8a-eb21d1141a20", "aidsTableCode": "1716.15", "aidsName": "青岛港511号实体AIS航标", "locationAttr": "01", "typeCode": "0303", "aidsType": "实体AIS航标", "functionCode": "06", "functionName": "右侧标", "position": "35°57’30.3” N 120°21’55.4”E", "location": "超大型船舶航道", "lightId": "994131632", "lightRange": "01", "managekey": "公用", "ownerUnitName": "青岛航标处", "authorityUnitName": "青岛航标处", "usageCode": "01", "usageName": "使用中", "levels": "level_4", },
        { "id": "d86adb59-d180-49ef-8d2b-3bd2aa767bcf", "aidsTableCode": "1716.16", "aidsName": "青岛港512号实体AIS航标", "locationAttr": "01", "typeCode": "0303", "aidsType": "实体AIS航标", "functionCode": "05", "functionName": "左侧标", "position": "35°58’10.0” N 120°20’27.9”E", "location": "超大型船舶航道", "lightId": "994131633", "lightRange": "01", "managekey": "公用", "ownerUnitName": "青岛航标处", "authorityUnitName": "青岛航标处", "usageCode": "01", "usageName": "使用中", "levels": "level_4", },
        { "id": "8043bd09-1f11-4a2c-8ad2-06733704b52f", "aidsTableCode": "1716.2", "aidsName": "青岛港517号实体AIS航标", "locationAttr": "01", "typeCode": "0303", "aidsType": "实体AIS航标", "functionCode": "06", "functionName": "右侧标", "position": "36°0’1.4” N 120°20’31.9”E", "location": "超大型船舶航道", "lightId": "994131634", "lightRange": "01", "managekey": "公用", "ownerUnitName": "青岛航标处", "authorityUnitName": "青岛航标处", "usageCode": "01", "usageName": "使用中", "levels": "level_4", },
        { "id": "b3ef79fa-2627-4d9a-8349-85fa280a1f2d", "aidsTableCode": "1716.21", "aidsName": "青岛港518号灯船实体AIS航标", "locationAttr": "01", "typeCode": "0303", "aidsType": "实体AIS航标", "functionCode": "17", "functionName": "未定义航标类型", "position": "36°0’9.0” N 120°19’57.2”E", "location": "超大型船舶航道", "lightId": "994131635", "lightRange": "01", "managekey": "公用", "ownerUnitName": "青岛航标处", "authorityUnitName": "青岛航标处", "usageCode": "01", "usageName": "使用中", "levels": "level_4", },
        { "id": "8a3af8bb-63be-483b-adf3-511553ff6f91", "aidsTableCode": "1716.22", "aidsName": "青岛港20号实体AIS航标", "locationAttr": "01", "typeCode": "0303", "aidsType": "实体AIS航标", "functionCode": "05", "functionName": "左侧标", "position": "36°1’27.7” N 120°16’28.9”E", "location": "青岛港港内主航道", "lightId": "994131603", "lightRange": "01", "managekey": "公用", "ownerUnitName": "青岛航标处", "authorityUnitName": "青岛航标处", "usageCode": "01", "usageName": "使用中", "levels": "level_4", },
        { "id": "04ffb140-d9c0-4224-a262-48cb6e6713d6", "aidsTableCode": "", "aidsName": "成山头RBN-DGPS台", "locationAttr": "01", "typeCode": "0306", "aidsType": "RBN-DGPS台站", "position": "37°23’50.8” N 122°40’50.9”E", "location": "", "lightId": "", "lightRange": "200.0", "managekey": "公用", "ownerUnitName": "烟台航标处", "authorityUnitName": "烟台航标处", "usageCode": "01", "usageName": "使用中", "remarks": "", "levels": "level_6", },
        { "id": "11601696-a82c-4a9d-95c4-bf4bc648e3f3", "aidsTableCode": "", "aidsName": "北塘RBN-DGPS台站", "locationAttr": "01", "typeCode": "0306", "aidsType": "RBN-DGPS台站", "position": "38°50’11.6” N 117°30’17.5”E", "location": "天津港", "lightId": "608、609", "lightHeight": 300, "lightRange": "200.0", "managekey": "公用", "ownerUnitName": "天津航标处", "authorityUnitName": "天津航标处", "usageCode": "01", "usageName": "使用中", "remarks": "", "levels": "level_6", },
        { "id": "450f6e61-7dd2-405e-b964-bd40de5994fc", "aidsTableCode": "", "aidsName": "大三山岛RBN-DGPS台站", "locationAttr": "01", "typeCode": "0306", "aidsType": "RBN-DGPS台站", "position": "38°51’51.3” N 121°49’32.0”E", "location": "", "lightId": "", "lightHeight": 160, "lightRange": "200.0", "managekey": "公用", "ownerUnitName": "大连航标处", "authorityUnitName": "大连航标处", "usageCode": "01", "usageName": "使用中", "remarks": "", "levels": "level_6", },
        { "id": "5e811bb8-882e-486a-93ab-b9d7e6d5e138", "aidsTableCode": "", "aidsName": "营口RBN/DGPS台站", "locationAttr": "01", "typeCode": "0306", "aidsType": "RBN-DGPS台站", "position": "40°17’28.7” N 122°6’41.1”E", "location": "鲅鱼圈港区主航道", "lightId": "610/611", "lightHeight": 300, "lightRange": "200.0", "managekey": "公用", "ownerUnitName": "营口航标处", "authorityUnitName": "营口航标处", "usageCode": "01", "usageName": "使用中", "remarks": "", "levels": "level_6", },
        { "id": "6a73e6f7-a667-4a44-a11f-1f36cc3544f7", "aidsTableCode": "", "aidsName": "老铁山RBN-DGPS台站", "locationAttr": "01", "typeCode": "0306", "aidsType": "RBN-DGPS台站", "position": "38°43’38.3” N 121°8’5.3”E", "location": "", "lightId": "", "lightHeight": 160, "lightRange": "200.0", "managekey": "公用", "ownerUnitName": "大连航标处", "authorityUnitName": "大连航标处", "usageCode": "01", "usageName": "使用中", "remarks": "", "levels": "level_6", },
        { "id": "9882b381-b6fc-4207-a184-ca4f43e73355", "aidsTableCode": "", "aidsName": "王家麦岛RBN-DGPS台站", "locationAttr": "01", "typeCode": "0306", "aidsType": "RBN-DGPS台站", "position": "36°4’22.8” N 120°26’25.8”E", "location": "", "lightId": "RBN A1", "lightHeight": 200, "lightRange": "", "managekey": "公用", "ownerUnitName": "青岛航标处", "authorityUnitName": "青岛航标处", "usageCode": "01", "usageName": "使用中", "remarks": "", "levels": "level_6", },
        { "id": "d3c2995b-e555-46ea-976a-ba91908ab98f", "aidsTableCode": "", "aidsName": "秦皇岛RBN-DGPS台站", "locationAttr": "01", "typeCode": "0306", "aidsType": "RBN-DGPS台站", "levelCode": "01A", "levelName": "一级A等", "position": "39°54’41.0” N 119°37’0.7”E", "location": "秦皇岛主航道", "lightId": "", "lightHeight": 200, "lightRange": "", "managekey": "公用", "ownerUnitName": "秦皇岛航标处", "authorityUnitName": "秦皇岛航标处", "usageCode": "01", "usageName": "使用中", "remarks": "", "levels": "level_6", },
        { "id": "0151cb3f-6ef0-4a07-b08c-5074f1814c5b", "aidsTableCode": "", "aidsName": "上古林导航台", "locationAttr": "01", "typeCode": "0307", "aidsType": "导航台", "position": "38°50’11.6” N 117°30’17.5”E", "location": "滨州港", "lightRange": "", "managekey": "公用", "ownerUnitName": "天津航标处", "authorityUnitName": "天津航标处", "usageCode": "01", "usageName": "使用中", "remarks": "", "levels": "level_7", },];
    /**选中的数据 */
    @Input() inSelectedDatas: Array<any> = [{ id: "d86adb59-d180-49ef-8d2b-3bd2aa767bcf" }, { id: "0151cb3f-6ef0-4a07-b08c-5074f1814c5b" },];
    /**禁用数据 */
    @Input() inDisableDatas: Array<any> = [
        { id: "d86adb59-d180-49ef-8d2b-3bd2aa767bcf" },
        { id: "475ffda2-4e9e-44dc-a547-af263e62f8bf" }
    ];
    /**表格对应数据value的表头的数据 */
    @Input() inAllItems: MultiAllItems = {
        "0307": [
            { title: '', type: 'check', width: 20, styckyLeft: '0px', keyCode: '1001', canFilter: false },
            { title: '名称', type: 'serial', key: 'serial', width: 30, styckyLeft: '62px', keyCode: '1002', canFilter: false },
            { title: '身高', key: 'aidsName', width: 30, keyCode: '1003', canFilter: false },
            { title: '体重', key: 'locationAttr', width: 30, keyCode: '1004', },
            { title: '性别', key: 'typeCode', width: 30, keyCode: '1005' },
            { title: '学历', key: 'aidsType', width: 50, keyCode: '1006' },
            { title: '政治面貌', key: 'position', width: 50, keyCode: '1007' },
            { title: '姓名', key: 'location', width: 80, keyCode: '1008' },
            { title: '印度', key: 'managekey', width: 80, keyCode: '1009', },
            { title: '美国', key: 'ownerUnitName', keyCode: '1010', type: "expend", width: 80 },
        ],
        "0303": [
            { title: '', type: 'check', width: 20, keyCode: '1001', styckyLeft: '0px' },
            { title: '名称', type: 'serial', width: 30, keyCode: '1002', styckyLeft: '62px' },
            { title: '身高', key: 'aidsName', keyCode: '1003', width: 80 },
            { title: '体重', key: 'locationAttr', width: 30, keyCode: '1004' },
            { title: '性别', key: 'typeCode', keyCode: '1005', width: 30 },
            { title: '学历', key: 'aidsType', keyCode: '1006', width: 50 },
            { title: '政治面貌', key: 'position', keyCode: '1007', width: 50, canFilter: false },
            { title: '姓名', key: 'location', keyCode: '1008', width: 50 },
            { title: '新加坡', key: 'managekey', keyCode: '1011', width: 80 },
            { title: '美国', key: 'managekey', keyCode: '1010', type: "expend", width: 80 },
        ],
        "0306": [
            { title: '', type: 'check', width: 20, keyCode: '1001', styckyLeft: '0px' },
            { title: '名称', type: 'serial', width: 30, keyCode: '1002', styckyLeft: '62px' },
            { title: '身高', key: 'aidsType', keyCode: '1003', width: 130 },
            { title: '体重', key: 'aidsName', keyCode: '1004', width: 30 },
            { title: '性别', key: 'locationAttr', keyCode: '1005', width: 50 },
            { title: '学历', key: 'typeCode', keyCode: '1006', width: 50 },
            { title: '姓名', key: 'position', keyCode: '1007', width: 50 },
            { title: '中国', key: 'location', keyCode: '1011', type: "expend", width: 80 },
        ]
    };
    /**从数据中获取表头时的关键字 */
    @Input() inItemKey: string = "typeCode";
    /**html页面使用的数据(含表头和数据) */
    tableMultiItems: Array<MultiHeadItem> = [];
    searchItem: ShareBaseSearch = new ShareBaseSearch();
    pageRecordOptions: number[] = [15, 20, 30, 50];
    @Output() onSelectChange: EventEmitter<TableSelect> = new EventEmitter();

    onChanges(changes: SimpleChanges) { }
    superInit() { }
    superGetListAfter() { this.getTableMultiItems(); };
    /**获取数据后设置表头 */
    getTableMultiItems() {
        let datas = this.tableDatas, items = this.inAllItems, key = this.inItemKey, tableMultiItems: Array<MultiHeadItem> = [],
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
        this.setMultiItems(heads);
        this.setDataSerial();
        this.set_ifShow();
    }

    /**数据排序 */
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
            this.configHeadItems()
        }
        this.setHeadItemWidth(heads);
    }

    configHeadItems() {
        let heads: Array<TableMultiItem[]> = [];
        /**表头最多的放在第一行 */
        this.tableMultiItems.sort((a, b) => { return (b.heads.length) - (a.heads.length); });
        this.tableMultiItems.forEach(e => heads.push(e.heads));
        /**交换顺序用_keyCode */
        heads.forEach(e => {
            e.forEach(item => {
                item._keyCode = item.keyCode;
            })
        })
        /**计算表头最长有多少 */
        let maxLength = heads[0].length;
        /**调整表头顺序，以第上一个为准 */
        for (let i = 0, len = heads.length - 1; i < len; i++) {
            let cur = heads[i], next = heads[i + 1];
            let allCode = cur.map(e => e._keyCode);
            for (let j = 0; j < maxLength; j++) {
                let curCode = cur[j]._keyCode;
                let index = next.findIndex((e, i) => e._keyCode == curCode && i >= j);
                //下一个表中不存在该keycode
                if (index < 0) {
                    /** 找到下个表头数组剩余的表头，且在上一个表中不存在的code */
                    index = next.findIndex((e, i) => !allCode.includes(e._keyCode) && i >= j);
                    if (index < 0) {
                        next.push({ title: '', keyCode: curCode, _keyCode: curCode });
                        index = next.length - 1;
                    } else {
                        /**改写_keyCode以便下一个 */
                        next[index]._keyCode = curCode;
                    }
                }
                this.swapHeadItem(next, index, j)
            }
        }
    }

    swapHeadItem(datas: TableMultiItem[], index, j) {
        let item = datas[index];
        datas[index] = datas[j];
        datas[j] = item;
    }

    /**设置宽度 */
    setHeadItemWidth(heads: Array<TableMultiItem[]>) {
        let allWith = 0, head = heads[0];
        head.forEach(e => e.width && (allWith += e.width) || e.widthMin && (allWith += e.widthMin) || (allWith += 60))
        let tableWidth = this.nativeEl.querySelector('.share-table').clientWidth;
        if (tableWidth <= allWith) {
            for (let i = 0, len = heads[0].length; i < len; i++) {
                let _width;
                for (let j = 0, len = heads.length; j < len && !_width; j++) {
                    _width = heads[j][i].width || heads[j][i].widthMin;
                }
                for (let j = 0, len = heads.length; j < len; j++) {
                    heads[j][i]._width = _width;
                }
            }
            Promise.resolve().then(res => {
                head.forEach(e => e.width || (e.widthMin && (e.width = e.widthMin)) || (e.width = 60))
            })
        } else {
            for (let i = 0, len = heads[0].length; i < len; i++) {
                for (let j = 0, l = heads.length; j < l; j++) {
                    heads[j][i]._width = heads[0][i].width;
                }
            }
        }
    }

    /**多表头整列是否隐藏 */
    set_ifShow() {
        let heads: TableMultiItem[][] = [];
        this.tableMultiItems.forEach(e => heads.push(e.heads));
        for (let i = 0, len = heads[0].length; i < len; i++) {
            let ifShow = false;
            for (let j = 0, len = heads.length; j < len && !ifShow; j++) {
                ifShow = heads[j][i].ifShow !== false;
            }
            for (let j = 0, len = heads.length; j < len; j++) {
                heads[j][i]._ifShow = ifShow;
            }
        }
    }

    onChangeItemFilter() {
        this.set_ifShow();
    }
}

