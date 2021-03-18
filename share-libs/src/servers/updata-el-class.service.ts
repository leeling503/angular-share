import { Injectable, Renderer2, RendererFactory2 } from "@angular/core";

@Injectable()
export class UpdataElClassService {
    private classMap = {};
    readonly renderer: Renderer2;
    constructor(rendererFactory2: RendererFactory2) {
        this.renderer = rendererFactory2.createRenderer(null, null);
    }

    updateElClass(el: HTMLElement, classMap: object) {
        this.removeClass(el, this.classMap, this.renderer);
        this.classMap = { ...classMap };
        this.addClass(el, this.classMap, this.renderer);
    }

    private removeClass(el: HTMLElement, classMap: object, renderer: Renderer2) {
        for (const className in classMap) {
            if (classMap.hasOwnProperty(className)) {
                renderer.removeClass(el, className)
            }
        }
    }
    private addClass(el: HTMLElement, classMap: object, renderer: Renderer2) {
        for (const className in classMap) {
            if (classMap.hasOwnProperty(className) && classMap[className]) {
                renderer.addClass(el, className)
            }
        }
    }
}