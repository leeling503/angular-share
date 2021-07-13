import { OverlayRef } from '@angular/cdk/overlay';
import { Component, OnInit, Input, SimpleChanges, ViewChild, ViewContainerRef, ComponentFactory, ComponentFactoryResolver, ComponentRef, Type, EventEmitter, Injector, TemplateRef } from '@angular/core';
import { ModalContentStyles } from './share-modal.model';
import { ShareModalRef } from './modalRef.service';
import { Observable } from 'rxjs/internal/Observable';
import { ShareBtn } from '../button/share-buttom';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.less'],
})
export class ShareModalComponent<T> extends ShareModalRef implements OnInit {
  constructor(private factory: ComponentFactoryResolver, private viewContainer: ViewContainerRef,) {
    super()
  }
  @Input() modalTitle: string;//弹出窗标题
  @Input() modalContentStyles: ModalContentStyles = {};
  @Input() modalContent: string;
  @Input() modalTemplate: TemplateRef<any>;
  @Input() modalTemplateDatas: any = {};
  @Input() modalComponent: Type<T>
  @Input() modalComponentPara: Partial<T>
  @Input() overlayRef: OverlayRef;//弹窗的overlay对象,用来关闭弹窗
  @Input() cbCloseModal: () => any;
  @ViewChild('bodyContainer', { read: ViewContainerRef, static: true }) private bodyContainer: ViewContainerRef;
  footerBtns: ShareBtn[] = [];
  private contentComponentRef: ComponentRef<T>;
  private emitModalOpen: EventEmitter<any> = new EventEmitter();
  private emitModalClose: EventEmitter<any> = new EventEmitter();

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
  getComponentInstabce(): any {
    return this.contentComponentRef.instance
  }

  closeShareModal() {
    this.overlayRef && this.overlayRef.detach()
  }

  ngOnChanges(changes: SimpleChanges): void { }

  ngOnInit() {
    if (this.modalComponent) {
      this.bodyContainer.clear();
      let factory = this.factory.resolveComponentFactory(this.modalComponent);
      const childInjector = Injector.create({
        providers: [{ provide: ShareModalRef, useValue: this }],
        parent: this.viewContainer.parentInjector
      });
      this.contentComponentRef = factory.create(childInjector);
      if (this.modalComponentPara) {
        Object.assign(this.contentComponentRef.instance, this.modalComponentPara);
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

  promise(modalEvent: EventEmitter<any>) {
    Promise.resolve().then(() => {
      modalEvent.emit()
    })
  }

  closeModal() {
    if (this.cbCloseModal && typeof this.cbCloseModal == "function") {
      this.cbCloseModal();
    }
    this.overlayRef && this.overlayRef.detach();
    this.promise(this.emitModalClose)
  }

  ngOnDestroy(): void { }

}
