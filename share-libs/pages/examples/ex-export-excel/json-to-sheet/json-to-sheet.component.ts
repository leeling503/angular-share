import { Component, OnInit } from '@angular/core';
import { PrintBase } from 'share-libs/modules/base/export-excel/print-base';
import { Alphabet, SheetData, ToSheetWay } from 'share-libs/models';
import * as XlsxPopulate from "xlsx-populate";

@Component({
  selector: 'app-json-to-sheet',
  template: `
    <p>示例一：将一个对象数组转成sheet</p>
    <share-button [inText]="'导出说明文档'" [inWidth]="100" (click)="onDownLoad()"></share-button>
  `,
})
export class JsonToSheetComponent extends PrintBase implements OnInit {
  constructor() { super() }

  workBookName = '说明文档';
  toSheetWay: ToSheetWay = 'json';
  alphabetList: Alphabet[] = ["A", "B", "C", "D"];

  printInfo = {
    title: '导出带样式的excel',
    part1: {
      title: '步骤',
      step1: '步骤一：使用 xlsx 生成前端excel表格；',
      step2: '步骤二：使用 xlsx-populate 添加excel样式；',
    },
    part2: {
      title: '链接',
      link1: {
        addr: 'https://zhuanlan.zhihu.com/p/95984128',
        text: '1、xlsx插件的使用'
      },
      link2: {
        addr: 'https://github.com/dtjohnson/xlsx-populate',
        text: '2、xlsx-populate插件'
      }
    },
    part3: {
      title: '相关配置和依赖',
      package: ' npm i @types/node \n npm i xlsx xlsx-populate buffer process stream',
      setting: ` （1）在tsconfig.app.json中添加"compilerOptions": {
        "types": ["node"]
      } ; \n （2）在polyfills.ts中添加：(window as any).global = window;
      global.Buffer = global.Buffer || require('buffer').Buffer;
      global.process = require('process'); \n （3）在package.json中添加"browser": {
        "fs": false,
        "path": false,
        "os": false,
        "crypto": false,
        "http": false,
        "tls": false,
        "zlib": false,
        "https": false,
        "net": false
      },`
    },
  }

  ngOnInit(): void {
  }

  setSheetData() {
    const title: SheetData[] = [{ A: '', B: `${this.printInfo.title}`, C: '', D: '' }, {}];
    const table: SheetData[] = [
      { A: '', B: `${this.printInfo.part1.title}`, C: `${this.printInfo.part2.title}`, D: `${this.printInfo.part3.title}` },
      { A: '', B: `${this.printInfo.part1.step1}`, C: `${this.printInfo.part2.link1.text}`, D: `${this.printInfo.part3.package}` },
      { A: '', B: `${this.printInfo.part1.step2}`, C: `${this.printInfo.part2.link2.text}`, D: `${this.printInfo.part3.setting}` },
    ];
    return [...title, ...table]
  }

  addSheetsStyle() {
    this.rowcolInfo = {
      aRange: "A1:A5",
      theadRange: "B1:D1",
      tbodyRange: `B2:D5`,
      tableRange: `B3:D5`,
      dateRange: "B2:D2",
      titleRange: "B3:D3",
    };
    this.workbook.sheets().forEach(sheet => {
      this.initSheetStyle(sheet);
      // 设置单元格宽度
      this.alphabetList.forEach((name) => {
        if (name == 'A') {
          this.setBlankA('width', sheet);
        } else if (name == 'D') {
          sheet.column(name).width(80);
        } else {
          sheet.column(name).width(50);
        }
      });
      // 设置单元格高度
      sheet.row(1).height(30);
      // title合并及居中
      sheet.range(this.rowcolInfo.theadRange).merged(true);
      sheet.range(this.rowcolInfo['dateRange']).merged(true).style({
        horizontalAlignment: "right",
      });
      // 设置日期格式
      const dateR = sheet.range(this.rowcolInfo['dateRange']);
      dateR.value(new Date(2022, 4, 29)).style("numberFormat", "dddd, mmmm dd, yyyy");
      //标题字号且加粗
      sheet.range(this.rowcolInfo['titleRange']).style({
        fontSize: 14,
        bold: true,
        horizontalAlignment: "center"
      });
      // 通过富文本添加超链接
      const cell1 = sheet.cell('C4');
      cell1.value(new XlsxPopulate.RichText());
      cell1.value(this.printInfo.part2.link1.text).style({ fontColor: "0563c1", underline: true }).hyperlink(this.printInfo.part2.link1.addr);
      const cell2 = sheet.cell('C5');
      cell2.value(new XlsxPopulate.RichText());
      cell2.value(this.printInfo.part2.link2.text).style({ fontColor: "0563c1", underline: true }).hyperlink(this.printInfo.part2.link2.addr);
    });
  }
}

