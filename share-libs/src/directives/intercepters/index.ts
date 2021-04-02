import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpAuthInterceptor } from './http-auth';
import { HttpLogInterceptor } from './http-log';
import { HttpErrrorInterceptor } from './http-error';
import { HttpEncryptInterceptor } from './http-encrypt';
export const httpInterceptorProviders = [
    { provide: HTTP_INTERCEPTORS, useClass: HttpLogInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpAuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpEncryptInterceptor, multi: true },
];