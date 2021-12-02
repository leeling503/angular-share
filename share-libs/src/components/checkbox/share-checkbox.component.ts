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
  constructor(private upEl: ShareUpdataClassService, private el: ElementRef) {
    this.nativeEl = this.el.nativeElement;
  }
  /**是否选中*/
  @Input() modelChecked: boolean = false;
  /**是否属于第三种other状态(modelChecked为false才会显示为第三种状态)*/
  @Input() inIfOther: boolean = false;
  /**禁用*/
  @Input() inIfDisable: boolean = false;
  @Output() onClick: EventEmitter<any> = new EventEmitter();
  @Output() modelCheckedChange: EventEmitter<any> = new EventEmitter();
  classMap: any = {};
  nativeEl: HTMLElement;
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.modelChecked || changes.inIfOther || changes.inIfDisable) {
      this.upClass()
    }
  }

  ngOnInit() {
    this.upClass()
  }

  tiggerClick() {
    if (this.inIfDisable) return;
    this.modelChecked = !this.modelChecked;
    this.modelCheckedChange.emit(this.modelChecked);
    this.onClick.emit(this.modelChecked);
    this.upClass();
  }

  upClass() {
    let classMap = {
      "share-check-default": !this.modelChecked,
      "share-check-other": this.inIfOther,
      "share-check-selected": this.modelChecked,
      "share-check-disable": this.inIfDisable
    }
    this.upEl.updateElClass(this.nativeEl.querySelector('.share-cheack-box'), classMap);
  }

}
