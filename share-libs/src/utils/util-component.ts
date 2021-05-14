import { SimpleChanges } from "@angular/core"

/**不是第一次改变且当前值存在时返回true */
function UtilChangesNoFirst(c: SimpleChanges, key: string): boolean {
    return c[key] && !c[key].firstChange && c[key].currentValue
}

/**改变且当前值存在时返回true */
function UtilChanges(c: SimpleChanges, key: string): boolean {
    return c[key] && c[key].currentValue
}

export { UtilChangesNoFirst, UtilChanges }
