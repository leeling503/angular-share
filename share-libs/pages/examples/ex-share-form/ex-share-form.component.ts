import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ShareFormItems } from 'share-libs/modules/form/share-form.model';
import { RadioOption } from 'share-libs/modules/radio/share-radio.model';

@Component({
  selector: 'app-ex-share-form',
  templateUrl: './ex-share-form.component.html',
  styleUrls: ['./ex-share-form.component.less']
})
export class ExShareFormComponent implements OnInit {

  constructor() { };
  @ViewChild('tempelA', { static: true }) tempelA: TemplateRef<any>;
  @ViewChild('tempelB', { static: true }) tempelB: TemplateRef<any>;
  @ViewChild('latpel', { static: true }) latpel: TemplateRef<any>;
  items: ShareFormItems = [
    { title: '姓名', key: 'name', width: 30 },
    { title: '年龄', key: 'age', width: 30, unit: '岁' },
    { title: '生日', key: 'birthday', width: 30 },
    { title: '性别', key: 'sex', width: 30, height: 2 },
    { title: '生肖', key: 'a', type: 'template', width: 60, height: 2 },
    { title: '经纬度', key: 'b', type: 'template', widthV: '500px', width: 60, require: true },
    { title: '生肖c', key: 'c', type: 'template', width: 60, height: 2 },
  ]
  data: any = {
    name: '表单',
    age: '1',
    birthday: '2021-11-2',
    sex: '女',
    a: '龙',
    radio: 'A',
  }
  options: RadioOption[] = [{ key: '1', value: 'A' }, { key: '2', value: 'B' }, { key: '3', value: 'C' }]
  latModel: number[];
  ngOnInit() {
  }
  ngAfterViewInit(): void {
    Promise.resolve().then(res => this.items[4].ref = this.tempelA);
    Promise.resolve().then(res => this.items[5].ref = this.latpel);
    Promise.resolve().then(res => this.items[6].ref = this.tempelB);
  }

  onRadioChange() {
    console.log(this.data)
  }
  onModelChange() {
    console.log(this.data)
  }
}
