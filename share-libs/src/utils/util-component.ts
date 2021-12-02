import { SimpleChanges } from "@angular/core"

/**发生改变 */
function UtilChanges(c: SimpleChanges, key: string): boolean {
    return !!c[key]
}

/**改变且当前值不为undefined时返回true */
function UtilChangesValue(c: SimpleChanges, key: string): boolean {
    return c[key] && c[key].currentValue !== undefined
}

/** 从undefined变为有值  true */
function UtilChangesHasValue(c: SimpleChanges, key: string): boolean {
    return c[key] && c[key].previousValue === undefined && c[key].currentValue
}

/**从有值变为undefined */
function UtilChangesUndefined(c: SimpleChanges, key: string): boolean {
    return c[key] && c[key].currentValue === undefined && c[key].previousValue
}

/**第一次改变 */
function UtilChangesFirst(c: SimpleChanges, key: string): boolean {
    return !!c[key] && c[key].firstChange
}

/**不是第一次改变*/
export function UtilChangesNoFirst(c: SimpleChanges, key: string): boolean {
    return !!c[key] && !c[key].firstChange
}

/**不是第一次改变且当前值不为undefined时返回true */
function UtilChangesNoFirstValue(c: SimpleChanges, key: string): boolean {
    return c[key] && !c[key].firstChange && c[key].currentValue !== undefined
}

export { UtilChangesNoFirstValue, UtilChangesHasValue, UtilChangesValue, UtilChangesUndefined, UtilChanges, UtilChangesFirst }
