import { map } from 'rxjs/operators';

import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { decryptAES, encryptAES } from 'share-libs/src/services/aes.service';
import { Injectable } from '@angular/core';
//加密
@Injectable({providedIn:'root'})
export class HttpEncryptInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let cloneReq: HttpRequest<any> = req.clone();
        if (environment.production) {
            if (typeof (req.body) == 'string') {
                cloneReq = req.clone({ responseType: 'text' });
            } else {
                cloneReq = req.clone({
                    body: { params: encryptAES(JSON.stringify(req['body'])) }, responseType: 'text'
                });
            }
        }
        return next.handle(cloneReq).pipe(
            map(res => {
                if (environment.production) {
                    if (res['body']) {
                        res['body'] = JSON.parse(decryptAES(res['body']))
                    }
                }
                return res
            }))
    }
}