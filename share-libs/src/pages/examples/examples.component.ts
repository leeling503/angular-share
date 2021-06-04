import { style } from "@angular/animations";
import { Component } from "@angular/core";

@Component({
    selector: 'ex-main',
    template: `<div class="ex-main"><router-outlet></router-outlet></div>`,
    styles: [`:host,
    .ex-main{
        width:100%;
        height:100%;
    },
    .ex-main{      padding:20px;}`]

})
export class ExMain { }