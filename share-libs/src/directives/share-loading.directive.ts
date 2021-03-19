import { Directive, ElementRef, Input, NgModule, Renderer2, SimpleChanges } from "@angular/core";
import { UpdataElClassService } from "../servers";

@Directive({
    selector: '[share-loading],share-loading'
})
export class ShareLoadingDirective {
    constructor(private el: ElementRef, private render: Renderer2) {
        this.native = this.el.nativeElement;
    }
    @Input() inLoading: boolean = false;
    native: HTMLElement;
    key = "share-loading-flag";
    parentEl: HTMLElement;
    loadEl: HTMLElement;
    ngOnChanges(changes: SimpleChanges): void {
        //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
        //Add '${implements OnChanges}' to the class.
        if (changes.inLoading && !changes.inLoading.firstChange) {
            this.changeLoadingFlag()
        }
    }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        this.render.addClass(this.native, 'share-loading-directive');
        this.loadEl = this.render.createElement('div');
        this.render.addClass(this.loadEl, this.key);
        if (this.inLoading == true) {
            this.changeLoadingFlag();
        }
    }

    changeLoadingFlag() {
        this.inLoading ? this.add() : this.remove();
    }

    add() {
        this.render.appendChild(this.native, this.loadEl)
    }

    remove() {
        this.render.removeChild(this.native, this.loadEl)
    }
}