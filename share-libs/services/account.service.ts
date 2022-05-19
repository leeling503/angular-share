import { Injectable } from '@angular/core';
import { GlEventName } from 'share-libs/const';
import { Account } from 'share-libs/models';
import { GlEventService } from './global/gl-event.service';
import { HttpService } from './http-base.service';

/**用户账号信息服务商 */
@Injectable(
    { providedIn: 'root' }
)
export class AccountService {

    constructor(private http_: HttpService, private gl_: GlEventService) { }
    private _account: Account;

    csrf() {
        return this.http_.get('api/open/csrf')
    }

    /**传入ture表示通过网络获取用户信息不读取缓存 */
    public async getAccount(network: boolean = false) {
        if (!this._account || network) {
            let res = await this.getNetAccount();
            if (res.rlt == 0) {
                let _account = this._account = res.datas;
                _account.organizeList = _account.organize ? [_account.organize] : [];
            }
            this.gl_.eventNext(GlEventName.account, this._account);
        }
        return this._account;
    }

    /**判断用户是否有该权限 */
    public ifAuth(menuCode: string): boolean {
        if (menuCode === undefined) return true;
        let account = this._account;
        if (!account) return false;
        let roleCode: string = account.roleCode;
        ///角色是超级管理员无视权限控制
        if (roleCode === "1") return true;
        let menuCodeList = (account && account.menuCodeList) || [];
        return menuCodeList.some((ele) => ele === menuCode);
    }

    public clearAccount() {
        this._account = void 0;
    }

    private getNetAccount(): Promise<any> {
        return this.http_.get('api/open/getAccount').toPromise()
    }
}
