import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpResult } from '../models';
import { AccountService } from './account.service';
import { HttpBaseService } from './http-base.service';

@Injectable(
  { providedIn: 'root' }
)
export class AuthService {
  constructor(
    private http_: HttpBaseService,
    private account_: AccountService
  ) { }

  /**授权 接口不再401 并datas中返回用户信息*/
  authorization(credentials): Promise<HttpResult> {
    let data = `j_username=${credentials.userName}&j_password=${credentials.code}&code=${credentials.code}&submitType=${credentials.submitType}&submit=Login`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    return this.http_.post('api/authentication', data, { headers }).toPromise();
  }

  logout(): Observable<any> {
    return this.http_.post('api/logout', {}).pipe(
      map(res => {
        this.account_.csrf().subscribe();
        return res;
      })
    )
  }

  getAuthorizationToken() {
    return 'some-auth-token';
  }
}
