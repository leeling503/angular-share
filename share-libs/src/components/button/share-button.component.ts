import { BtnType, BtnSize, ShareBtnPara } from './share-buttom';
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
  @Input() btnPara: ShareBtnPara;//按钮配置
  @Input() btnPerIcon: string = "date-day-icon";//前置图标class
  @Input() btnSufIcon: string;//后置图标class
  /**按钮类型 决定背景色，边框色 和字体颜色  */
  @Input() btnType: BtnType = 'default';
  /**决定按钮的最小宽高度 'small' | 'default' | 'large'  65-28| 75-30 | 85-32  */
  @Input() btnSize: BtnSize = 'default';//按钮大小
  /**设置宽高 ， 优先级高于size */
  @Input() btnWidth: number | string;
  @Input() btnHeight: number | string;
  /**按钮文字*/
  @Input() btnText: string;
  /**是否禁用*/
  @Input() btnDisable: boolean;
  @Input() btnClick: () => {};
  nativeEl: HTMLElement;
  renderer2: Renderer2;
  classMap: any = {};
  constructor(private el: ElementRef, private rendeFactory: RendererFactory2, private upElClass: ShareUpdataClassService) {
    this.nativeEl = this.el.nativeElement;
    this.renderer2 = this.rendeFactory.createRenderer(null, null)
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.btnPara && this.btnPara) {
      this.btnPara = Object.assign({}, this.btnPara);
      this.btnClick = this.btnPara.btnClick;
      this.btnSize = this.btnPara.btnSize || 'default';
      this.btnType = this.btnPara.btnType || 'default';
      this.btnDisable = this.btnPara.btnDisable;
      this.btnPerIcon = this.btnPara.btnPerIcon;
      this.btnSufIcon = this.btnPara.btnSufIcon;
      this.btnText = this.btnPara.btnText;
      this.setClassMap();
    }
    if (changes.btnSize || changes.btnDisable || changes.btnDisable) {
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
    this.renderer2.setStyle(this.nativeEl, "display", 'inline-block');
    this.setClassMap();
  }

  setConfig() {

  }

  setClassMap() {
    let classMap = {
      [`sl-button-size-${this.btnSize}`]: true,
      [`sl-button-type-${this.btnType}`]: true,
      [`sl-button-type-disable`]: this.btnDisable,
    }
    this.upElClass.updateElClass(this.nativeEl.querySelector(".share-button"), classMap)
  }

  triggerClick() {
    !this.btnDisable && this.btnClick && this.btnClick();
  }

}
