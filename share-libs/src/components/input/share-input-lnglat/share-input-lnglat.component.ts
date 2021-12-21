import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { UtilChanges } from 'share-libs/src/utils';

/**经纬度输入专用组件 度分秒 */
@Component({
  selector: 'share-input-lnglat',
  templateUrl: './share-input-lnglat.component.html',
  styleUrls: ['./share-input-lnglat.component.less']
})
export class ShareInputLnglatComponent implements OnInit {

  constructor() { }
  @Input() model: number[] = [];
  @Output() modelChange: EventEmitter<number[]> = new EventEmitter()
  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (UtilChanges(changes, 'model')) {
      this.model = this.model || [];
    }
  }

  ngOnInit() { }

  onChange() {
    this.modelChange.emit(this.model)
  }
}
