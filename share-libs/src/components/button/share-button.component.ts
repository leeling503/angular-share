import { BtnPara, BtnType, BtnSize } from './share-buttom';
import { Component, OnInit, Input, ElementRef, RendererFactory2, Renderer2, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { ShareUpdataClassService } from '../../services/share-updata-class.service';

@Component({
  selector: 'share-button,[share-button]',
  templateUrl: './share-button.component.html',
  styleUrls: ['./share-button.component.less'],
  providers: [ShareUpdataClassService],
  host: {
    "(click)": "triggerClick()"
  }
})
export class ShareButtonComponent implements OnInit {
  @Input() btnPara: BtnPara;//按钮配置
  @Input() btnPerIcon: string;//前置图标class
  @Input() btnSufIcon: string;//后置图标class
  @Input() btnWidth: number | string;//固定宽度
  @Input() btnHeight: number | string;//固定高度
  @Input() btnType: BtnType = 'primary';//按钮类型
  @Input() btnSize: BtnSize = 'default';//按钮大小
  @Input() btnText: string;//按钮文字
  @Input() btnClick: () => {};
  nativeEl: HTMLElement;
  renderer2: Renderer2;
  classMap: any = {};
  constructor(private el: ElementRef, private rendeFactory: RendererFactory2, private upElClass: ShareUpdataClassService) {
    this.nativeEl = this.el.nativeElement;
    this.renderer2 = this.rendeFactory.createRenderer(null, null)
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.btnPara) {
      this.btnClick = this.btnPara.btnClick;
      this.btnSize = this.btnPara.btnSize || 'default';
      this.btnType = this.btnPara.btnType || 'default';
      this.btnPerIcon = this.btnPara.btnPerIcon;
      this.btnSufIcon = this.btnPara.btnSufIcon;
      this.btnText = this.btnPara.btnText;
      this.setClassMap();
    }
    if (changes.slType || changes.slSize) {
      this.setClassMap();
    }
    if (changes.btnWidth || changes.btnHeight) {
      if (typeof this.btnWidth === 'number') {
        this.renderer2.setStyle(this.nativeEl.querySelector(".share-button"), "width", this.btnWidth + 'px')
      } else {
        this.renderer2.setStyle(this.nativeEl.querySelector(".share-button"), "width", this.btnWidth)
      }
      if (typeof this.btnHeight === 'number') {
        this.renderer2.setStyle(this.nativeEl.querySelector(".share-button"), "height", this.btnHeight + 'px')
      } else {
        this.renderer2.setStyle(this.nativeEl.querySelector(".share-button"), "height", this.btnHeight)
      }
    }
  }

  ngOnInit() {
    this.renderer2.setStyle(this.nativeEl, "display", 'inline-block')
    this.setClassMap();
  }

  setClassMap() {
    let classMap = {
      [`sl-button-size-${this.btnSize}`]: true,
      [`sl-button-type-${this.btnType}`]: true
    }
    this.upElClass.updateElClass(this.nativeEl.querySelector(".share-button"), classMap)
  }

  triggerClick() {
    this.btnClick && this.btnClick();
  }

}
