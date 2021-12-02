import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { UtilChanges } from 'share-libs/src/utils';

@Component({
  selector: 'share-lnglat-input',
  templateUrl: './share-lnglat-input.component.html',
  styleUrls: ['./share-lnglat-input.component.less']
})
export class ShareLnglatInputComponent implements OnInit {

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

  ngOnInit() {
  }
  onChange() {
    console.log(this.model)
  }
}
