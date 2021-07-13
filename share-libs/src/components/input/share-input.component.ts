import { OnChanges, OnDestroy, SimpleChanges } from "@angular/core";
import { Component, ElementRef, EventEmitter, Input, Output } from "@angular/core";
import { ShareSize, TypeInput } from "./share-input.model";

@Component({
    templateUrl: './share-input.component.html',
    styleUrls: ['./share-input.component.less'],
    selector: 'share-input'
})
export class ShareInputComponent implements OnChanges, OnDestroy {
    constructor(private el: ElementRef) {
        this.nativeEl = this.el.nativeElement;
    }
    checkedNames = [];
    private nativeEl: HTMLInputElement;
    private inputEl: HTMLInputElement;
    @Input('ngModel') model: string;
    @Input() inSize: ShareSize = "normal"
    @Input() inType: TypeInput = TypeInput.text;
    @Input() inMin: number;//最小值
    @Input() inMax: number;//最大值
    @Input() inLength: number; //长度
    @Output('ngModelChange') update = new EventEmitter()

    ngOnChanges(changes: SimpleChanges): void {
    }
    ngOnInit() { }
    ngAfterViewInit(): void {
        this.inputEl = this.nativeEl.querySelector('input')
    }

    onEventChange($event: string) {
        this.model = this.getModelByType(this.inputEl.value);
        this.inputEl.value = this.model;
        Promise.resolve().then(res => {
            this.update.emit(this.model)
        })
    }

    getModelByType(str: string): string {
        if (this.inType == TypeInput.number) {
            let result = str.match(/^\-?d*(\d+\.)?\d*/g);
            str = result && result.join('');
        } else if (this.inType == TypeInput.int) {
            let result = str.match(/^\-?\d*/g);
            str = result && result.join('');
        } else if (this.inType == TypeInput.plusInt) {
            str = str.replace(/\D/g, '');
        } else if (this.inType == TypeInput.noNull) {
            str = str.replace(/\s/g, '');
        }
        return str
    }
    ngOnDestroy(): void { }
}
