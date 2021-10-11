import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Account } from '../models/share-account';

/**用户账号信息服务商 */
@Injectable(
    { providedIn: 'root' }
)
export class AccountService {

    constructor(private http: HttpClient) { }
    private _account: Account;
    private accountUpdate: BehaviorSubject<Account> = new BehaviorSubject<Account>(void 0);

    csrf() {
        return this.http.get('api/open/csrf')
    }

    /**传入ture表示通过网络获取用户信息不读取缓存 */
    async getAccount(network: boolean = false) {
        if (!this._account || network) {
            let res = await this.getNetAccount();
            if (res.rlt == 0) {
                let _account = this._account = res.datas;
                _account.organizeList = _account.organize ? [_account.organize] : [];
            }
            this.accountUpdate.next(this._account);
        }
        return this._account;
    }

    private getNetAccount(): Promise<any> {
        return this.http.get('api/open/getAccount').toPromise()
    }

    hasAnyAuthority(authorities: string[]): Promise<boolean> {
        if (!this._account) return Promise.resolve(false);
        let roleCode: string = this._account.roleCode;
        if (roleCode === "1" || typeof authorities == "undefined") {
            // 超级管理员 或不需要鉴权的用户
            return Promise.resolve(true);
        }
        if (authorities && authorities.length) {
            if (authorities.length == 1) {
                return Promise.resolve(this.hasAuthority(authorities[0]));
            } else {
                let result = false;
                for (let index = 0; index < authorities.length; index++) {
                    const element = authorities[index];
                    result = this.hasAuthority(element);
                    if (result) break;
                }
                return Promise.resolve(result);
            }
        }
        return Promise.resolve(false);
    }

    /**判断用户是否有该权限 */
    hasAuthority(menuCode): boolean {
        if (menuCode === undefined) return true;
        if (!this._account) return false;
        let account = this._account;
        let roleCode: string = account.roleCode;
        if (roleCode === "1") {
            return true;
        }
        let menuCodeList = (account && account.menuCodeList) || [];
        return menuCodeList.some((ele) => ele == menuCode);
    }

    clearAccount() {
        this._account = void 0;
    }

    setAccount(account: Account) {
        this._account = account;
    }

    subscribeAccout(): Observable<Account> {
        return this.accountUpdate.asObservable();
    }
}
