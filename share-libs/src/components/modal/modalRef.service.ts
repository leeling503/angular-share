import { Observable } from 'rxjs/internal/Observable';
import { ShareModalComponent } from './modal.component';

export abstract class ShareModalRef<R = any> {
    /**弹窗打开后的回调 */
    abstract emitAfterOpen: Observable<void>;
    /**弹窗关闭后的回调 */
    abstract emitAfterClose: Observable<void>;
    /**可直接调用获得ShareModal实例 */
    abstract getInstance(): ShareModalComponent<any>;
    /**需弹窗打开后调用 */
    abstract getComponentInstabce(): R;
    /**关闭ShareModal弹窗 */
    abstract closeShareModal(): R;
}