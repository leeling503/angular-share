import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ShareFormItems } from 'share-libs/src/components/form/share-form.model';
import { RadioOption } from 'share-libs/src/components/radio/share-radio.model';

@Component({
  selector: 'app-ex-share-form',
  templateUrl: './ex-share-form.component.html',
  styleUrls: ['./ex-share-form.component.less']
})
export class ExShareFormComponent implements OnInit {

  constructor() { };
  @ViewChild('tempel', { static: true }) tempel: TemplateRef<any>;
  @ViewChild('latpel', { static: true }) latpel: TemplateRef<any>;
  items: ShareFormItems = [
    { title: '姓名', key: 'name', width: 30 },
    { title: '年龄', key: 'age', width: 30 },
    { title: '生日', key: 'birthday', width: 30 },
    { title: '性别', key: 'sex', width: 30, height: 2 },
    { title: '生肖', key: 'a', type: 'template', width: 60, height: 2 },
    { title: '经纬度', key: 'a', type: 'template', width: 60, height: 2 },
  ]
  data: any = {
    name: '表单',
    age: '1',
    birthday: '2021-11-2',
    sex: '女',
    a: '龙',
    radio: 'A'
  }
  options: RadioOption[] = [{ key: '', value: 'A' }, { key: '', value: 'B' }, { key: '', value: 'C' }]
  latModel: number[];
  ngOnInit() {
  }
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.

    Promise.resolve().then(res => this.items[4].values = this.tempel);
    Promise.resolve().then(res => this.items[5].values = this.latpel);
  }

  onRadioChange() {
    console.log(this.data)
  }
}
