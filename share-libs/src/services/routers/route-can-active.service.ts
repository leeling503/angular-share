import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateChild, RouterStateSnapshot } from "@angular/router";
import { AccountService } from "../account.service";

@Injectable({ providedIn: 'root' })
export class RouteCanActive implements CanActivateChild {
    constructor(private account_: AccountService) { }
    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> | boolean {
        // return true;
        return this.account_.getAccount().then(res => !!res)
    }

}