import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from 'share-libs/src/services/auth.service';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class HttpAuthInterceptor implements HttpInterceptor {
    constructor(private auth: AuthService) { }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const authToken = this.auth.getAuthToken();
        const authReq = req.clone({ setHeaders: { Authorization: authToken } });
        return next.handle(authReq);
    }
}
