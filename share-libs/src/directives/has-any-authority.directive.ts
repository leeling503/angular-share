import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

/**
 *
 * @使用示例
 * ```
 *     <ele *shareAuth="'ROLE_ADMIN'">...</ele>
 *
 *     <some-element *shareAuth="['ROLE_ADMIN', 'ROLE_USER']">...</some-element>
 * ```
 */
@Directive({
    selector: '[shareAuth]'
})
export class HasAnyAuthorityDirective {
    private authorities: string[];

    constructor(
        private templateRef: TemplateRef<any>,
        private viewContainerRef: ViewContainerRef) {
    }

    @Input()
    set shareAuth(value: string | string[]) {
        this.authorities = typeof value === 'string' ? [value] : value;
        this.updateView();
    }

    private updateView(): void {
        this.viewContainerRef.clear();
        if (true) {
            this.viewContainerRef.createEmbeddedView(this.templateRef);
        }
    }

}
