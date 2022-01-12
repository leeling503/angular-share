import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TableData, TableItem, TableMultiAllItems, TagRule, TagRules } from 'share-libs/src/components/table/share-table.model';

@Component({
  selector: 'ex-multi-table',
  templateUrl: './ex-multi-table.component.html',
  styleUrls: ['./ex-multi-table.component.less']
})
export class ExMultiTableComponent implements OnInit {
  constructor() { }
  itemKey = 'typeCode';
  multiAllDatas: any[] = [
    { "id": "bbd0d97c-1e32-4c48-b4b0-761d4328d261", "aidsTableCode": "1716.1", "aidsName": "501号灯船实体AIS", "locationAttr": "01", "typeCode": "0303", "aidsType": "实体AIS", "functionCode": "17", "functionName": "未定义航标类型", "position": "35°53’13.9” N 120°18’50.3”E", "location": "超大型船舶航道", "lightId": "994131628", "lightRange": "01", "managekey": "公用", "ownerUnitName": "青岛航标处", "authorityUnitName": "青岛航标处", "usageCode": "01", "usageName": "使用中", "levels": "level_4", }, { "id": "0151cb3f-6ef0-4a07-b08c-5074f1814c5b", "aidsTableCode": "", "aidsName": "上古林导航台", "locationAttr": "01", "typeCode": "0309", "aidsType": "导航台", "position": "38°50’11.6” N 117°30’17.5”E", "location": "滨州港", "lightRange": "", "managekey": "公用", "ownerUnitName": "天津航标处", "authorityUnitName": "天津航标处", "usageCode": "01", "usageName": "使用中", "remarks": "", "levels": "level_7", }, { "id": "0151cb3f-6ef0-4a07-b08c-5074f1814c5b", "aidsTableCode": "", "aidsName": "上古林导航台", "locationAttr": "01", "typeCode": "0307", "aidsType": "导航台", "position": "38°50’11.6” N 117°30’17.5”E", "location": "滨州港", "lightRange": "", "managekey": "公用", "ownerUnitName": "天津航标处", "authorityUnitName": "天津航标处", "usageCode": "01", "usageName": "使用中", "remarks": "", "levels": "level_7", }, { "id": "0151cb3f-6ef0-4a07-b08c-5074f1814c5b", "aidsTableCode": "", "aidsName": "上古林导航台", "locationAttr": "01", "typeCode": "0307", "aidsType": "导航台", "position": "38°50’11.6” N 117°30’17.5”E", "location": "滨州港", "lightRange": "", "managekey": "公用", "ownerUnitName": "天津航标处", "authorityUnitName": "天津航标处", "usageCode": "01", "usageName": "使用中", "remarks": "", "levels": "level_7", },
    { "id": "475ffda2-4e9e-44dc-a547-af263e62f8bf", "aidsTableCode": "1716.13", "aidsName": "青岛港507号实体AIS", "locationAttr": "01", "typeCode": "0303", "aidsType": "实体AIS", "functionCode": "06", "functionName": "右侧标", "position": "35°55’44.2” N 120°20’37.3”E", "location": "超大型船舶航道", "lightId": "994131630", "lightRange": "01", "managekey": "公用", "ownerUnitName": "青岛航标处", "authorityUnitName": "青岛航标处", "usageCode": "01", "usageName": "使用中", "levels": "level_4", },
    { "id": "04089f42-0e1c-4fc8-8b8a-eb21d1141a20", "aidsTableCode": "1716.15", "aidsName": "青岛港511号实体AIS", "locationAttr": "01", "typeCode": "0303", "aidsType": "实体AIS", "functionCode": "06", "functionName": "右侧标", "position": "35°57’30.3” N 120°21’55.4”E", "location": "超大型船舶航道", "lightId": "994131632", "lightRange": "01", "managekey": "公用", "ownerUnitName": "青岛航标处", "authorityUnitName": "青岛航标处", "usageCode": "01", "usageName": "使用中", "levels": "level_4", },
    { "id": "d86adb59-d180-49ef-8d2b-3bd2aa767bcf", "aidsTableCode": "1716.16", "aidsName": "青岛港512号实体AIS", "locationAttr": "01", "typeCode": "0303", "aidsType": "实体AIS", "functionCode": "05", "functionName": "左侧标", "position": "35°58’10.0” N 120°20’27.9”E", "location": "超大型船舶航道", "lightId": "994131633", "lightRange": "01", "managekey": "公用", "ownerUnitName": "青岛航标处", "authorityUnitName": "青岛航标处", "usageCode": "01", "usageName": "使用中", "levels": "level_4", },
    { "id": "8043bd09-1f11-4a2c-8ad2-06733704b52f", "aidsTableCode": "1716.2", "aidsName": "青岛港517号实体AIS", "locationAttr": "01", "typeCode": "0303", "aidsType": "实体AIS", "functionCode": "06", "functionName": "右侧标", "position": "36°0’1.4” N 120°20’31.9”E", "location": "超大型船舶航道", "lightId": "994131634", "lightRange": "01", "managekey": "公用", "ownerUnitName": "青岛航标处", "authorityUnitName": "青岛航标处", "usageCode": "01", "usageName": "使用中", "levels": "level_4", },
    { "id": "b3ef79fa-2627-4d9a-8349-85fa280a1f2d", "aidsTableCode": "1716.21", "aidsName": "青岛港518号灯船实体AIS", "locationAttr": "01", "typeCode": "0303", "aidsType": "实体AIS", "functionCode": "17", "functionName": "未定义航标类型", "position": "36°0’9.0” N 120°19’57.2”E", "location": "超大型船舶航道", "lightId": "994131635", "lightRange": "01", "managekey": "公用", "ownerUnitName": "青岛航标处", "authorityUnitName": "青岛航标处", "usageCode": "01", "usageName": "使用中", "levels": "level_4", },
    { "id": "8a3af8bb-63be-483b-adf3-511553ff6f91", "aidsTableCode": "1716.22", "aidsName": "青岛港20号实体AIS", "locationAttr": "01", "typeCode": "0303", "aidsType": "实体AIS", "functionCode": "05", "functionName": "左侧标", "position": "36°1’27.7” N 120°16’28.9”E", "location": "青岛港港内主航道", "lightId": "994131603", "lightRange": "01", "managekey": "公用", "ownerUnitName": "青岛航标处", "authorityUnitName": "青岛航标处", "usageCode": "01", "usageName": "使用中", "levels": "level_4", },
    { "id": "04ffb140-d9c0-4224-a262-48cb6e6713d6", "aidsTableCode": "", "aidsName": "成山头RBN-DGPS台", "locationAttr": "01", "typeCode": "0306", "aidsType": "RBN-DGPS台站", "position": "37°23’50.8” N 122°40’50.9”E", "location": "", "lightId": "", "lightRange": "200.0", "managekey": "公用", "ownerUnitName": "烟台航标处", "authorityUnitName": "烟台航标处", "usageCode": "01", "usageName": "使用中", "remarks": "", "levels": "level_6", },
    { "id": "11601696-a82c-4a9d-95c4-bf4bc648e3f3", "aidsTableCode": "", "aidsName": "北塘RBN-DGPS台站", "locationAttr": "01", "typeCode": "0306", "aidsType": "RBN-DGPS台站", "position": "38°50’11.6” N 117°30’17.5”E", "location": "天津港", "lightId": "608、609", "lightHeight": 300, "lightRange": "200.0", "managekey": "公用", "ownerUnitName": "天津航标处", "authorityUnitName": "天津航标处", "usageCode": "01", "usageName": "使用中", "remarks": "", "levels": "level_6", },
    { "id": "450f6e61-7dd2-405e-b964-bd40de5994fc", "aidsTableCode": "", "aidsName": "大三山岛RBN-DGPS台站", "locationAttr": "01", "typeCode": "0306", "aidsType": "RBN-DGPS台站", "position": "38°51’51.3” N 121°49’32.0”E", "location": "", "lightId": "", "lightHeight": 160, "lightRange": "200.0", "managekey": "公用", "ownerUnitName": "大连航标处", "authorityUnitName": "大连航标处", "usageCode": "01", "usageName": "使用中", "remarks": "", "levels": "level_6", },
    { "id": "5e811bb8-882e-486a-93ab-b9d7e6d5e138", "aidsTableCode": "", "aidsName": "营口RBN/DGPS台站", "locationAttr": "01", "typeCode": "0306", "aidsType": "RBN-DGPS台站", "position": "40°17’28.7” N 122°6’41.1”E", "location": "鲅鱼圈港区主航道", "lightId": "610/611", "lightHeight": 300, "lightRange": "200.0", "managekey": "公用", "ownerUnitName": "营口航标处", "authorityUnitName": "营口航标处", "usageCode": "01", "usageName": "使用中", "remarks": "", "levels": "level_6", },
    { "id": "6a73e6f7-a667-4a44-a11f-1f36cc3544f7", "aidsTableCode": "", "aidsName": "老铁山RBN-DGPS台站", "locationAttr": "01", "typeCode": "0306", "aidsType": "RBN-DGPS台站", "position": "38°43’38.3” N 121°8’5.3”E", "location": "", "lightId": "", "lightHeight": 160, "lightRange": "200.0", "managekey": "公用", "ownerUnitName": "大连航标处", "authorityUnitName": "大连航标处", "usageCode": "01", "usageName": "使用中", "remarks": "", "levels": "level_6", },
    { "id": "9882b381-b6fc-4207-a184-ca4f43e73355", "aidsTableCode": "", "aidsName": "王家麦岛RBN-DGPS台站", "locationAttr": "01", "typeCode": "0306", "aidsType": "RBN-DGPS台站", "position": "36°4’22.8” N 120°26’25.8”E", "location": "", "lightId": "RBN A1", "lightHeight": 200, "lightRange": "", "managekey": "公用", "ownerUnitName": "青岛航标处", "authorityUnitName": "青岛航标处", "usageCode": "01", "usageName": "使用中", "remarks": "", "levels": "level_6", },
    { "id": "d3c2995b-e555-46ea-976a-ba91908ab98f", "aidsTableCode": "", "aidsName": "秦皇岛RBN-DGPS台站", "locationAttr": "01", "typeCode": "0306", "aidsType": "RBN-DGPS台站", "levelCode": "01A", "levelName": "一级A等", "position": "39°54’41.0” N 119°37’0.7”E", "location": "秦皇岛主航道", "lightId": "", "lightHeight": 200, "lightRange": "", "managekey": "公用", "ownerUnitName": "秦皇岛航标处", "authorityUnitName": "秦皇岛航标处", "usageCode": "01", "usageName": "使用中", "remarks": "", "levels": "level_6", },
    { "id": "0151cb3f-6ef0-4a07-b08c-5074f1814c5b", "aidsTableCode": "", "aidsName": "上古林导航台", "locationAttr": "01", "typeCode": "0307", "aidsType": "导航台", "position": "38°50’11.6” N 117°30’17.5”E", "location": "滨州港", "lightRange": "", "managekey": "公用", "ownerUnitName": "天津航标处", "authorityUnitName": "天津航标处", "usageCode": "01", "usageName": "使用中", "remarks": "", "levels": "level_7", },
    { "id": "475ffda2-4e9e-44dc-a547-af263e62f8bf", "aidsTableCode": "1716.13", "aidsName": "青岛港507号实体AIS", "locationAttr": "01", "typeCode": "0303", "aidsType": "实体AIS", "functionCode": "06", "functionName": "右侧标", "position": "35°55’44.2” N 120°20’37.3”E", "location": "超大型船舶航道", "lightId": "994131630", "lightRange": "01", "managekey": "公用", "ownerUnitName": "青岛航标处", "authorityUnitName": "青岛航标处", "usageCode": "01", "usageName": "使用中", "levels": "level_4", },
    { "id": "04089f42-0e1c-4fc8-8b8a-eb21d1141a20", "aidsTableCode": "1716.15", "aidsName": "青岛港511号实体AIS", "locationAttr": "01", "typeCode": "0303", "aidsType": "实体AIS", "functionCode": "06", "functionName": "右侧标", "position": "35°57’30.3” N 120°21’55.4”E", "location": "超大型船舶航道", "lightId": "994131632", "lightRange": "01", "managekey": "公用", "ownerUnitName": "青岛航标处", "authorityUnitName": "青岛航标处", "usageCode": "01", "usageName": "使用中", "levels": "level_4", },
    { "id": "d86adb59-d180-49ef-8d2b-3bd2aa767bcf", "aidsTableCode": "1716.16", "aidsName": "青岛港512号实体AIS", "locationAttr": "01", "typeCode": "0303", "aidsType": "实体AIS", "functionCode": "05", "functionName": "左侧标", "position": "35°58’10.0” N 120°20’27.9”E", "location": "超大型船舶航道", "lightId": "994131633", "lightRange": "01", "managekey": "公用", "ownerUnitName": "青岛航标处", "authorityUnitName": "青岛航标处", "usageCode": "01", "usageName": "使用中", "levels": "level_4", },
    { "id": "8043bd09-1f11-4a2c-8ad2-06733704b52f", "aidsTableCode": "1716.2", "aidsName": "青岛港517号实体AIS", "locationAttr": "01", "typeCode": "0303", "aidsType": "实体AIS", "functionCode": "06", "functionName": "右侧标", "position": "36°0’1.4” N 120°20’31.9”E", "location": "超大型船舶航道", "lightId": "994131634", "lightRange": "01", "managekey": "公用", "ownerUnitName": "青岛航标处", "authorityUnitName": "青岛航标处", "usageCode": "01", "usageName": "使用中", "levels": "level_4", },
    { "id": "b3ef79fa-2627-4d9a-8349-85fa280a1f2d", "aidsTableCode": "1716.21", "aidsName": "青岛港518号灯船实体AIS", "locationAttr": "01", "typeCode": "0303", "aidsType": "实体AIS", "functionCode": "17", "functionName": "未定义航标类型", "position": "36°0’9.0” N 120°19’57.2”E", "location": "超大型船舶航道", "lightId": "994131635", "lightRange": "01", "managekey": "公用", "ownerUnitName": "青岛航标处", "authorityUnitName": "青岛航标处", "usageCode": "01", "usageName": "使用中", "levels": "level_4", },
    { "id": "8a3af8bb-63be-483b-adf3-511553ff6f91", "aidsTableCode": "1716.22", "aidsName": "青岛港20号实体AIS", "locationAttr": "01", "typeCode": "0303", "aidsType": "实体AIS", "functionCode": "05", "functionName": "左侧标", "position": "36°1’27.7” N 120°16’28.9”E", "location": "青岛港港内主航道", "lightId": "994131603", "lightRange": "01", "managekey": "公用", "ownerUnitName": "青岛航标处", "authorityUnitName": "青岛航标处", "usageCode": "01", "usageName": "使用中", "levels": "level_4", },
    { "id": "04ffb140-d9c0-4224-a262-48cb6e6713d6", "aidsTableCode": "", "aidsName": "成山头RBN-DGPS台", "locationAttr": "01", "typeCode": "0306", "aidsType": "RBN-DGPS台站", "position": "37°23’50.8” N 122°40’50.9”E", "location": "", "lightId": "", "lightRange": "200.0", "managekey": "公用", "ownerUnitName": "烟台航标处", "authorityUnitName": "烟台航标处", "usageCode": "01", "usageName": "使用中", "remarks": "", "levels": "level_6", },
    { "id": "11601696-a82c-4a9d-95c4-bf4bc648e3f3", "aidsTableCode": "", "aidsName": "北塘RBN-DGPS台站", "locationAttr": "01", "typeCode": "0306", "aidsType": "RBN-DGPS台站", "position": "38°50’11.6” N 117°30’17.5”E", "location": "天津港", "lightId": "608、609", "lightHeight": 300, "lightRange": "200.0", "managekey": "公用", "ownerUnitName": "天津航标处", "authorityUnitName": "天津航标处", "usageCode": "01", "usageName": "使用中", "remarks": "", "levels": "level_6", },
    { "id": "450f6e61-7dd2-405e-b964-bd40de5994fc", "aidsTableCode": "", "aidsName": "大三山岛RBN-DGPS台站", "locationAttr": "01", "typeCode": "0306", "aidsType": "RBN-DGPS台站", "position": "38°51’51.3” N 121°49’32.0”E", "location": "", "lightId": "", "lightHeight": 160, "lightRange": "200.0", "managekey": "公用", "ownerUnitName": "大连航标处", "authorityUnitName": "大连航标处", "usageCode": "01", "usageName": "使用中", "remarks": "", "levels": "level_6", },
    { "id": "5e811bb8-882e-486a-93ab-b9d7e6d5e138", "aidsTableCode": "", "aidsName": "营口RBN/DGPS台站", "locationAttr": "01", "typeCode": "0306", "aidsType": "RBN-DGPS台站", "position": "40°17’28.7” N 122°6’41.1”E", "location": "鲅鱼圈港区主航道", "lightId": "610/611", "lightHeight": 300, "lightRange": "200.0", "managekey": "公用", "ownerUnitName": "营口航标处", "authorityUnitName": "营口航标处", "usageCode": "01", "usageName": "使用中", "remarks": "", "levels": "level_6", },
    { "id": "6a73e6f7-a667-4a44-a11f-1f36cc3544f7", "aidsTableCode": "", "aidsName": "老铁山RBN-DGPS台站", "locationAttr": "01", "typeCode": "0306", "aidsType": "RBN-DGPS台站", "position": "38°43’38.3” N 121°8’5.3”E", "location": "", "lightId": "", "lightHeight": 160, "lightRange": "200.0", "managekey": "公用", "ownerUnitName": "大连航标处", "authorityUnitName": "大连航标处", "usageCode": "01", "usageName": "使用中", "remarks": "", "levels": "level_6", },
    { "id": "9882b381-b6fc-4207-a184-ca4f43e73355", "aidsTableCode": "", "aidsName": "王家麦岛RBN-DGPS台站", "locationAttr": "01", "typeCode": "0306", "aidsType": "RBN-DGPS台站", "position": "36°4’22.8” N 120°26’25.8”E", "location": "", "lightId": "RBN A1", "lightHeight": 200, "lightRange": "", "managekey": "公用", "ownerUnitName": "青岛航标处", "authorityUnitName": "青岛航标处", "usageCode": "01", "usageName": "使用中", "remarks": "", "levels": "level_6", },
    { "id": "d3c2995b-e555-46ea-976a-ba91908ab98f", "aidsTableCode": "", "aidsName": "秦皇岛RBN-DGPS台站", "locationAttr": "01", "typeCode": "0306", "aidsType": "RBN-DGPS台站", "levelCode": "01A", "levelName": "一级A等", "position": "39°54’41.0” N 119°37’0.7”E", "location": "秦皇岛主航道", "lightId": "", "lightHeight": 200, "lightRange": "", "managekey": "公用", "ownerUnitName": "秦皇岛航标处", "authorityUnitName": "秦皇岛航标处", "usageCode": "01", "usageName": "使用中", "remarks": "", "levels": "level_6", },
    { "id": "0151cb3f-6ef0-4a07-b08c-5074f1814c5b", "aidsTableCode": "", "aidsName": "上古林导航台", "locationAttr": "01", "typeCode": "0307", "aidsType": "导航台", "position": "38°50’11.6” N 117°30’17.5”E", "location": "滨州港", "lightRange": "", "managekey": "公用", "ownerUnitName": "天津航标处", "authorityUnitName": "天津航标处", "usageCode": "01", "usageName": "使用中", "remarks": "", "levels": "level_7", }];

