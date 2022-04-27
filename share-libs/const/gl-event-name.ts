/**GlobalEventService服务的事件名枚举（键值必须唯一） */
export enum GlEventName {
    /**用户更新通知 */
    account = "account-change",
    /**变更事件 */
    change = 'change',
    /**实时数据 */
    realData = 'real-data'
}