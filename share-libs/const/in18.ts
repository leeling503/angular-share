import { ScopeUtil } from "share-libs/services/in18.service";

export const Lang = {
    zh: {
        name: '中国'
    },
    cn: {
        name: 'china'
    }
}

export const Scope: any = new Proxy({}, {
    get: function (target, propKey, receiver) {
        let key = ScopeUtil.lang;
        let value = Lang[key.in][propKey]
        return value;
    },
    set: function (target, propKey, value, receiver) {
        return undefined;
    }
});


