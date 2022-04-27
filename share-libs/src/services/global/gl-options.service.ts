import { Injectable } from "@angular/core";
import { PL_KEYS } from "share-libs/const/pl-keys";

export const OPTIONS_STATIC = Object.create(null);
export const OPTIONS_ACCOUNT = Object.create(null);
export const OPTIONS_DATA_BASE: { [key in PL_KEYS]: any[] } = Object.create(null);

/**全局选项服务 */
@Injectable({
    providedIn: "root"
})
export class GlOptionsService {
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