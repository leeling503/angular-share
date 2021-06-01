import { SimpleChanges } from "@angular/core"

/**不是第一次改变且当前值存在时返回true */
function UtilChangesNoFirstValue(c: SimpleChanges, key: string): boolean {
    return c[key] && !c[key].firstChange && c[key].currentValue !== undefined
}

/** 从undefined变为有值  true */
function UtilChangesHasValue(c: SimpleChanges, key: string): boolean {
    return c[key] && c[key].previousValue === undefined && c[key].currentValue
}

/**从有值变为undefined */
function UtilChangesUndefined(c: SimpleChanges, key: string): boolean {
    return c[key] && c[key].currentValue === undefined && c[key].previousValue
}

/**改变且当前值存在时返回true */
function UtilChangesValue(c: SimpleChanges, key: string): boolean {
    return c[key] && c[key].currentValue !== undefined
}

/**发生改变 */
function UtilChanges(c: SimpleChanges, key: string): boolean {
    return !!c[key]
}

/**不是第一次改变，无论变化后的值是否存在 */
function UtilChangesNotFirst(c: SimpleChanges, key: string): boolean {
    return !!c[key] && !c[key].firstChange
}
/**第一次改变，且变化后的值存在 */
function UtilChangesFirstValue(c: SimpleChanges, key: string): boolean {
    return !!c[key] && c[key].firstChange
}

export { UtilChangesNoFirstValue, UtilChangesHasValue, UtilChangesValue, UtilChangesUndefined, UtilChanges, UtilChangesNotFirst, UtilChangesFirstValue }
