import { OverlayRef } from '@angular/cdk/overlay';
import { Component, OnInit, Input, SimpleChanges, ViewChild, ViewContainerRef, ComponentFactory, ComponentFactoryResolver, ComponentRef, Type, EventEmitter, Injector, TemplateRef } from '@angular/core';
import { ShareParaBtn } from '../../button/share-button.model';
import { IconClass, TypeBtn } from 'share-libs/src/enum';
import { ShareModalCbData, TypeFooterBtn } from '../share-modal.model';

export abstract class ShareModalRef<T = any> {
  /**获得ShareModal实例 */
  abstract getInstance(): ShareModalComponent<T>;
  /**需弹窗打开后调用 获得传入的组件实例*/
  abstract getComponentInstabce(): T | undefined;
  /**调用后将会关闭ShareModal弹窗 */
  abstract emitClose(data?: ShareModalCbData<T>): void;
  /**弹窗打开后的回调 */
  abstract onOpen(cb: (e: ShareModalCbData<T>) => any): this;
  /**弹窗关闭后的回调 */
  abstract onClose(cb: (e: ShareModalCbData<T>) => any): this;
  /**弹窗关闭前的回调（点击确定按钮时回调必须返回true才会关闭） */
  abstract onCloseBefor(cb: (e: ShareModalCbData<T>) => boolean): this;
}

/**
 * 弹窗主组件
 */
@Component({
  selector: 'app-modal',
  templateUrl: './share-modal.component.html',
  styleUrls: ['./share-modal.component.less'],
})
export class ShareModalComponent<T = any> extends ShareModalRef implements OnInit {
  constructor(private factory: ComponentFactoryResolver, private viewContainer: ViewContainerRef,) {
    super()
  }
  /**弹出窗标题 */
  @Input() title: string;
  /**弹出窗template内容 */
  @Input() template: TemplateRef<any>;
  /**弹出窗内组件内容 */
  @Input() component: Type<T>
  /**弹出窗内组件参数 */
  @Input() componentPara: Partial<T>
  @ViewChild('bodyContainer', { read: ViewContainerRef, static: true }) private bodyContainer: ViewContainerRef;
  /**modal的弹窗实例 (modal服务将其实例化) */
  public overlayRef: OverlayRef;
  private componentRef: ComponentRef<T>;
  /**弹窗打开后的触发事件 */
  private emitModalOpen: EventEmitter<ShareModalCbData<T>> = new EventEmitter();
  /**弹窗关闭后的触发事件 */
  private emitModalClose: EventEmitter<ShareModalCbData<T>> = new EventEmitter();
  /**弹窗关闭前的触发事件 */
  private emitModalCloseBefor: EventEmitter<ShareModalCbData<T>> = new EventEmitter();
  /**关闭控制权是否属于组件本身（如果外部调用onCloseBefor且点击确定按钮将会由外部回调决定，其余关闭情况会调用回调且一定关闭） */
  private closeCtr: boolean = true;
  /**弹窗所有按钮组*/
  private BTNS: { [key in TypeFooterBtn]?: ShareParaBtn } = {
    primary: { text: '确定', type: TypeBtn.primary, iconPer: IconClass.confirm, click: () => { this.emitClose({ closeType: 0 }) } },
    close: { text: '关闭', type: TypeBtn.danger, iconPer: IconClass.close, click: () => { this.emitClose({ closeType: 1 }) } },
    cancel: { text: '取消', type: TypeBtn.gray, click: () => { this.emitClose({ closeType: 2 }) } },
  }
  /**提示框显示的按钮组*/
  public footerBtns: ShareParaBtn[] = [];
  set btns(btns: Array<TypeFooterBtn | ShareParaBtn>) {
    this.footerBtns = btns.map(e => { return typeof e === 'string' ? this.BTNS[e] : e; });
  }

  ngOnChanges(changes: SimpleChanges): void { }

  ngOnInit() {
    if (this.template) {
      this.bodyContainer.clear();
      this.bodyContainer.createEmbeddedView(this.template);
    } else if (this.component) {
      this.bodyContainer.clear();
      let factory = this.factory.resolveComponentFactory(this.component);
      const childInjector = Injector.create({
        providers: [{ provide: ShareModalRef, useValue: this }],
        parent: this.viewContainer.parentInjector
      });
      this.componentRef = factory.create(childInjector);
      /**初始组件的参数 */
      if (this.componentPara) {
        Object.assign(this.componentRef.instance, this.componentPara);
      }
      this.componentRef.changeDetectorRef.detectChanges();
    }
  }

  ngAfterViewInit(): void {
    if (this.componentRef) {
      this.bodyContainer.insert(this.componentRef.hostView);
    }
    this.promise(this.emitModalOpen)
  }

  onEmitClose() {
    this.emitClose();
  }

  /**异步调用事件 */
  private promise(modalEvent: EventEmitter<any>, data: ShareModalCbData<T> = {}) {
    Promise.resolve().then(() => {
      data.data = this
      modalEvent.emit(data)
    })
  }

  onOpen(cb: (e: ShareModalCbData<T>) => any): this {
    this.emitModalOpen.subscribe(cb);
    return this
  }
  onClose(cb: (e: ShareModalCbData<T>) => any): this {
    this.emitModalClose.subscribe(cb);
    return this
  }
  onCloseBefor(cb: (e: ShareModalCbData<T>) => boolean): this {
    this.closeCtr = false;
    this.emitModalCloseBefor.subscribe((data: ShareModalCbData<T>) => {
      let res = cb(data);
      /**只有确定按钮在有关闭前回调时才需要通过回调结果决定是否关闭 */
      if (res && data.closeType === 0) {
        this.promise(this.emitModalClose, data);
        this.overlayRef && this.overlayRef.detach();
      }
    });
    return this
  }
  /**触发弹窗关闭事件，默认关闭类型closeType：1  关闭 */
  emitClose(data: ShareModalCbData<T> = { closeType: 1 }) {
    /**closeCtr为false标识外部调用了onCloseBefor方法 */
    if (!this.closeCtr) {
      this.promise(this.emitModalCloseBefor, data);
    }
    /**非点击确定按钮 closeType === 0 必定关闭， 外部未调用onCloseBefor必定关闭*/
    if (this.closeCtr || data.closeType !== 0) {
      this.promise(this.emitModalClose, data);
      this.overlayRef && this.overlayRef.detach();
    }
  }
  getInstance(): ShareModalComponent<T> {
    return this;
  }
  //在Open后调用
  getComponentInstabce(): T | undefined {
    return this.componentRef && this.componentRef.instance
  }
  ngOnDestroy(): void { }
}