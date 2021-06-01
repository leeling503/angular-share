import { Directive, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2, SimpleChanges } from "@angular/core";
import { UtilChangesNoFirstValue } from "../utils";


@Directive({
    selector: '[shareClearIcon],share-clear-icon'
})
export class ShareClearIconDirective {
    constructor(private el: ElementRef, private render2: Renderer2) { }
    @Input() inViewVal: boolean = false;
    @Input() inRightPx: number = 25;
    @Output() onClearValue: EventEmitter<any> = new EventEmitter();
    clearEl: HTMLElement;

    ngOnInit(): void {
        this.clearEl = this.render2.createElement('i')
        this.render2.addClass(this.clearEl, 'icon-clear-p');
        this.render2.setStyle(this.clearEl, 'right', this.inRightPx + 'px')
        this.render2.appendChild(this.el.nativeElement, this.clearEl);
        let that = this;
        this.clearEl.onclick = function (this: GlobalEventHandlers, event: MouseEvent): any {
            event.stopPropagation();
            that.onClearValue.emit();
            that.mouseLeave();
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (UtilChangesNoFirstValue(changes, "inViewVal")) {
            if (this.inViewVal) {
                this.render2.setStyle(this.clearEl, 'display', 'inline-block')
            } else {
                this.render2.setStyle(this.clearEl, 'display', 'none')
            }
        }
    }

    @HostListener('mousemove')
    mouseEnter() {
        if (this.inViewVal) {
            this.render2.setStyle(this.clearEl, 'display', 'inline-block')
        }
    }

    @HostListener('mouseleave')
    mouseLeave() {
        this.render2.setStyle(this.clearEl, 'display', 'none')
    }
}