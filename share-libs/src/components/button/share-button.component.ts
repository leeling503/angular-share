import { Component, OnInit, Input, ElementRef, RendererFactory2, Renderer2, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { ShareUpdataClassService } from '../../services/share-updata-class.service';
import { IconClass } from 'share-libs/src/enum/icon.enum';
import { ShareBtn } from './share-buttom';
import { BtnSize, BtnType } from 'share-libs/src/enum';

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

  constructor(private el: ElementRef, private rendeFactory: RendererFactory2, private upElClass: ShareUpdataClassService) {
    this.nativeEl = this.el.nativeElement;
    this.renderer2 = this.rendeFactory.createRenderer(null, null)
  }

  @Input() inPara: ShareBtn;//按钮配置
  @Input() btnClick: () => {};
  nativeEl: HTMLElement;
  renderer2: Renderer2;
  classMap: any = {};
  /**前置图标class*/
  _iconPer: IconClass;
  /**后置图标class*/
  _iconSuf: IconClass;

  _type: BtnType;
  _size: BtnSize;
  /**设置宽高 ，优先级高于size */
  _width: number;
  _height: number;
  _text: string;
  _disable: boolean;
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.inPara && this.inPara) {
      this.inPara = Object.assign({}, this.inPara);
      this.btnClick = this.inPara.click;
      this.setClassMap();
      this.setConfig();
    }
  }

  ngOnInit() {
    this.renderer2.setStyle(this.nativeEl, "display", 'inline-block');
    this.setClassMap();
  }

  setConfig() {
    this._size = this.inPara.size || BtnSize.default;
    this._type = this.inPara.type || BtnType.default;
    this._disable = this.inPara.disable;
    this._iconPer = this.inPara.iconPer;
    this._iconSuf = this.inPara.iconSuf;
    this._text = this.inPara.text;
    this._width = this.inPara.width;
    this._height = this.inPara.height;
  }


  setClassMap() {
    let classMap = {
      [`sl-button-size-${this._size}`]: true,
      [`sl-button-type-${this._type}`]: true,
      [`E_D`]: this._disable,
    }
    this.upElClass.updateElClass(this.nativeEl.querySelector(".share-button"), classMap)
  }

  triggerClick() {
    !this._disable && this.btnClick && this.btnClick();
  }

}
