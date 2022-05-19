import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { UtilChanges } from 'share-libs/utils';
import { ShareFormItems } from './share-form.model';

@Component({
  selector: 'share-form',
  templateUrl: './share-form.component.html',
  styleUrls: ['./share-form.component.less']
})
export class ShareFormComponent implements OnInit {

  constructor() { }
  @Input() inItems: ShareFormItems;
  @Input() modelData: any;
  data: any = {};
  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (UtilChanges(changes, 'modelData')) {
      this.data = this.modelData || {};
    }
  }
  ngOnInit() { }

}
