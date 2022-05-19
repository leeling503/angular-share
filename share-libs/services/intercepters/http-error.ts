import { Injectable } from '@angular/core';
import {
    HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse
} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';
import { OperatorFunction } from 'rxjs';
import { HttpResult } from 'share-libs/models';
import { of } from 'rxjs';
/**
 * 统一错误处理拦截 (当没有使用router时 必须要删除掉Router相关，否则不报错但无法发出http请求)
 */
@Injectable({ providedIn: 'root' })
export class HttpErrorInterceptor implements HttpInterceptor {
    constructor(private router: Router) { }
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        return next.handle(req).
            pipe(
                catchError((error: HttpErrorResponse) => {
                    if (error.status == 401) {
                        this.router.navigateByUrl('/error/401');
                    }
                    // if (error.status == 504) {
                    //     this.router.navigateByUrl('/error/504');
                    // }
                    const errormsg = error.error instanceof ErrorEvent ? `Error:${error.error.message}`
                        : `Error Code:${error.status},Message:${error.message}`;
                    console.log(errormsg);
                    return throwError(error);
                }),
            );
    }
}