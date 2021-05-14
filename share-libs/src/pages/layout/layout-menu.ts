export interface MenuItem {
    /**暂无意义 */
    id: string,
    /**标题 */
    title: string,
    /**路由地址 */
    url?: string;
    /**图标地址，需要在全局icon中配置该class */
    icon?: string;
    /**和路由匹配决定是否处于激活状态 */
    key?: string;
    /**code表示该菜单所需的权限，没有该权限则不会显示该菜单 */
    code?: string;
    /**子菜单 */
    children?: MenuItem[];

    [key: string]: any
}

let lay = "/layout"
let lay_manage = `${lay}/manage`
let lay_main = `${lay}/main`
export const SYSTEM_MENU: MenuItem[] = [
    {
        id: "10001",
        title: '日常管理',
        icon: 'menu-daily-icon',
        key: 'daily',
        url: lay_manage, // 头部菜单点击默认跳转的页面
        menuCode: '1',
        selected: true,
        menu: [
            {
                title: '工作台',
                path: '/admin/daily/bench/work',
                menuCode: '1.01',
            },
            {
                title: '首页',
                path: '/admin/daily/bench',
                menuCode: '1.02',
            },
            {
                title: '日常管理',
                menuCode: '1.1',
                icon: 'daily-data-icon',
                hidden: true,
                path: '/admin/daily/bench'
            },
            {
                title: '基础资料管理',
                menuCode: '1.1',
                // icon: 'daily-data-icon',
                children: [
                    {
                        title: '航标资料管理',
                        menuCode: '1.1.1',
                        children: [
                            {
                                title: '航标资料表',
                                menuCode: '1.1.1.1',
                                path: '/admin/daily/data/mark/list-data'
                            },
                            {
                                title: '航标变更管理',
                                menuCode: '1.1.1.2',
                                path: '/admin/daily/data/mark/modify-mgr'
                            },
                            {
                                title: '永久撤除航标',
                                menuCode: '1.1.1.3',
                            }
                        ]
                    },
                ]
            },
        ]
    },
    {
        id: "10002",
        key: 'monitor',
        menuCode: '2',
        title: '工况监控',
        icon: 'menu-monitor-icon',
        url: lay_main,
        open: false,
    },
    {
        id: "10003",
        key: "report",
        menuCode: '3',
        title: '报表台账',
        icon: 'menu-report-icon',
    },
    {
        id: "10004",
        key: 'setting',
        menuCode: '4',
        title: '系统设置',
        icon: 'menu-setting-icon',
        url: '/admin/setting/org',
        menu: [
            {
                title: '机构管理',
                menuCode: '4.1',
                icon: 'sys-org-icon',
                path: '/admin/setting/org'
            },
            {
                title: '用户管理',
                menuCode: '4.2',
                icon: 'sys-user-icon',
                path: '/admin/setting/user2'
            },
            {
                title: '角色管理',
                menuCode: '4.3',
                icon: 'sys-role-icon',
                path: '/admin/setting/role2'
            },
        ]
    },
    {
        id: '10006',
        key: 'error',
        hidden: true,
        title: '无权限',
        icon: 'monitor-mgr-icon',
        url: '/admin/error/404',
        open: false,
    }
]