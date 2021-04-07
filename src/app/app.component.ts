import { CdkPortal, TemplatePortal } from '@angular/cdk/portal';
import { Component, Injector, ChangeDetectorRef, TemplateRef, ViewChild, ComponentRef } from '@angular/core';
import { TimeRange } from 'share-libs/src/components/date-picker/share-date-picker.model';
import { ShareModalService } from 'share-libs/src/components/modal/modal.service';
import { ShareModalSelectItemComponent } from 'share-libs/src/components/open-modals/modal-select-item/modal-select-item.component';
import { PaginationPage } from 'share-libs/src/components/pagination/share-pagination.model';
import { SelectConfig, SelectOption } from 'share-libs/src/components/select/share-select.model';
import { TableItem } from 'share-libs/src/components/table/share-table.model';
import { TableComponent } from 'share-libs/src/components/table/table/share-table.component';

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
  @ViewChild(TableComponent, { static: true }) shareTable: TableComponent;
  constructor(private injector: Injector, private changeDetectorRef: ChangeDetectorRef) {
    this.shareModal = this.injector.get(ShareModalService)
    // this.shareOverlay = this.injector.get(ShareOverlayService)
    // this.overlay = this.injector.get(Overlay)
    // this.ngZone = this.injector.get(NgZone)
  }
  option: SelectOption[] = [{ key: 'a', value: 'asd' }];
  options: SelectOption[] = []
  a = [
    {
      key: 'a', value: 'asd', children:
        [{
          key: 'aa', value: 'aasd', children:
            [{ key: 'aaa', value: 'aaasd' }, { key: 'aab', value: 'aabsd' }]
        }, {
          key: 'ab', value: 'absd', children:
            [{ key: 'aba', value: 'abasd' }, { key: 'abb', value: 'abbsd' }]
        }]
    }, {
      key: 'b', value: 'bsd', children:
        [{ key: 'ba', value: 'bsd' }]
    },
  ]
  // myd: string = 'mydmydmydmyd'
  selectConfig: SelectConfig = new SelectConfig();
  // data = {
  //   value: 500
  // }
  paginPage = new PaginationPage();
  ngOnInit(): void {
    this.paginPage.currentPage = 5;
    this.paginPage.pageRecord = 15;
    this.paginPage.recordCount = 650;
    setTimeout(() => {
      this.options = this.a;
      this.selectedItem = this.disItem;
    }, 5000);
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

  emitSelectChange(e) {
    console.log(e, this.option)
  }
  onActiveChange($event) {
    console.log($event)
  }

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
    item.selectedDatas.forEach(e => {
      e.aidsName = 'asdasd'
    })
    console.log(item)
    console.log(this.selectedItem)
  }

  selectedItem = [{ id: "dd069861-f880-4925-911f-578a5f5fb461", datagramId: "", deviceCode: "01030201200262", },
  { id: "47528e1f-8b78-4b66-81c9-f2f9631695af", datagramId: "", deviceCode: "01030201200092", },
  { id: "4c8c5ab5-a042-4dd7-9e3f-04fa4d5818c4", datagramId: "", deviceCode: "01030200180016", },]
  disItem = [{ id: "dd069861-f880-4925-911f-578a5f5fb461", datagramId: "", deviceCode: "01030201200262", },
  { id: "47528e1f-8b78-4b66-81c9-f2f9631695af", datagramId: "", deviceCode: "01030201200092", },
  { id: "4c8c5ab5-a042-4dd7-9e3f-04fa4d5818c4", datagramId: "", deviceCode: "01030200180060", }]
  inItems: Array<TableItem> = [
    { title: '选框', type: 'check', canFilter: false, styckyLeft: '0px' },
    { title: '序号', type: 'serial', width: 60, canFilter: false, styckyLeft: '62px' },
    { title: '时间', key: 'aidsCode', width: 220 },
    { title: '变更内容', key: 'aidsName', width: 180 },
    {
      title: '报文类型', key: 'commModeCodeName', width: 180
    },
    { title: '操作用户', key: 'userName', width: 180 },
    {
      title: '执行结果', key: 'ifBind', width: 180, type: "tag", tagRule: [
        { value: 0, text: '成功', tagType: 'success' },
        { value: 1, text: '失败', tagType: 'danger' },
        { value: 2, text: '队列中', tagType: 'default' },
        { value: 3, text: '等待回复', tagType: 'default' },
      ]
    },
    {
      title: '参数详情', key: 'targetingName', type: "expend", ifShow: false, width: 180
    },
  ]
}
