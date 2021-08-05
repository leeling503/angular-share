import { Directive, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2, SimpleChanges } from "@angular/core";
import { IconClass } from "../enum";

/**对于悬浮才出现的图标采用此指令 */
@Directive({
    selector: '[shareIcon]'
})
export class ShareIconDirective {
    constructor(private el: ElementRef, private render2: Renderer2) {
        this.nativeEl = this.el.nativeElement;
    }
    nativeEl: HTMLElement
    /**是否显示 */
    @Input() inView: boolean = false;
    /**图标点击事件 */
    @Output() onIconClick: EventEmitter<any> = new EventEmitter();
    /**图标的class名称 */
    @Input() inName: IconClass = IconClass.clear;
    clearEl: HTMLElement;

    ngOnChanges(changes: SimpleChanges): void { }

    ngOnInit(): void { }

    /**创建清楚图标 */
    creatEl() {
        this.clearEl = this.render2.createElement('i');
        this.render2.addClass(this.clearEl, this.inName);
        this.render2.setStyle(this.clearEl, 'margin-right', '5px');
        this.render2.setStyle(this.clearEl, 'cursor', 'pointer');
        let el = this.nativeEl.querySelector('.E_suffix_icon');
        if (el) {
            this.render2.insertBefore(this.nativeEl, this.clearEl, this.nativeEl.querySelector('.E_suffix_icon'));
        } else {
            this.render2.appendChild(this.nativeEl, this.clearEl);
        }
        let that = this;
        this.clearEl.onclick = function (this: GlobalEventHandlers, event: MouseEvent): any {
            event.stopPropagation();
            that.onIconClick.emit();
            that.mouseLeave();
        }
    }


    @HostListener('mousemove')
    mouseEnter() {
        if (this.inView) {
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