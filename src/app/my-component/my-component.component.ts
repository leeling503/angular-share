import { Component, OnInit, Input, Optional, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { ShareModalRef } from 'share-libs/src/components/modal/modalRef.service';
@Component({
  selector: 'app-my-component',
  templateUrl: './my-component.component.html',
  styleUrls: ['./my-component.component.less'],
  // changeDetection:ChangeDetectionStrategy.OnPush
})
export class MyComponentComponent implements OnInit, OnChanges {

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data) {
      console.log('changes.data')
    }
  }

  constructor(@Optional() private modalRef: ShareModalRef) { }
  @Input() data: any = {};
  ngOnInit() {
    // this.modalRef.setEmitData("MyComponentComponent setEmitData")
    // console.log(this.modalRef.getInstance())
  }

}
