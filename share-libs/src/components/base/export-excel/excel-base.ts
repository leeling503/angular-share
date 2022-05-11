import * as XLSX from "xlsx";
import * as XlsxPopulate from "xlsx-populate";
import { Alphabet, SheetData, ToSheetWay } from "share-libs/src/models";

export abstract class ExcelBase {
  /**生成工作表的方式 */
  abstract toSheetWay: ToSheetWay;
  /**工作簿名称 */
  abstract workBookName: string;
  /**工作表水平坐标轴包含元素 */
  abstract alphabetList: Alphabet[];
  /**table的唯一标识 */
  tableId: string;
  /**工作簿 */
  workbook;
  /**工作表 */
  sheetData: SheetData[] = [];
  /**工作表名称 */
  sheetName: string = 'sheet1';
  /**生成工作表 */
  setSheetData(): SheetData[] { return [] };
  /**给所有的表并添加样式 */
  addSheetsStyle() { }

  /**点击下载 */
  public onDownLoad() {
    if (this.toSheetWay == 'table') {
      this.handleTable2Sheet().then(url => {
        this.createDownLoadLink(url);
      });
    } else if (this.toSheetWay == 'json') {
      this.handleJson2Sheet().then(url => {
        this.createDownLoadLink(url);
      });
    }
  }

  /**【*方法一】XLSX.utils.table_to_sheet: 将一个table dom直接转成sheet */
  protected handleTable2Sheet() {
    const table1 = document.querySelector(`#${this.tableId}`);
    // 将一个table对象转换成一个sheet对象
    const sheet = XLSX.utils.table_to_sheet(table1);
    return this.sheet2blob(sheet);
  }

  /**将一个sheet转成最终的excel文件的blob对象，然后利用URL.createObjectURL下载 */
  private sheet2blob(sheet, sheetName = 'sheet1') {
    let workbook = {
      SheetNames: [sheetName],
      Sheets: {}
    };
    // 生成excel的配置项
    workbook.Sheets[sheetName] = sheet;
    const workbookBlob = this.workbook2blob(workbook);
    return this.addStyle(workbookBlob)
  }

  /**【*方法二】XLSX.utils.json_to_sheet: 将一个对象数组转成sheet */
  protected handleJson2Sheet() {
    this.sheetData = this.setSheetData();
    // 新建一个sheet
    const workSheet = XLSX.utils.json_to_sheet(this.sheetData, { skipHeader: true });
    // 新建一个sheetBook
    const workBook = XLSX.utils.book_new();
    // 将sheet写入book中
    XLSX.utils.book_append_sheet(workBook, workSheet, this.sheetName);

    const workbookBlob = this.workbook2blob(workBook);
    // 准备加样式
    return this.addStyle(workbookBlob);
  }

  /**
   * 将workbook转化成blob对象
   * @param workbook 工作簿
   * @returns 
   */
  private workbook2blob(workbook: XLSX.WorkBook) {
    // 生成excel的配置项
    const wopts: XLSX.WritingOptions = {
      bookType: "xlsx", // 要生成的文件类型
      bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
      type: "binary"
    };
    // 将book写入excel中
    const wbout = XLSX.write(workbook, wopts);
    const blob = new Blob([this.convertArrayBuffer(wbout)], { type: "application/octet-stream" });
    return blob;
  }

  /**将字符串转成ArrayBuffer */
  private convertArrayBuffer(str: string) {
    const buf = new ArrayBuffer(str.length), view = new Uint8Array(buf);
    for (let i = 0; i !== str.length; ++i) view[i] = str.charCodeAt(i) & 0xff;
    return buf;
  }

  /**
   * 使用xlsx-populate添加表格样式
   * @param workbookBlob 
   * @returns 
   */
  protected addStyle(workbookBlob) {
    return XlsxPopulate.fromDataAsync(workbookBlob).then(workbook => {
      this.workbook = workbook;
      this.addSheetsStyle();

      return workbook.outputAsync().then(
        // 创建blob地址
        (workbookBlob) => URL.createObjectURL(workbookBlob)
      )
    })
  }

  /**
   * 创建下载地址
   * @param blobUrl blob地址
   */
  private createDownLoadLink(blobUrl) {
    const aLink = document.createElement("a");
    aLink.setAttribute("href", blobUrl);
    aLink.setAttribute("download", `${this.workBookName}.xlsx`);
    aLink.click();
    aLink.remove();
  }
}