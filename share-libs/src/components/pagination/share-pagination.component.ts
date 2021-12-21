import { Component, Input, Output, EventEmitter, SimpleChanges, ViewChild, ElementRef } from "@angular/core";
import { PaginationPage, SizePagination, TypeJump, TypePagination, TypePaginationInfo, } from './share-pagination.model';
import { CdkOverlayOrigin } from '@angular/cdk/overlay';
import { UtilChanges, UtilIsEqual } from "share-libs/src/utils";

/**
 * 表格分页器
 */
@Component({
    selector: 'share-pagination',
    templateUrl: './share-pagination.component.html',
    styleUrls: ['./share-pagination.component.less']
})
export class SharePaginationComponent {
    constructor(private el: ElementRef) { }
    /**翻页器数据 */
    @Input() inPage: PaginationPage = {};
    /**翻页器类型*/
    @Input() inType: TypePagination = "default";
    /**翻页器大小 */
    @Input() inSize: SizePagination = "normal";
    /**翻页器说明信息类型 */
    @Input() inInfoType: TypePaginationInfo = "detail";
    /**每页条数设置 */
    @Input() inPageRecord: number[] = [10, 20, 30, 50];
    prevFlag: boolean = false;
    nextFlag: boolean = false;
    flagIcon: string = '•••';
    buttons: number[] = [];
    inputNum: string = null;
    viewPageRecord: PageRecordView[] = [];
    cdkConnectedOverlayWidth: number | string;
    @ViewChild(CdkOverlayOrigin, { static: true }) cdkOverlayOrigin: CdkOverlayOrigin;
    @Output() onPageChange: EventEmitter<PaginationPage> = new EventEmitter();
    page: PaginationPage = {};

    ngOnChanges(changes: SimpleChanges): void {
        if (UtilChanges(changes, 'inPage') && !UtilIsEqual(this.inPage, this.page)) {
            this.page = this.inPage;
            this.initPage();
        }
    }

    ngOnInit(): void {
        this.initPageRecord();
    }

    ngAfterViewInit(): void {
        let ele: HTMLElement = this.el.nativeElement;
        Promise.resolve().then(res => {
            this.cdkConnectedOverlayWidth = ele.querySelector('.pagi-record').clientWidth + 2;
        })
    }

    /**实例化分页器 */
    initPage() {
        this.page.pageRecord = this.page.pageRecord || this.inPageRecord[0];
        this.page.recordCount = this.page.recordCount || (this.page.result && this.page.result.length) || 0;
        this.page.pageCount = Math.ceil(this.page.recordCount / this.page.pageRecord) || this.page.pageCount || 1;
        this.page.currentPage = this.page.currentPage > this.page.pageCount ? this.page.pageCount : this.page.currentPage || 1;
        this.getPaginationButtons()
    }

    /**实例化分页条数选择 */
    initPageRecord() {
        this.viewPageRecord = [];
        this.inPageRecord.forEach(e => this.viewPageRecord.push({ value: e, name: e + '条/页' }));
    }

    /**获得分页器的按钮 */
    getPaginationButtons() {
        /**当前页 ， 总页数 ， 按钮组 ， 前5页 ， 后5页 */
        let cur = this.page.currentPage, count = this.page.pageCount, buts = [], nex = false, prev = false;
        if (count <= 8) {
            for (let i = 1; i < count - 1; i++) {
                buts.push(i + 1)
            }
        } else {
            prev = cur - 3 > 1;
            nex = cur + 3 < count;
            let start = prev && nex ? cur - 2 : prev ? count - 5 : 2;
            for (let i = 0; i < 5; i++) {
                buts.push(start + i)
            }
        }
        this.nextFlag = nex;
        this.prevFlag = prev;
        this.buttons = buts;
    }

    /**分页器跳转 */
    onJumpTo(type: TypeJump) {
        let currentPage = this.page.currentPage, pageCount = this.page.pageCount;
        switch (type) {
            case 'first':
                currentPage = 1;
                break;
            case 'prev':
                currentPage = currentPage - 1 || 1;
                break;
            case 'next':
                currentPage = currentPage + 1 > pageCount ? pageCount : currentPage + 1;
                break;
            case 'last':
                currentPage = pageCount;
                break;
            case 'prev5':
                currentPage = currentPage - 5 > 0 ? currentPage - 5 : 1;
                break;
            case 'next5':
                currentPage = currentPage + 5 > pageCount ? pageCount : currentPage + 5;
                break;
            case 'num':
                if (!this.inputNum) return;
                let num = parseInt(this.inputNum);
                currentPage = num < 1 ? 1 : num > pageCount ? pageCount : num;
                this.inputNum = null;
                break;
        }
        if (this.page.currentPage == currentPage) { return };
        this.page.currentPage = currentPage;
        this.getPaginationButtons();
        this.emitPage();
    }

    /**跳转到指定页面 */
    onJumpToNum(i: number) {
        if (this.page.currentPage == i) { return };
        this.page.currentPage = i;
        this.getPaginationButtons();
        this.emitPage();
    }

    /**分页条数改变 */
    pageRecordChange(pageRecord) {
        if (this.page.pageRecord == pageRecord) { return };
        this.page.pageRecord = pageRecord;
        this.initPage();
        this.emitPage();
    }

    /**发出当前分页器信息 */
    emitPage() {
        this.onPageChange.emit(this.page);
    }

    openOverlay: boolean = false;
    onOpenOverlay() {
        this.openOverlay = true
    }

    onCloseOverlay() {
        this.openOverlay = false;
    }

    onSelectRecord(item: PageRecordView) {
        this.pageRecordChange(item.value);
        this.onCloseOverlay();
    }
}

interface PageRecordView {
    value?: string | number;
    name?: string;
}