import { Component, ElementRef } from '@angular/core';
import { ShareSelect } from '../select/select.component';
import { SelectPara } from '../share-select.model';

@Component({
  selector: 'share-select-panel',
  templateUrl: './share-select-panel.component.html',
  styleUrls: ['./share-select-panel.component.less']
})
export class ShareSelectPanelComponent extends ShareSelect {
  constructor(private el: ElementRef) {
    super();
    this.nativeEl = this.el.nativeElement;
  }
}
