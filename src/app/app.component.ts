import { CdkPortal, TemplatePortal } from '@angular/cdk/portal';
import { Component, Injector, ChangeDetectorRef, TemplateRef, ViewChild } from '@angular/core';
import { TimeRange } from 'share-libs/src/components/date-picker/share-date-picker.model';
import { ShareModalService } from 'share-libs/src/components/modal/modal.service';
import { ShareModalSelectItemComponent } from 'share-libs/src/components/open-modals/modal-select-item/modal-select-item.component';
import { PaginationPage } from 'share-libs/src/components/pagination/share-pagination.model';
import { TableItem } from 'share-libs/src/components/table/share-table.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'share-lib-test';
  shareModal: ShareModalService;
  // shareOverlay: ShareOverlayService;
  // overlay: Overlay;
  // ngZone: NgZone;
  // @ViewChild('element', { static: false, read: ElementRef }) el: ElementRef;
  @ViewChild('showmodel', { static: false, read: TemplateRef }) showmodel: TemplateRef<any>;
  @ViewChild(CdkPortal, { static: true }) templatePortal: TemplatePortal<any>;
  constructor(private injector: Injector, private changeDetectorRef: ChangeDetectorRef) {
    this.shareModal = this.injector.get(ShareModalService)
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
    setTimeout(() => {
      this.selectedItem = this.disItem;
    }, 5000);
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

  showShareModal() {
    let modelInstance = this.shareModal.openModal({
      overlayerConfig: {
        hasBackdrop: false,
      },
      modalPara: {
        modalTitle: '弹出框',
        modalContentStyles: {
          "background-color": '#c3c3c3',
        },
        cbCloseModal: () => { console.log('closeModalCb') },
        modalTemplate: this.showmodel,
      },
      modalComponent: ShareModalSelectItemComponent,
      modalComponentPara: {},
    });
    console.log(modelInstance.getInstance())
  }

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
  modelMonthChange(m) {
    console.log(m)
  }
  onSelectChange(item) {
    console.log(item)
    console.log(this.selectedItem)
  }

  selectedItem = [{ id: "856f795c-fc21-4e8f-b8b9-f7ce954dbb6a", datagramId: "", deviceCode: "01030201200262", },
  { id: "fcfb5ad4-0ccc-44a9-8b4a-a0e403a399b4", datagramId: "", deviceCode: "01030201200092", },
  { id: "a9079130-22e3-4c9d-abac-238dcd72d3da", datagramId: "", deviceCode: "01030200180016", },]
  disItem = [{ id: "856f795c-fc21-4e8f-b8b9-f7ce954dbb6a", datagramId: "", deviceCode: "01030201200262", },
  { id: "fcfb5ad4-0ccc-44a9-8b4a-a0e403a399b4", datagramId: "", deviceCode: "01030201200092", },
  { id: "640f0699-48ca-4a4a-9280-5c55c20262e2", datagramId: "", deviceCode: "01030200180060", }]
  inItems: Array<TableItem> = [
    { title: '', type: 'check', width: 60, canFilter: false, styckyLeft: '0px' },
    { title: '序号', type: 'serial', width: 60, canFilter: false, styckyLeft: '62px' },
    { title: '时间', key: 'aidsCode', width: 150 },
    { title: '变更内容', key: 'aidsName', width: 200 },
    {
      title: '报文类型', key: 'commModeCodeName', width: 180
    },
    { title: '操作用户', key: 'userName', width: 180 },
    {
      title: '执行结果', key: 'ifBind', type: "tag", width: 180, tagRule: [
        { value: 0, text: '成功', tagType: 'success' },
        { value: 1, text: '失败', tagType: 'danger' },
        { value: 2, text: '队列中', tagType: 'default' },
        { value: 3, text: '等待回复', tagType: 'default' },
      ]
    },
    {
      title: '参数详情', key: 'targetingName', type: "expend", ifShow: false
    },
  ]
}
