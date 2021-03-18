import { Component, Injector, ChangeDetectorRef, TemplateRef } from '@angular/core';
import { TimeRange } from 'share-libs/src/components/date-picker/share-date-picker.model';
import { PaginationPage } from 'share-libs/src/components/pagination/share-pagination.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'share-lib-test';
  // shareModal: ShareModalService;
  // shareOverlay: ShareOverlayService;
  // overlay: Overlay;
  // ngZone: NgZone;
  // @ViewChild('element', { static: false, read: ElementRef }) el: ElementRef;
  // @ViewChild('showmodel', { static: false, read: TemplateRef }) showmodel: TemplateRef<any>;
  // @ViewChild(CdkPortal, { static: true }) templatePortal: TemplatePortal<any>;
  constructor(private injector: Injector, private changeDetectorRef: ChangeDetectorRef) {
    // this.shareModal = this.injector.get(ShareModalService)
    // this.shareOverlay = this.injector.get(ShareOverlayService)
    // this.overlay = this.injector.get(Overlay)
    // this.ngZone = this.injector.get(NgZone)
  }
  // option = '1';
  // options = []
  // myd: string = 'mydmydmydmyd'
  // selectConfig: SelectConfig = new SelectConfig();
  // data = {
  //   value: 500
  // }
  paginPage = new PaginationPage();
  ngOnInit(): void {
    this.paginPage.currentPage = 5;
    this.paginPage.pageRecord = 15;
    this.paginPage.recordCount = 650;
    // this.selectConfig.openWidth = 200;
    // this.selectConfig.showCheck = true;
    // this.selectConfig.multi = true;
    // this.selectConfig.showClear = true;
    // setTimeout(() => {
    //   this.options = [
    //     {
    //       value: '1', name: 'Option-1', children: [
    //         {
    //           value: '12', name: 'Option-11', children: [
    //             {
    //               value: '123', name: 'Option-111', children: [
    //                 {
    //                   value: '1234', name: 'Option-1111111111111111111111111111111111', children: []
    //                 }
    //               ]
    //             }
    //           ]
    //         }
    //       ]
    //     }, {
    //       value: '2', name: 'Option-2'
    //     }, { value: '3', name: 'Option-1' }, { value: '4', name: 'Option-2' }, { value: '5', name: 'Option-1' }, { value: '6', name: 'Option-2' }, { value: '7', name: 'Option-1' }, { value: '8', name: 'Option-2' }];
    //   // this.showShareModal();
    // }, 1000)
  }

  // showShareModal() {
  //   let modelInstance = this.shareModal.openModal({
  //     overlayerConfig: {
  //       hasBackdrop: false,
  //     },
  //     modalPara: {
  //       modalTitle: '弹出框',
  //       modalContentStyles: {
  //         "background-color": '#c3c3c3',
  //       },
  //       cbCloseModal: () => { console.log('closeModalCb') },
  //       modalTemplate: this.showmodel,
  //     },
  //     modalComponent: ShareModalSelectItemComponent,
  //     modalComponentPara: {},
  //   });
  //   let content = modelInstance.getComponentInstabce()
  //   console.log(content)
  // }

  // clickclick() {
  //   let mouseEvent: MouseEvent = <MouseEvent>event;
  //   let overlayPosition = new OverlayPosition();
  //   overlayPosition.event = mouseEvent;
  //   overlayPosition.type = 'body';
  //   let ref = this.shareOverlay.createOverlay(overlayPosition, this.templatePortal)
  // }
  // i = 0;
  // add() {
  //   this.data.value++;
  //   this.i++;
  // }

  // emitSelectChange(e) {
  //   console.log(e)
  //   // this.showShareModal()
  // }

  // acceptSelectChange(e) {
  //   console.log(e)
  // }
  year;
  dateRange: '';
  month;
  modelMonthChange(m){
    console.log(m)
  }
}
