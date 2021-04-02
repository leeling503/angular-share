import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, finalize, mapTo, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';

@Injectable({ providedIn: 'root' })
export class HttpLogInterceptor implements HttpInterceptor {
  // constructor(private messager: MessageService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const started = Date.now();
    let state: string;
    return next.handle(req)
      .pipe(
        tap(
          // 有响应时成功，忽略其他的事件
          event => state = event instanceof HttpResponse ? 'succeeded' : '',
          // 操作失败; 返回 HttpErrorResponse对象
          error => state = 'failed',
        ),
        finalize(() => {
          const elapsed = Date.now() - started;
          const msg = `${req.method} '${req.urlWithParams}' ${state} in ${elapsed} ms.`;
          console.log(msg);
        })
      )
  }
}
