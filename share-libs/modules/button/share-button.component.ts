import { Component, OnInit, Input, ElementRef, RendererFactory2, Renderer2, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { ShareUpdataClassService } from '../../services/share-updata-class.service';
import { IconClass } from 'share-libs/enum/icon.enum';
import { ShareParaBtn } from './share-button.model';
import { SizeBtn, TypeBtn, ColorEnum, GlClass } from 'share-libs/enum';
import { UtilChanges, UtilChangesUndefined, UtilChangesValue } from 'share-libs/utils';

/**公用组件按钮 */
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
    this.renderer2 = this.rendeFactory.createRenderer(null, null);
  }
  /**按钮配置(异步传入无效)*/
  @Input() inPara: ShareParaBtn = new ShareParaBtn();
  /**前置图片 */
  @Input() inIconPer: IconClass;
  /**后置图片 */
  @Input() inIconSuf: IconClass;
  /**按钮类型 */
  @Input() inType: TypeBtn;
  /**按钮大小 */
  @Input() inSize: SizeBtn;
  /**按钮宽 */
  @Input() inWidth: number;
  /**按钮高 */
  @Input() inHeight: number;
  /**按钮内文字*/
  @Input() inText: string;
  /**是否禁用 */
  @Input() inIfDisable: boolean;
  /**文字颜色*/
  @Input() inColor: ColorEnum;
  /**背景颜色 */
  @Input() inColorBG: ColorEnum;
  /**边框颜色 */
  @Input() inColorBD: ColorEnum;
  /**前置图标点击事件 */
  @Input() inClickPer: (event?: MouseEvent) => any;
  /**按钮点击事件*/
  @Input() inClick: (event?: MouseEvent) => any;
  /**后置图标点击事件*/
  @Input() inClickSuf: (event?: MouseEvent) => any;
  /**按钮点击事件*/
  @Output() onClick: EventEmitter<MouseEvent> = new EventEmitter();
  private defaultPara: ShareParaBtn = new ShareParaBtn();
  nativeEl: HTMLElement;
  renderer2: Renderer2;
  classMap: any = {};
  ngOnChanges(changes: SimpleChanges): void {
    if (UtilChanges(changes, 'inType') || UtilChanges(changes, 'inSize')) {
      this.setClassMap()
    }
    if (UtilChanges(changes, 'inWidth') || UtilChanges(changes, 'inHeight') || UtilChanges(changes, 'inColor') || UtilChanges(changes, 'inColorBG') || UtilChanges(changes, 'inColorBD')) {
      this.setStyleByPara();
    }
  }

  ngOnInit() {
    this.setConfig();
    this.setStyleByPara();
  }

  ngAfterViewInit(): void {
    this.renderer2.setStyle(this.nativeEl, "display", 'inline-block');
    this.setClassMap();
  }

  /**相关配置设置 */
  setConfig() {
    let para: ShareParaBtn = Object.assign({}, this.defaultPara, this.inPara)
    this.inSize = this.inSize || para.size;
    this.inType = this.inType || para.type;
    this.inIfDisable = this.inIfDisable || para.ifDisable;
    this.inIconPer = this.inIconPer || para.iconPer;
    this.inIconSuf = this.inIconSuf || para.iconSuf;
    this.inText = this.inText || para.text;
    this.inWidth = this.inWidth || para.width;
    this.inHeight = this.inHeight || para.height;
    this.inColor = this.inColor || para.color;
    this.inColorBG = this.inColorBG || para.colorBG;
    this.inColorBD = this.inColorBD || para.colorBD;
    this.inClick = this.inClick || para.click;
    this.inClickPer = this.inClickPer || para.clickPer;
    this.inClickSuf = this.inClickSuf || para.clickSuf;
  }

  setStyleByPara() {
    let el = this.nativeEl.querySelector(".share-button");
    if (!el) return;
    if (typeof this.inWidth === 'number') {
      this.renderer2.setStyle(el, "width", this.inWidth + 'px')
    } else {
      this.renderer2.setStyle(el, "width", this.inWidth)
    }
    if (typeof this.inHeight === 'number') {
      this.renderer2.setStyle(el, "height", this.inHeight + 'px')
    }
    if (this.inColorBG) {
      this.renderer2.setStyle(el, "background-color", this.inColorBG);
    }
    if (this.inColorBD || this.inColorBG) {
      this.renderer2.setStyle(el, "border-color", this.inColorBD || this.inColorBG);
    }
    if (this.inColor) {
      this.renderer2.setStyle(el, "color", this.inColor)
    }
  }

  setClassMap() {
    let classMap = {
      [`sl-button-size-${this.inSize}`]: true,
      [`sl-button-type-${this.inType}`]: true,
      [GlClass.E_D]: this.inIfDisable,
    }
    this.upElClass.updateElClass(this.nativeEl.querySelector(".share-button"), classMap)
  }

  triggerClick($event: MouseEvent) {
    if (this.inIfDisable) return;
    this.inClick && this.inClick($event);
    this.onClick.emit($event)
  }

  /**前缀图标点击事件 */
  onElClickPer($event: MouseEvent) {
    if (this.inClickPer) {
      $event.stopPropagation()
      this.inClickPer($event);
    }
  }

  /**后缀图标点击事件 */
  onElClickSuf($event: MouseEvent) {
    if (this.inClickSuf) {
      $event.stopPropagation()
      this.inClickSuf($event);
    }
  }
}
