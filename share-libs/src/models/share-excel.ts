export interface WorkBookModel {
  name: string;
  sheet: any;
  [propname: string]: any;
}

/**各列坐标取值 */
export type Alphabet = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | "L" | "M" | "N" | "O" | "P" | "Q" | "R" | "S" | "T" | "U" | "V" | "W" | "X" | "Y" | "Z";

/**工作表 */
export type SheetData = { [key in Alphabet]?: string | number }

/**生成工作表的方式 */
export type ToSheetWay = 'table' | 'json';

/**行列信息 */
export interface RowColInfo {
  /**A列：空白列 */
  aRange: string;
  /**标题行 */
  theadRange: string;
  /**表主体 */
  tbodyRange: string;
  /**表内容 */
  tableRange: string;
  /**其它 */
  [propname: string]: string;
}