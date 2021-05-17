export interface MenuItem {
    /**暂无意义 */
    id?: string,
    /**标题 */
    title?: string,
    /**路由地址 */
    url?: string;
    /**图标地址，需要在全局icon中配置该class */
    icon?: string;
    /**和路由匹配决定是否处于激活状态 */
    key?: string;
    /**code表示该菜单所需的权限，没有该权限则不会显示该菜单 */
    authCode?: string;
    /**子菜单 */
    children?: MenuItem[];
    /**是否显示  根据用户权限生成*/
    ifShow?: boolean;
    /**菜单处于激活状态 */
    active?: boolean;
    [key: string]: any
}

let lay = "/layout", lay_manage = `${lay}/manage`, lay_main = `${lay}/main`, lay_set = `${lay}/setting`;
export const SYSTEM_MENU: MenuItem[] = [
    {
        id: "10001",
        title: '日常管理',
        icon: 'menu-daily-icon',
        url: lay_manage, // 头部菜单点击默认跳转的页面
        authCode: '1',
        children: [
            {
                title: '工作台',
                url: `${lay_manage}/work`,
                authCode: '1.01',
            },
            {
                title: '首页',
                url: `${lay_manage}/bench`,
                authCode: '1.02',
            },
            {
                title: '日常管理',
                authCode: '1.1',
                icon: 'daily-data-icon',
                hidden: true,
                url: '/admin/daily/bench'
            },
            {
                title: '基础资料管理',
                authCode: '1.1',
                // icon: 'daily-data-icon',
                children: [
                    {
                        title: '航标资料管理',
                        authCode: '1.1.1',
                        children: [
                            {
                                title: '航标资料表',
                                authCode: '1.1.1.1',
                                url: '/admin/daily/data/mark/list-data'
                            },
                            {
                                title: '航标变更管理',
                                authCode: '1.1.1.2',
                                url: '/admin/daily/data/mark/modify-mgr'
                            },
                            {
                                title: '永久撤除航标',
                                authCode: '1.1.1.3',
                            }
                        ]
                    },
                ]
            },
        ]
    },
    {
        id: "10002",
        authCode: '2',
        title: '工况监控',
        icon: 'menu-monitor-icon',
        url: lay_main,
    },
    {
        id: "10003",
        key: "report",
        authCode: '3',
        title: '报表台账',
        icon: 'menu-report-icon',
        url: lay_main,
    },
    {
        id: "10004",
        key: 'setting',
        authCode: '4',
        title: '系统设置',
        icon: 'menu-setting-icon',
        url: lay_set,
        menu: [
            {
                title: '机构管理',
                authCode: '4.1',
                icon: 'sys-org-icon',
                url: '/admin/setting/org'
            },
            {
                title: '用户管理',
                authCode: '4.2',
                icon: 'sys-user-icon',
                url: '/admin/setting/user2'
            },
            {
                title: '角色管理',
                authCode: '4.3',
                icon: 'sys-role-icon',
                url: '/admin/setting/role2'
            },
        ]
    },
    {
        id: '10006',
        hidden: true,
        title: '无权限',
        icon: 'monitor-mgr-icon',
        url: '/admin/error/404',
        open: false,
    }
]