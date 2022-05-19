import { Component } from "@angular/core";
@Component({
    selector: 'ex-main',
    template: `<div class="ex-main"><router-outlet></router-outlet></div>`,
    styleUrls:['./examples.component.less']

})
export class ExMain {
    constructor() { }
    ngOnInit(): void { }
}