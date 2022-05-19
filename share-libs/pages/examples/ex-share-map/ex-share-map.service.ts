import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpResult } from "share-libs/models";
import { HttpService } from "share-libs/services/http-base.service";

@Injectable({ providedIn: 'root' })
export class ExMapService {
    constructor(private http: HttpService) { }

    getShips(data): Observable<HttpResult> {
        return this.http.post('/api/Aisposition/getShips', data)
    }
}