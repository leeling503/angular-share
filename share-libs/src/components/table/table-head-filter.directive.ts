import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
    selector: '[table-head-filter]'
})
export class TableHeadFilterDirective {
    constructor(private el:ElementRef , private render:Renderer2){}
    @Input() inHeadItems:any;
    @Input() inFilterOpen:boolean = false;
    ngOnchang
    ngOnInit(): void {
        
    }

    ngAfterViewInit(): void {
    }
}
