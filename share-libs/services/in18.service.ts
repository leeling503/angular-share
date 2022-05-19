import { Inject, Injectable } from "@angular/core";
import { Lang } from "share-libs/const/in18";

@Injectable({
    providedIn: 'root'
})
export class In18 {
    constructor() { }

    setIn18(lang: keyof typeof Lang = 'cn') {
        ScopeUtil.lang.in = lang;
    }
}

export class ScopeUtil {
    static lang = {
        in: 'cn'
    }
}