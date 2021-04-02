import { SelectConfig } from './../select/share-select.model';
import { Component, Input, Output, EventEmitter, SimpleChanges, ViewChild, ElementRef } from "@angular/core";
import { PaginationPage, PaginationType, JumpType, PaginationSize, PaginationInfoType } from './share-pagination.model';
import { CdkOverlayOrigin } from '@angular/cdk/overlay';

@Component({
    selector: 'share-pagination',
    templateUrl: './share-pagination.component.html',
    styleUrls: ['./share-pagination.component.less']
})
export class SharePaginationComponent {
    constructor(private el: ElementRef) { }
    @Input() paginPage: PaginationPage = new PaginationPage();
    @Input() paginType: PaginationType = "default";
    @Input() paginSize: PaginationSize = "normal";
    @Input() paginInfoType: PaginationInfoType = "detail";
    @Input() paginPageRecord: number[] = [10, 20, 30, 50];
    prevFlag: boolean = false;
    nextFlag: boolean = false;
    flagIcon: string = '•••';
    buttons: number[] = [];
    inputNum: string = null;
    viewPageRecord: PageRecordView[] = [];
    cdkConnectedOverlayWidth: number | string;
    @ViewChild(CdkOverlayOrigin, { static: true }) cdkOverlayOrigin: CdkOverlayOrigin;
    @Output() emitPageChange: EventEmitter<PaginationPage> = new EventEmitter();

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.paginPage && !changes.paginPage.firstChange) {
            this.initPage();
        }
    }

    ngOnInit(): void {
        this.initPage();
        this.initPageRecord();
    }

    ngAfterViewInit(): void {
        let ele: HTMLElement = this.el.nativeElement;
        this.cdkConnectedOverlayWidth = ele.querySelector('.pagi-record').clientWidth + 2;
    }


    initPage() {
        this.paginPage.pageRecord = this.paginPage.pageRecord || this.paginPageRecord[0];
        this.paginPage.recordCount = this.paginPage.recordCount || (this.paginPage.result && this.paginPage.result.length) || 0;
        this.paginPage.pageCount = Math.ceil(this.paginPage.recordCount / this.paginPage.pageRecord) || this.paginPage.pageCount || 1;
        this.paginPage.currentPage = this.paginPage.currentPage > this.paginPage.pageCount ? this.paginPage.pageCount : this.paginPage.currentPage || 1;
        this.getPaginationButtons()
    }

    initPageRecord() {
        this.viewPageRecord = [];
        this.paginPageRecord.forEach(e => this.viewPageRecord.push({ value: e, name: e + '条/页' }));
    }

    getPaginationButtons() {
        let cur = <number>this.paginPage.currentPage;
        let count = this.paginPage.pageCount;
        let buts = [];
        if (count <= 8) {
            for (let i = 1; i < count - 1; i++) {
                buts.push(i + 1)
            }
        } else {
            let prev: boolean = cur - 3 > 1;
            let nex: boolean = cur + 3 < count;
            let start = prev && nex ? cur - 2 : prev ? count - 5 : 2;
            for (let i = 0; i < 5; i++) {
                buts.push(start + i)
            }
            this.nextFlag = nex;
            this.prevFlag = prev;
        }
        this.buttons = buts;
    }

    jumpTo(type: JumpType) {
        let currentPage = 0;
        switch (type) {
            case 'first':
                currentPage = 1;
                break;
            case 'prev':
                currentPage = this.paginPage.currentPage - 1 || 1;
                break;
            case 'next':
                currentPage = this.paginPage.currentPage + 1 > this.paginPage.pageCount ? this.paginPage.pageCount : this.paginPage.currentPage + 1;
                break;
            case 'last':
                currentPage = this.paginPage.pageCount;
                break;
            case 'prev5':
                currentPage = this.paginPage.currentPage - 5;
                break;
            case 'next5':
                currentPage = this.paginPage.currentPage + 5;
                break;
            case 'num':
                if (!this.inputNum) {
                    return;
                }
                currentPage = parseInt(this.inputNum);
                this.inputNum = null;
                break;
        }
        if (this.paginPage.currentPage == currentPage) { return };
        this.paginPage.currentPage = currentPage;
        this.getPaginationButtons();
        this.emitPage();
    }

    jumpToNum(i: number) {
        if (this.paginPage.currentPage == i) { return };
        this.paginPage.currentPage = i;
        this.getPaginationButtons();
        this.emitPage();
    }

    pageRecordChange(pageRecord) {
        if (this.paginPage.pageRecord == pageRecord) { return };
        this.paginPage.pageRecord = pageRecord;
        this.initPage();
        this.emitPage();
    }

    emitPage() {
        this.emitPageChange.emit(this.paginPage);
        console.log(this.paginPage)
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