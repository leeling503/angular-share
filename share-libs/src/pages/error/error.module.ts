import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { Error504Component } from "./error-504/error-504.component";
import { Error401Component } from "./error-401/error-401.component";
import { ErrorRouterModule } from "./error.routing";

@NgModule({
    declarations: [Error401Component, Error504Component],
    imports: [
        CommonModule,
        RouterModule,
        ErrorRouterModule
    ]
})
export class ErrorModule { }