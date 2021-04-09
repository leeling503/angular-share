import { Component, OnInit } from '@angular/core';
import { SelectConfig, SelectOption } from 'share-libs/src/components/select/share-select.model';

@Component({
  selector: 'ex-share-select',
  templateUrl: './ex-share-select.component.html',
  styleUrls: ['./ex-share-select.component.less']
})
export class ExShareSelectComponent implements OnInit {

  constructor() { }
  option;
  options: SelectOption[] = [];
  selectConfig: SelectConfig = new SelectConfig();
  a = [
    {
      key: '1', value: 'A', children:
        [{
          key: '11', value: 'Aa', children:
            [{ key: '111', value: 'Aaa' }, { key: '112', value: 'Aab' }]
        }, {
          key: '12', value: 'Absd', children:
            [{ key: '121', value: 'Abasd' }, { key: '122', value: 'Abbsd' }]
        }]
    }, {
      key: '2', value: 'B', children:
        [{ key: '21', value: 'Ba' }]
    }, {
      key: '3', value: 'C', children:
        [{ key: '31', value: 'Ca' }]
    }, {
      key: '4', value: 'D', children:
        [{ key: '41', value: 'Da' }]
    }, {
      key: '5', value: 'E', children:
        [{ key: '51', value: 'Ea' }]
    },
  ]
  ngOnInit() {
    setTimeout(() => {
      this.options = this.a;
    }, 1000);
    this.selectConfig = {
      /**是否显示control标签 */
      ifFlag: true,
      /**是否显示选项多选框  */
      ifCheck: true,
      /**是否显示清空按钮 */
      ifClear: true,
      /**是否是多选 */
      ifMulti: false,
      /**是否拥有激活项状态 */
      ifActive: true,
      /**提示语 */
      placeholder: '请选择示例数据',
      /**下拉无数据提示 */
      noneTip: '暂无数据',
      /**至少选择一个，默认选中第一个 */
      leastOne: false,
      openWidth: '200px',
    }
  }

  modelOptionChange($event) {
    console.log($event)
  }

}
