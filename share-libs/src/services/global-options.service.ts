/**静态 */
export const OPTIONSSTATIC = Object.create(null);
/**不同账号选项会不同（切换账号需要改变，即退出登录清空）*/
export const OPTIONSACCOUNT = Object.create(null);
/**数据库获取（获取不用改变）*/
export const OPTIONSDATABASE = Object.create(null);

import { Injectable } from "@angular/core";
/**全局选项服务 */
@Injectable({
    providedIn: "root"
})
export class GlobalOptionsService {
    constructor() { }

}