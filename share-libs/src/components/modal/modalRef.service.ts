import { Observable } from 'rxjs/internal/Observable';
import { ShareModalComponent } from './modal/modal.component';

export abstract class ShareModalRef<T = any> {
    /**弹窗打开后的回调 */
    abstract emitAfterOpen: Observable<void>;
    /**弹窗关闭后的回调 */
    abstract emitAfterClose: Observable<void>;
    /**可直接调用获得ShareModal实例 */
    abstract getInstance(): ShareModalComponent<T>;
    /**需弹窗打开后调用 获得传入的组件实例*/
    abstract getComponentInstabce(): T | undefined;
    /**关闭ShareModal弹窗 */
    abstract closeShareModal(): void;
}