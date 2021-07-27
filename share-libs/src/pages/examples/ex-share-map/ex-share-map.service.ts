import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpResult } from "share-libs/src/models";
import { HttpBaseService } from "share-libs/src/services/http-base.service";

@Injectable({ providedIn: 'root' })
export class ExMapService {
    constructor(private http: HttpBaseService) { }

    getShips(data): Observable<HttpResult> {
        return this.http.post('/api/Aisposition/getShips', data)
    }
}