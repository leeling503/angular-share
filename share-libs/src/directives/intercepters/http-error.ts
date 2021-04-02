import { Injectable } from '@angular/core';
import {
    HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse
} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';
/**
 * 统一错误处理拦截 (当没有使用router时 必须要删除掉Router相关，否则不报错但无法发出http请求)
 */
@Injectable({ providedIn: 'root' })
export class HttpErrrorInterceptor implements HttpInterceptor {
    constructor(private router: Router) { }
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        return next.handle(req).
            pipe(
                catchError((error: HttpErrorResponse) => {
                    let data: any = {};
                    data = {
                        message: error && error.message ? error.message : '',
                        status: error.status
                    };
                    if (data.status == 401) {
                        this.router.navigateByUrl('/error/401');
                    }
                    return throwError(error);
                }),
                catchError((error: HttpErrorResponse) => {
                    // console.log(error)
                    const errormsg = error.error instanceof ErrorEvent ? `Error:${error.error.message}`
                        : `Error Code:${error.status},Message:${error.message}`;
                    console.log(errormsg);
                    return throwError(error);
                }),
            );
    }
}