  multiAllItems: TableMultiAllItems<MultiData> = {
    "0307": [
      { title: '', type: 'check', width: 60, styckyLeft: '0px', keyCode: '1001', filterCan: false },
      { title: '序号', type: 'serial', key: 'serial', width: 60, styckyLeft: '60px', keyCode: '1002', filterCan: false },
      {
        title: '身高', key: 'aidsName', width: 3, keyCode: '1003', filterCan: false, classTdNames: ['color-blue'], onClick: (data) => {
          console.log(data)
        }
      },
      { title: '体重', key: 'locationAttr', width: 3, keyCode: '1004', },
      {
        title: '性别', key: 'typeCode', width: 3, keyCode: '1005', type: 'rule-tags', ruleTags: (data) => {
          data._ruleTags = [{ class: 'orange', text: '女' }]
          return [{ class: 'orange', text: '女', styles: { 'color': 'blue' } }]
        }
      },
      { title: '学历', key: 'aidsType', width: 5, keyCode: '1006' },
      { title: '政治面貌', key: 'position', width: 5, keyCode: '1007' },
      { title: '姓名', key: 'location', width: 8, keyCode: '1008' },
      { title: '印度', key: 'managekey', width: 8, keyCode: '1009', },
      { title: '美国', key: 'ownerUnitName', keyCode: '1010', type: "expend", width: 8 },
    ],
    "0303": [
      { title: '', type: 'check', keyCode: '1001' },
      { title: '序号', type: 'serial', keyCode: '1002' },
      { title: '身高', key: 'aidsName', keyCode: '1003', width: 8 },
      { title: '体重', key: 'locationAttr', width: 3, keyCode: '1004' },
      {
        title: '性别', key: 'typeCode', keyCode: '1005', width: 3, type: 'rule-tags', ruleTags: (data) => {
          return [{ class: 'blue', text: '男', styles: { 'color': 'yellow' } }]
        }
      },
      { title: '学历', key: 'aidsType', keyCode: '1006', width: 5 },
      { title: '政治面貌', key: 'position', keyCode: '1007', width: 5, filterCan: false },
      { title: '姓名', key: 'location', keyCode: '1008', width: 5 },
      { title: '新加坡', key: 'managekey', keyCode: '1011', width: 8 },
      { title: '美国', key: 'managekey', keyCode: '1010', type: "expend", width: 8 },
    ],
    "0306": [
      { title: '', type: 'check', width: 60, keyCode: '1001', styckyLeft: '0px' },
      { title: '序号', type: 'serial', width: 90, keyCode: '1002', styckyLeft: '60px' },
      { title: '身高', key: 'aidsType', keyCode: '1003', width: 13 },
      { title: '体重', key: 'aidsName', keyCode: '1004', width: 3 },
      { title: '性别', key: 'locationAttr', keyCode: '1005', width: 5 },
      { title: '学历', key: 'typeCode', keyCode: '1006', width: 5 },
      { title: '姓名', key: 'position', keyCode: '1007', width: 5 },
      { title: '中国', key: 'location', keyCode: '1011', type: "expend", width: 8 },
    ],
    "0309": [
      { title: '', type: 'check', width: 60, keyCode: '1001', styckyLeft: '0px' },
      { title: '序号', type: 'serial', width: 60, keyCode: '1002', styckyLeft: '60px' },
      { title: '身高', key: 'aidsType', keyCode: '1003', width: 13 },
      { title: '体重', key: 'aidsName', keyCode: '1004', width: 3 },
      { title: '性别', key: 'locationAttr', keyCode: '1005', width: 5 },
      { title: '学历', key: 'typeCode', keyCode: '1006', width: 5 },
      { title: '姓名', key: 'position', keyCode: '1007', width: 5 },
      { title: '中国', key: 'location', keyCode: '1011', type: "expend", width: 8 },
    ]
  };

  multiDisDatas: any[] = [
    { id: "d86adb59-d180-49ef-8d2b-3bd2aa767bcf" },
    { id: "475ffda2-4e9e-44dc-a547-af263e62f8bf" }
  ];

  multiSelectedDatas: Array<any> = [
    { id: "d86adb59-d180-49ef-8d2b-3bd2aa767bcf" },
    { id: "0151cb3f-6ef0-4a07-b08c-5074f1814c5b" }
  ];

  ngOnInit() {
    // this.multiAllDatas = []
  }

  onSelectChange($event) {
    console.log($event)
  }

}

interface MultiData extends TableData {

}