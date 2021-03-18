import { CdkOverlayOrigin } from "@angular/cdk/overlay";
import { Component, EventEmitter, HostListener, Input, Output, SimpleChanges, ViewChild } from "@angular/core";

@Component({
    selector: 'share-date-year',
    templateUrl: './share-date-year.component.html',
    styleUrls: ['./share-date-year.component.less']
})
export class ShareDateYearComponent {
    @Input() inPlaceholder: string = "请选择";
    @Input() inAutoSet: boolean = true;//关闭选款自动设置
    @Input() inSetDefault: boolean = true;//设置默认值
    @Input() modelYear: number;
    @Output() modelYearChange: EventEmitter<string> = new EventEmitter();
    @ViewChild(CdkOverlayOrigin, { static: true }) cdkOverlayOrigin: CdkOverlayOrigin;
    viewYear: number;//input的可视值
    overlayOpen: boolean = false;
    yearValues: number[] = [];
    ngOnChanges(changes: SimpleChanges): void {
        //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
        //Add '${implements OnChanges}' to the class.
        if (changes.modelYear && this.modelYear) {
            if (typeof this.modelYear === 'string') {
                this.modelYear = parseInt(this.modelYear)
            }
        }
    }

    ngOnInit(): void {
        let curYear = this.modelYear || new Date().getFullYear();
        if (this.inSetDefault) {
            this.viewYear = this.modelYear = curYear;
            Promise.resolve().then(() => {
                this.modelYearChange.emit(this.modelYear.toString())
            })
        }

    }

    onToggleOpen() {
        this.overlayOpen = !this.overlayOpen;
        if (this.overlayOpen) {
            let curYear = this.modelYear || new Date().getFullYear();
            if (this.inAutoSet) {
                this.modelYear = curYear;
            }
            this.setYearValues(curYear);
        }
    }

    setYearValues(curYear) {
        this.yearValues = [];
        for (let i = 0; i < 9; i++) {
            this.yearValues.push(curYear - 4 + i)
        }
    }

    onGoYear(num: number) {
        let curYear = this.yearValues[0] + 4 + num;
        this.setYearValues(curYear);
    }

    onSelectYear(year: number) {
        this.overlayOpen = false;
        this.viewYear = year;
        if (this.modelYear === year) { return };
        this.modelYear = year;
        this.modelYearChange.emit(this.modelYear.toString());
    }

    autoSetYears() {
        if (this.inAutoSet) {
            this.viewYear = this.modelYear;
            this.modelYearChange.emit(this.modelYear.toString())
        }
    }

    onClose() {
        this.overlayOpen = false;
        this.autoSetYears();
    }

    onClearValue() {
        this.viewYear = this.modelYear = null;
        this.modelYearChange.emit('');
    }
}