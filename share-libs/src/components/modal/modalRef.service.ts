import { EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

export abstract class ShareModalRef<R = any> {
    abstract emitAfterOpen: Observable<void>;//弹窗打开后的回调
    abstract emitAfterClose: Observable<void>;//弹窗关闭后的回调
    abstract getInstance(): any;
    abstract getComponentInstabce(): R;
}