export const OPTIONS_STATIC = Object.create(null);
export const OPTIONS_ACCOUNT = Object.create(null);
export const OPTIONS_DATA_BASE: { [key in PL_KEYS]: any[] } = Object.create(null);

import { Injectable } from "@angular/core";
/**全局选项服务 */
@Injectable({
    providedIn: "root"
})
export class GlobalOptionsService {
    /**静态 */
    private OPTIONS_STATIC = Object.create(null);
    /**不同账号选项会不同（切换账号需要改变，即退出登录清空）*/
    private OPTIONS_ACCOUNT = Object.create(null);
    /**数据库获取（获取后不用改变）*/
    private OPTIONS_DATA_BASE = Object.create(null);
    constructor() {
        this.initStatic();
    }

    initStatic() {
        this.OPTIONS_STATIC[PL_KEYS.X] = [];
    }

}

enum PL_KEYS {
    /**灯质选项*/
    X = 'X',
} 