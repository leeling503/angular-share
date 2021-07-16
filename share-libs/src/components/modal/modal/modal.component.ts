import { OverlayRef } from '@angular/cdk/overlay';
import { Component, OnInit, Input, SimpleChanges, ViewChild, ViewContainerRef, ComponentFactory, ComponentFactoryResolver, ComponentRef, Type, EventEmitter, Injector, TemplateRef } from '@angular/core';
import { ShareModalRef } from '../modalRef.service';
import { Observable } from 'rxjs/internal/Observable';
import { ShareBtn } from '../../button/share-buttom';
import { IconClass, TypeBtn } from 'share-libs/src/enum';
import { Icon } from 'leaflet';
import { ModalCloseData, TypeFooterBtn } from '../share-modal.model';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.less'],
})
export class ShareModalComponent<T = any> extends ShareModalRef implements OnInit {
  constructor(private factory: ComponentFactoryResolver, private viewContainer: ViewContainerRef,) {
    super()
  }
  @Input() title: string;//弹出窗标题
  @Input() template: TemplateRef<any>;
  @Input() component: Type<T>
  @Input() componentPara: Partial<T>
  @ViewChild('bodyContainer', { read: ViewContainerRef, static: true }) private bodyContainer: ViewContainerRef;
  footerBtns: ShareBtn[] = [];
  BTNS: { [key in TypeFooterBtn]?: ShareBtn } = {
    primary: { text: '确定', type: TypeBtn.primary, iconPer: IconClass.confirm, click: () => { this.closeModal({ type: 0 }) } },
    cancel: { text: '取消', type: TypeBtn.danger, click: () => { this.closeModal({ type: 1 }) } },
    close: { text: '关闭', type: TypeBtn.gray, click: () => { this.closeModal({ type: 2 }) } },
  }
  /**model的弹窗实例 */
  overlayRef: OverlayRef;
  private contentComponentRef: ComponentRef<T>;
  private emitModalOpen: EventEmitter<any> = new EventEmitter();
  private emitModalClose: EventEmitter<any> = new EventEmitter();

  set btns(btns: TypeFooterBtn[]) {
    this.footerBtns = btns.map(e => { return this.BTNS[e] })
  }

  get emitAfterOpen(): Observable<void> {
    return this.emitModalOpen.asObservable()
  };

  get emitAfterClose(): Observable<void> {
    return this.emitModalClose.asObservable()
  };

  getInstance(): ShareModalComponent<T> {
    return this;
  }

  //需要在Modal打开后调用
  getComponentInstabce(): T | undefined {
    return this.contentComponentRef && this.contentComponentRef.instance
  }

  closeShareModal() {
    this.overlayRef && this.overlayRef.detach()
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
      this.contentComponentRef = factory.create(childInjector);
      if (this.componentPara) {
        Object.assign(this.contentComponentRef.instance, this.componentPara);
      }
      this.contentComponentRef.changeDetectorRef.detectChanges();
    }
    this.promise(this.emitModalOpen)
  }

  ngAfterViewInit(): void {
    if (this.contentComponentRef) {
      this.bodyContainer.insert(this.contentComponentRef.hostView);
    }
  }

  private promise(modalEvent: EventEmitter<any>, data: ModalCloseData = {}) {
    Promise.resolve().then(() => {
      data.data = this
      modalEvent.emit(data)
    })
  }

  closeModal(data: ModalCloseData = { type: 1 }) {
    this.overlayRef && this.overlayRef.detach();
    this.promise(this.emitModalClose, data)
  }
  ngOnDestroy(): void { }
}

