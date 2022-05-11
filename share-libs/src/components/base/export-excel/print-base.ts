import { RowColInfo } from "share-libs/src/models";
import { ExcelBase } from "./excel-base";

export abstract class PrintBase extends ExcelBase {
  constructor() {
    super();
  }

  /**需要设置样式的行列 */
  rowcolInfo: RowColInfo;
  tableId = 'excel-table';
  /**打印数据 */
  public printInfo: any;

  /**初始化工作表样式 */
  initSheetStyle(sheet) {
    // 所有cell垂直居中,修改字体
    sheet.usedRange().style({
      fontFamily: "宋体",
      verticalAlignment: "center",
    });
    // 去除所有边框
    sheet.gridLinesVisible(false);
    this.setBlankA('height', sheet);
    // 标题字号、对齐方式
    sheet.range(this.rowcolInfo.theadRange).style({
      fontSize: 16,
      horizontalAlignment: "center"
    });
    // tbody字体
    sheet.range(this.rowcolInfo.tbodyRange).style({
      fontSize: 10,
    });
    // 表内容
    sheet.range(this.rowcolInfo.tableRange).style({
      border: true, //描边
      wrapText: true, //自适应行高：适用于非合并的cell
      horizontalAlignment: "left", //左对齐
    });
    // 底部对齐方式
    this.rowcolInfo['tfootRange'] && sheet.range(this.rowcolInfo['tfootRange']).style({
      horizontalAlignment: "left",
    });
  }

  /**
   * 设置空白列A
   * @param type 样式类型
   * @param sheet
   */
  setBlankA(type: 'width' | 'height', sheet) {
    if (type == 'width') {
      // 通过设置空白列宽度来设置表格左侧间距
      sheet.column('A').width(1);
    } else {
      // 通过选择合适的空白列的字体来设置表格的最小行高
      sheet.range(this.rowcolInfo.aRange).style({
        fontSize: 14,
      });
    }
  }

  /**
   * 计算合并单元格的高度（excel中合并的单元格无法设置自动换行）
   * @param str 单元格内容
   * @param cellWidth 该单元格一行可容纳字符数
   * @param rowHeight 一行高度，默认18.75磅
   */
  calculateCellHeight(str: string, rowHeight?: number)
  calculateCellHeight(str: string, cellWidth: number, rowHeight?: number)
  calculateCellHeight(str: string, cellWidth: number, rowHeight: number = 18.75) {
    if (!str) return rowHeight
    if (cellWidth > 0) {
      // 内容超出行容纳值自动换行
      const charsLen = this.getCharsLen(str);
      return Math.ceil(charsLen / cellWidth) * rowHeight
    } else {
      // 内容依据换行符换行
      let str_ = str.replace(/\r+|\n+/g, '↵↵↵↵↵'), strArr = str_.split('↵↵↵↵↵');
      const rows = strArr.length || 1;
      return rows * rowHeight
    }
  }

  /**获取某字符串的总字符数 */
  private getCharsLen(str) {
    // 空格数
    let kongge = str.match(/ /g);
    let kongge_ = (kongge && kongge.length) || 0;
    // 字母数
    let zimu = str.match(/[a-zA-Z]/g);
    let zimu_ = (zimu && zimu.length) || 0;
    // 数字数
    let shuzi = str.match(/[\d]/g);
    let shuzi_ = (shuzi && shuzi.length) || 0;
    // 其它字符数，注意这里有一个空格
    let qita = str.match(/[^0-9A-Za-z ]/g);
    let qita_ = (qita && qita.length) || 0;
    return kongge_ + zimu_ + shuzi_ + qita_
  }
}