import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ShareBaseService {
    constructor(private http: HttpClient) { }

    post(url: string, data) {
        return this.http.post(url, data)
    }
    
    get(url: string) {
        return this.http.get(url)
    }

}