import { ShareUpdataClassService } from '../../services/share-updata-class.service';
import { Component, OnInit, Input, ElementRef, SimpleChanges, Output, EventEmitter, Renderer2 } from '@angular/core';

@Component({
  selector: 'share-checkbox,[share-checkbox]',
  templateUrl: './share-checkbox.component.html',
  styleUrls: ['./share-checkbox.component.less'],
  providers: [ShareUpdataClassService],
  host: {
    "(click)": "tiggerClick()"
  }
})
export class ShareCheckboxComponent implements OnInit {
  @Input() modelChecked: boolean = false;//是否选中
  @Input() inIsOther: boolean = false;//是否属于第三种other状态(modelChecked为false才会显示为第三种状态)
  @Input() inIsDisable: boolean = false;
  @Input() inIsFather: boolean = false;
  @Output() onClick: EventEmitter<any> = new EventEmitter();
  @Output() modelCheckedChange: EventEmitter<any> = new EventEmitter();
  classMap: any = {};
  nativeEl: HTMLElement;
  constructor(private upEl: ShareUpdataClassService, private el: ElementRef) {
    this.nativeEl = this.el.nativeElement;
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.modelChecked || changes.inIsOther || changes.inIsDisable) {
      this.upClass()
    }
  }

  ngOnInit() {
    this.upClass()
  }

  tiggerClick() {
    if (this.inIsDisable) return;
    // if (this.inIsFather) { this.onClick.emit(!this.modelChecked); return }
    this.modelChecked = !this.modelChecked;
    // this.upClass();
    this.modelCheckedChange.emit(this.modelChecked);
    this.onClick.emit(this.modelChecked);
    this.upClass();
  }

  upClass() {
    let classMap = {
      "share-check-default": !this.modelChecked,
      "share-check-other": this.inIsOther,
      "share-check-selected": this.modelChecked,
      "share-check-disable": this.inIsDisable
    }
    this.upEl.updateElClass(this.nativeEl.querySelector('.share-cheack-box'), classMap);
  }

}
