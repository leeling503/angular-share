import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

/**
 *
 * @使用示例
 * ```
 *     <some-element *slHasAnyAuthority="'ROLE_ADMIN'">...</some-element>
 *
 *     <some-element *slHasAnyAuthority="['ROLE_ADMIN', 'ROLE_USER']">...</some-element>
 * ```
 */
@Directive({
    selector: '[slHasAnyAuthority]'
})
export class HasAnyAuthorityDirective {
    private authorities: string[];

    constructor(
        private templateRef: TemplateRef<any>,
        private viewContainerRef: ViewContainerRef) {
    }

    @Input()
    set slHasAnyAuthority(value: string | string[]) {
        this.authorities = typeof value === 'string' ? [<string>value] : <string[]>value;
        this.updateView();
    }

    private updateView(): void {
        this.viewContainerRef.clear();
        if (true) {
            this.viewContainerRef.createEmbeddedView(this.templateRef);
        }
    }

}
