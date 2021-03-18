import { Directive, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2 } from "@angular/core";


@Directive({
    selector: '[shareClearIcon],share-clear-icon'
})
export class ShareClearIconDirective {
    constructor(private el: ElementRef, private render2: Renderer2) { }
    @Input() inHasValue: boolean = false;
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

    @HostListener('mouseenter')
    mouseEnter() {
        if (!!this.inHasValue) {
            this.render2.setStyle(this.clearEl, 'display', 'inline-block')
        }
    }

    @HostListener('mouseleave')
    mouseLeave() {
        this.render2.setStyle(this.clearEl, 'display', 'none')
    }
}