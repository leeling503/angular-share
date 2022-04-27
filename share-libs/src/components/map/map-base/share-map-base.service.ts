import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpResult } from "share-libs/src/models";
import { HttpService } from "share-libs/src/services/http-base.service";

@Injectable({
    providedIn: 'root'
})
export class ShareMapBase {
    constructor(private http_: HttpService) { }
    getPoint(data): Observable<HttpResult> {
        return this.http_.post('/api/Proarea/getPosition', data)
    }
}