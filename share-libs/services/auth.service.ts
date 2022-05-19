import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpResult } from 'share-libs/models';
import { AccountService } from './account.service';
import { HttpService } from './http-base.service';

/**后台授权服务商 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private http_: HttpService,
    private account_: AccountService
  ) { }
  private _token = "some-auth-token"

  /**授权 接口不再401 并datas中返回用户信息*/
  authorization(credentials): Promise<HttpResult> {
    let data = `j_username=${credentials.userName}&j_password=${credentials.code}&code=${credentials.code}&submitType=${credentials.submitType}&submit=Login`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    return this.http_.post('api/authentication', data, { headers }).toPromise();
  }

  /**移除权限 */
  async authorizeUnload(): Promise<void> {
    await this.http_.post('api/logout', {}).subscribe()
    await this.account_.csrf().subscribe();
  }

  /**获取授权的token */
  getAuthToken() {
    return this._token;
  }
}
