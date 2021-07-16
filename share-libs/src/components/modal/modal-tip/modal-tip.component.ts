import { Component, Input, OnInit } from '@angular/core';
import { TypeModalTip } from '../share-modal.model';

@Component({
  selector: 'app-modal-tip',
  templateUrl: './modal-tip.component.html',
  styleUrls: ['./modal-tip.component.less']
})
export class ShareModalTipComponent implements OnInit {


  constructor() { }
  @Input() type: TypeModalTip;
  /**tip提示语信息 */
  @Input() info: string;

  ngOnInit() {
  }

}


