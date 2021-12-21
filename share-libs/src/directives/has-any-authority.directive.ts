import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

/**
 * 权限控制指令
 * @使用示例
 *请在组件的选择器上调用该指令 
 *组件里调用的话组件依旧会初始化
 *<ele *shareAuth="'ROLE_ADMIN'">...</ele>
 *<some-element *shareAuth="['ROLE_ADMIN', 'ROLE_USER']">...</some-element>
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
        setTimeout(() => {
            if (true) {
                this.viewContainerRef.createEmbeddedView(this.templateRef);
            }
        }, 1000);
    }

}
