import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from "rxjs/operators";
import { Observable, of } from "rxjs";
import { ShareResult } from "../models";
import { OperatorFunction } from "rxjs/internal/types";

/**异常处理  照样返回给正常处理函数 */
const disposeError: OperatorFunction<any, any> = catchError((error: HttpErrorResponse) => {
    const result: ShareResult = {
        info: error.status + error.statusText,
        rlt: 1,
        datas: error.error
    }
    return of(result)
})

@Injectable({ providedIn: 'root' })
/** 所有请求必须经过ShareBaseHttpService */
export class ShareBaseHttpService {
    constructor(private http: HttpClient) { }
    post(url: string, data): Observable<ShareResult> {
        return this.http.post(url, data).pipe(
            disposeError
        )
    }
    get(url: string): Observable<ShareResult> {
        return this.http.get(url).pipe(
            disposeError
        )
    }
}