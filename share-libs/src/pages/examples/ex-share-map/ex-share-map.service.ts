import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpResult } from "share-libs/src/models";
import { HttpService } from "share-libs/src/services/http-base.service";

@Injectable({ providedIn: 'root' })
export class ExMapService {
    constructor(private http: HttpService) { }

    getShips(data): Observable<HttpResult> {
        return this.http.post('/api/Aisposition/getShips', data)
    }
}