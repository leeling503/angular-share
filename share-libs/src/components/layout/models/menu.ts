export interface Menu {
    title: string;//名称
    menuCode?: string;//权限
    icon?: string;//图标
    path?: string;//url
    canClose?: boolean;//是否可以关闭
    menus?:Menu[];
}