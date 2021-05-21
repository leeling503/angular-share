import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { LayoutMenuServer } from "../layout-menu.service";

@Component({
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.less'],
    providers: [LayoutMenuServer]
})
export class LayoutComponent {
    constructor() { }
    ngOnDestroy(): void { }
}
