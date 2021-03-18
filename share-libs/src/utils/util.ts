
export function shareIsEmpty(value: any): boolean {
    if (Array.isArray(value)) {
        return value.length == 0
    } else if (value === undefined || value === null || value === '') {
        return true;
    } else {
        return false;
    }
}

export function shareIsEqual(cur, value, uuid?: string) {
    if (cur === value) {
        return true
    } else if (Array.isArray(value) && Array.isArray(cur)) {
        let flag = value.every(e => cur.includes(e))
        if (uuid && !flag) {
            let curUuids = cur.map(e => e && e[uuid])
            flag = value.every(e => curUuids.includes(e[uuid]))
        }
        return flag
    } else if (uuid && cur[uuid] === value[uuid]) {
        return true
    }
    return false
}