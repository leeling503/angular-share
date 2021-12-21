import { ShareUpdataClassService } from '../../services/share-updata-class.service';
import { Component, OnInit, Input, ElementRef, SimpleChanges, Output, EventEmitter, Renderer2 } from '@angular/core';

/**选择框 */
@Component({
  selector: 'share-check,[share-check]',
  templateUrl: './share-check.component.html',
  styleUrls: ['./share-check.component.less'],
  providers: [ShareUpdataClassService],
  host: {
    "(click)": "tiggerClick()"
  }
})
export class ShareCheckComponent implements OnInit {
  constructor(private upEl: ShareUpdataClassService, private el: ElementRef) {
    this.nativeEl = this.el.nativeElement;
  }
  /**是否选中*/
  @Input() model: boolean = false;
  /**是否属于第三种other状态(model为false才会显示为第三种状态)*/
  @Input() inIfOther: boolean = false;
  /**禁用*/
  @Input() inIfDisable: boolean = false;
  @Output() modelChange: EventEmitter<boolean> = new EventEmitter();
  @Output() onClick: EventEmitter<boolean> = new EventEmitter();
  /**集合类map */
  classMap: { [key: string]: boolean } = {};
  nativeEl: HTMLElement;
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.model || changes.inIfOther || changes.inIfDisable) {
      this.upClass()
    }
  }

  ngOnInit() {
    this.upClass()
  }

  /**点击事件触发 */
  tiggerClick() {
    /**禁用直接返回 */
    if (this.inIfDisable) return;
    /**更正选中状态 */
    this.model = !this.model;
    this.modelChange.emit(this.model);
    this.onClick.emit(this.model);
    this.upClass();
  }

  /**更新选框的类名 */
  private upClass() {
    let classMap = {
      "share-check-default": !this.model,
      "share-check-other": this.inIfOther,
      "share-check-selected": this.model,
      "share-check-disable": this.inIfDisable
    }
    this.upEl.updateElClass(this.nativeEl.querySelector('.share-check'), classMap);
  }

}
