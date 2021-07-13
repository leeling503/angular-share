import { Directive, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2, SimpleChanges } from "@angular/core";
import { UtilChangesNoFirstValue } from "../utils";


@Directive({
    selector: '[shareClearIcon]'
})
export class ShareClearIconDirective {
    constructor(private el: ElementRef, private render2: Renderer2) {
        this.nativeEl = this.el.nativeElement;
    }
    nativeEl: HTMLElement
    @Input() inViewVal: boolean = false;
    @Output() onClearValue: EventEmitter<any> = new EventEmitter();
    clearEl: HTMLElement;

    ngOnChanges(changes: SimpleChanges): void { }

    ngOnInit(): void { }

    /**创建清楚图标 */
    creatEl() {
        this.clearEl = this.render2.createElement('i');
        this.render2.addClass(this.clearEl, 'E_I_clear_p');
        this.render2.setStyle(this.clearEl, 'margin-right', '5px');
        this.render2.setStyle(this.clearEl, 'cursor', 'pointer');
        let el = this.nativeEl.querySelector('.E_suffer_icon');
        if (el) {
            this.render2.insertBefore(this.nativeEl, this.clearEl, this.nativeEl.querySelector('.E_suffer_icon'));
        } else {
            this.render2.appendChild(this.nativeEl, this.clearEl);
        }
        let that = this;
        this.clearEl.onclick = function (this: GlobalEventHandlers, event: MouseEvent): any {
            event.stopPropagation();
            that.onClearValue.emit();
            that.mouseLeave();
        }
    }


    @HostListener('mousemove')
    mouseEnter() {
        if (this.inViewVal) {
            !this.clearEl && this.creatEl();
            this.render2.setStyle(this.clearEl, 'display', 'inline-block')
        } else if (this.clearEl) {
            this.render2.setStyle(this.clearEl, 'display', 'none')
        }
    }

    @HostListener('mouseleave')
    mouseLeave() {
        if (this.clearEl) {
            this.render2.setStyle(this.clearEl, 'display', 'none')
        }
    }
}