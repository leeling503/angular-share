import { DotRule, DotRules, TagRule, TagRules } from "../components/table/share-table.model"

/**生成TagRules代理防止undefined */
let UtilTableRuleTags = (rules: TagRules, defualt: TagRule = { value: '', text: '无数据', class: 'blue', color: '#FFF' }): TagRules => {
    let tagRules = new Proxy(rules, {
        get: (target: TagRules, key: string | number, receiver: any) => {
            return target[key] || defualt;
        }
    })
    return tagRules;
}
/**生成DotRules代理防止undefined */
let UtilTableRuleDots = (rules: DotRules, defualt: DotRule = { value: '', text: '无数据', class: 'blue', color: '#FFF' }): DotRules => {
    let tagRules = new Proxy(rules, {
        get: (target: DotRules, key: string | number, receiver: any) => {
            return target[key] || defualt;
        }
    })
    return tagRules;
}
/**生成TextRules代理防止undefined */
let UtilTableRuleText = (rules: object, defualt: string = '无匹配'): object => {
    let tagRules = new Proxy(rules, {
        get: (target: object, key: string | number, receiver: any) => {
            return target[key] || key || defualt;
        }
    })
    return tagRules;
}

export { UtilTableRuleTags, UtilTableRuleDots, UtilTableRuleText }