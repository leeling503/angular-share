import { Component, OnInit, Input, ElementRef, RendererFactory2, Renderer2, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { ShareUpdataClassService } from '../../services/share-updata-class.service';
import { IconClass } from 'share-libs/src/enum/icon.enum';
import { ShareBtn } from './share-buttom';
import { SizeBtn, TypeBtn, ColorEnum } from 'share-libs/src/enum';
import { UtilChanges, UtilChangesUndefined, UtilChangesValue } from 'share-libs/src/utils';

@Component({
  selector: 'share-button,[share-button]',
  templateUrl: './share-button.component.html',
  styleUrls: ['./share-button.component.less'],
  providers: [ShareUpdataClassService],
  host: {
    "(click)": "triggerClick($event)"
  }
})
export class ShareButtonComponent implements OnInit {

  constructor(private el: ElementRef, private rendeFactory: RendererFactory2, private upElClass: ShareUpdataClassService) {
    this.nativeEl = this.el.nativeElement;
    this.renderer2 = this.rendeFactory.createRenderer(null, null)
  }
  /**按钮配置*/
  @Input() inPara: ShareBtn = new ShareBtn();
  @Input() inIconPer: IconClass;
  @Input() inIconSuf: IconClass;
  @Input() inType: TypeBtn;
  @Input() inSize: SizeBtn;
  @Input() inWidth: number;
  @Input() inHeight: number;
  @Input() inText: string;
  @Input() inDisable: boolean;
  @Input() inColor: ColorEnum;
  @Input() inColorBG: ColorEnum;
  @Input() inColorBD: ColorEnum;
  @Input() inClickPer: (event?: MouseEvent) => any;
  @Input() inClick: (event?: MouseEvent) => any;
  @Input() inClickSuf: (event?: MouseEvent) => any;
  @Output() onClick: EventEmitter<any> = new EventEmitter();
  nativeEl: HTMLElement;
  renderer2: Renderer2;
  classMap: any = {};
  /**前置图标class*/
  /**后置图标class*/
  _iconPer: IconClass;
  _iconSuf: IconClass;
  _type: TypeBtn = TypeBtn.default;
  _size: SizeBtn = SizeBtn.default;
  _width: number;
  _height: number;
  _text: string;
  _disable: boolean;
  _color: ColorEnum;
  _colorBG: ColorEnum;
  _colorBD: ColorEnum;
  _clickPer: (event?: MouseEvent) => any;
  _click: (event?: MouseEvent) => any;
  _clickSuf: (event?: MouseEvent) => any;
  ngOnChanges(changes: SimpleChanges): void {
    if (UtilChangesValue(changes, 'inPara')) {
      this.setConfig();
      this.setClassMap();
      this.setStyleByPara();
    }
    if (UtilChanges(changes, 'inIconPer')) {
      this._iconPer = this.inIconPer;
    }
    if (UtilChanges(changes, 'inIconSuf')) {
      this._iconSuf = this.inIconSuf;
    }
    if (UtilChangesValue(changes, 'inText')) {
      this._text = this.inText
    }
    if (UtilChanges(changes, 'inType') || UtilChanges(changes, 'inSize') || UtilChanges(changes, 'inDisable')) {
      this._type = this.inType;
      this._size = this.inSize;
      this.setClassMap()
    }
    if (UtilChanges(changes, 'inWidth') || UtilChanges(changes, 'inHeight') || UtilChanges(changes, 'inColor') || UtilChanges(changes, 'inColorBG') || UtilChanges(changes, 'inColorBD')) {
      this._width = this.inWidth;
      this._height = this.inHeight;
      this._color = this.inColor;
      this._colorBG = this.inColorBG;
      this._colorBD = this.inColorBD;
      this.setStyleByPara();
    }
    if (UtilChangesValue(changes, 'inClickPer')) {
      this._clickPer = this.inClickPer
    }
    if (UtilChangesValue(changes, 'inClick')) {
      this._click = this.inClick
    }
    if (UtilChangesValue(changes, 'inClickSuf')) {
      this._clickSuf = this.inClickSuf
    }
  }

  ngOnInit() {
    this.renderer2.setStyle(this.nativeEl, "display", 'inline-block');
    this.setClassMap();
  }

  setConfig() {
    this._size = this.inSize || this.inPara.size || this._size;
    this._type = this.inType || this.inPara.type || this._type;
    this._disable = this.inDisable || this.inPara.disable;
    this._iconPer = this.inIconPer || this.inPara.iconPer;
    this._iconSuf = this.inIconSuf || this.inPara.iconSuf;
    this._text = this.inText || this.inPara.text;
    this._width = this.inWidth || this.inPara.width;
    this._height = this.inHeight || this.inPara.height;
    this._color = this.inColor || this.inPara.color;
    this._colorBG = this.inColorBG || this.inPara.colorBG;
    this._colorBD = this.inColorBD || this.inPara.colorBD;
    this._click = this.inClick || this.inPara.click;
    this._clickPer = this.inClickPer || this.inPara.clickPer;
  }

  setStyleByPara() {
    if (typeof this._width === 'number') {
      this.renderer2.setStyle(this.nativeEl.querySelector(".share-button"), "width", this._width + 'px')
    }
    if (typeof this._height === 'number') {
      this.renderer2.setStyle(this.nativeEl.querySelector(".share-button"), "height", this._height + 'px')
    }
    if (this._colorBG) {
      this.renderer2.setStyle(this.nativeEl.querySelector(".share-button"), "background-color", this._colorBG);
    }
    if (this._colorBD || this._colorBG) {
      this.renderer2.setStyle(this.nativeEl.querySelector(".share-button"), "border-color", this._colorBD || this._colorBG);
    }
    if (this._color) {
      this.renderer2.setStyle(this.nativeEl.querySelector(".share-button"), "color", this._color)
    }
  }

  setClassMap() {
    let classMap = {
      [`sl-button-size-${this._size}`]: true,
      [`sl-button-type-${this._type}`]: true,
      [`E_D`]: this._disable,
    }
    this.upElClass.updateElClass(this.nativeEl.querySelector(".share-button"), classMap)
  }

  triggerClick($event: MouseEvent) {
    if (this._disable) return;
    this._click && this._click($event);
    this.onClick.emit($event)
  }

  onElClickPer($event: MouseEvent) {
    if (this._clickPer) {
      $event.stopPropagation()
      this._clickPer($event);
    }
  }
  onElClickSuf($event: MouseEvent) {
    if (this._clickSuf) {
      $event.stopPropagation()
      this._clickSuf($event);
    }
  }
}
