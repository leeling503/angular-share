import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ShareErrorComponent } from "./error.component";
import { ErrorRouterModule } from "./error.routing";

@NgModule({
    declarations: [ShareErrorComponent],
    imports: [
        CommonModule,
        RouterModule,
        ErrorRouterModule
    ]
})
export class ErrorModule { }