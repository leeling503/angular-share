import { Component, OnInit } from '@angular/core';
import { PrintBase } from 'share-libs/src/components/base/export-excel/print-base';
import { Alphabet, ToSheetWay } from 'share-libs/src/models';
import * as XlsxPopulate from "xlsx-populate";

@Component({
  selector: 'app-table-to-sheet',
  templateUrl: './table-to-sheet.component.html',
  styleUrls: ['./ex-excel.less']
})
export class TableToSheetComponent extends PrintBase implements OnInit {
  constructor() { super() }

  dataList = [];
  workBookName = '作品推荐';
  toSheetWay: ToSheetWay = 'table';
  alphabetList: Alphabet[] = ["A", "B", "C", "D", "E", "F", "G", "H"];

  ngOnInit(): void {
    this.getPrintInfo();
  }

  getPrintInfo() {
    this.printInfo = {
      title: '作品推荐',
      dataList: [
        { drama: '《大明王朝1566》', director: '张黎', variety: '《非正式会谈》', host: '主席团、各国代表', book: '《河西走廊》', producer: '中央电视台和中共甘肃省委宣传部' },
        { drama: '《山海情》', director: '孔笙、孙墨龙', variety: '《你好生活》', host: '小尼、撒贝宁', book: '《苏东坡》', producer: '中央电视台、湖北广播电视台和黄冈市政府' },
        { drama: '《觉醒年代》', director: '张永新', variety: '《无穷之路》', host: '陈贝儿', book: '', producer: '' },
      ],
      remark: `名台词\n《大明王朝1566》：\n「不因水清而偏用，亦不可因水浊而弃用」\n「有些事情不上秤不足四两，一旦上秤一千斤都打不住」\n「事未经历不知难」\n「雅人会因清高而不合污，却绝不会以清高而拒绝雅致」`
    };
    this.dataList = this.printInfo.dataList;
  }

  addSheetsStyle() {
    const len = this.dataList.length + 4;
    this.rowcolInfo = {
      aRange: "A1:A7",
      theadRange: "B1:H1",
      tbodyRange: `B2:H${len}`,
      tableRange: `B2:H${len}`,
      remarkRange: `C${len}:H${len}`
    };
    this.workbook.sheets().forEach(sheet => {
      this.initSheetStyle(sheet);
      // 设置行高
      sheet.row(1).height(30);
      sheet.row(len).height(this.calculateCellHeight(this.printInfo.remark));
      // 设置单元格宽度
      this.alphabetList.forEach((name) => {
        if (name == 'A') {
          this.setBlankA('width', sheet);
        } else if (name == 'B') {
          sheet.column(name).width(5);
        } else if (name == 'H') {
          sheet.column(name).width(40);
        } else {
          sheet.column(name).width(20);
        }
      });
      // 表内容
      sheet.range(this.rowcolInfo.tableRange).style({
        horizontalAlignment: "center",
      });
      // 备注内容
      sheet.range(this.rowcolInfo['remarkRange']).style({
        horizontalAlignment: "left",
      });
      // 使用富文本处理包含行分隔符(\n,\r,\r\n)的单元格
      const r = sheet.range(this.rowcolInfo['remarkRange']);
      r.value(new XlsxPopulate.RichText());
      r.value(this.printInfo.remark);
    })
  }

}