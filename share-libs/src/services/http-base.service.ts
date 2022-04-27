import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from "rxjs/operators";
import { Observable, of } from "rxjs";
import { OperatorFunction } from "rxjs/internal/types";
import { HttpResult } from "../models";

/**异常处理  照样返回给正常处理函数 */
const disposeError: OperatorFunction<any, any> = catchError((error: HttpErrorResponse) => {
    const result: HttpResult = {
        info: error.status + error.statusText,
        rlt: 1,
        error: true,
        datas: error.error
    }
    return of(result)
})

/** Http请求服务商 所有请求必须经过HttpService*/
@Injectable({ providedIn: 'root' })
export class HttpService {
    constructor(private http: HttpClient) { }

    post(url: string, data, options?): Observable<HttpResult> {
        return this.http.post(url, data, options).pipe(disposeError)
    }

    get(url: string): Observable<HttpResult> {
        return this.http.get(url).pipe(disposeError)
    }
}