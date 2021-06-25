import { Component } from "@angular/core";
import { GLID, GLNAME, GlobalEventService } from "share-libs/src/services/global-event.service";

@Component({
    selector: 'ex-main',
    template: `<div class="ex-main"><router-outlet></router-outlet></div>`,
    styleUrls:['./examples.component.less']

})
export class ExMain {
    constructor() { }
    ngOnInit(): void { }
}