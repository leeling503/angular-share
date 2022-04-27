import { Injectable } from "@angular/core";
/**全局过滤搜索条件服务 避免多层透传 */
@Injectable({ providedIn: 'root' })
export class GlFilterService {
    glFilter: any = {};
}