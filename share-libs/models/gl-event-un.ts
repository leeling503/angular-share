/** 服务事件注销类*/
export interface GlEventUn {
    id: string,
    un: () => void
}