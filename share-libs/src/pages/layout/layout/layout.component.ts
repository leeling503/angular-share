import { Component } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { filter } from "rxjs/operators";
import { UtilArraySetKeyValue, UtilArraySetKeyValueByValue } from "share-libs/src/utils/util-array";
import { MenuItem } from "../layout-menu";
import { LayoutMenuServer } from "../layout-menu.service";

@Component({
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.less'],
    // providers: [LayoutMenuServer]
})
export class LayoutComponent {
    constructor(private router: Router, private menu_: LayoutMenuServer) {
        this._router$ = this.router.events.subscribe((navigation) => {
            console.log(navigation)
        })
    }
    private _router$: Subscription;

    ngOnDestroy(): void {
        this._router$.unsubscribe();
    }
}
