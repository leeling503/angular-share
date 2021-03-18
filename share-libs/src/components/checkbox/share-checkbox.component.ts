import { UpdataElClassService } from './../../servers/updata-el-class.service';
import { Component, OnInit, Input, ElementRef, SimpleChanges, Output, EventEmitter, Renderer2 } from '@angular/core';

@Component({
  selector: 'share-checkbox,[share-checkbox]',
  templateUrl: './share-checkbox.component.html',
  styleUrls: ['./share-checkbox.component.less'],
  providers: [UpdataElClassService],
  host: {
    "(click)": "tiggerClick()"
  }
})
export class ShareCheckboxComponent implements OnInit {
  @Input() inIsChecked: boolean = false;//是否选中
  @Input() inIsOther: boolean = false;//是否属于第三种other状态(inIsChecked为false才会显示为第三种状态)
  @Input() inIsDisable: boolean = false;
  @Input() inIsFather: boolean = false;
  @Output() onClick: EventEmitter<any> = new EventEmitter();
  classMap: any = {};
  nativeEl: HTMLElement;
  constructor(private upEl: UpdataElClassService, private el: ElementRef) {
    this.nativeEl = this.el.nativeElement;
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.inIsChecked || changes.inIsOther || changes.inIsDisable) {
      this.upClass()
    }
  }

  ngOnInit() {
    this.upClass()
  }

  tiggerClick() {
    if (this.inIsDisable) return;
    if (this.inIsFather) { this.onClick.emit(!this.inIsChecked); return }
    this.inIsChecked = !this.inIsChecked;
    this.upClass();
    this.onClick.emit(this.inIsChecked);
  }

  upClass() {
    let classMap = {
      "share-check-default": !this.inIsChecked,
      "share-check-other": this.inIsOther,
      "share-check-selected": this.inIsChecked,
      "share-check-disable": this.inIsDisable
    }
    this.upEl.updateElClass(this.nativeEl.querySelector('.share-cheack-box'), classMap);
  }

}
