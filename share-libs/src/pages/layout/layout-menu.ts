import { AUTHCODE } from "share-libs/src/const";

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
    /**authCode表示该菜单所需的权限，没有该权限则不会显示该菜单 */
    authCode?: string;
    /**是否显示根据用户权限生成,自行配置后将忽略账号权限*/
    ifShow?: boolean;
    /**子菜单 */
    children?: MenuItem[];
    /**是否展开子菜单 */
    openSub?: boolean;
    /**菜单处于激活状态 */
    active?: boolean;
}

let manage = `/layout/manage`,
    main = `/layout/main`,
    example = `/layout/example`,
    set = `/layout/setting`;
export const SYSTEM_MENU: MenuItem[] = [
    {
        id: "10001",
        title: '日常管理',
        icon: 'menu-daily-icon',
        url: manage,
        authCode: AUTHCODE.manage,
        ifShow: true,
        children: [
            {
                title: '首页',
                authCode: AUTHCODE.page,
                url: `${manage}/page`,
                ifShow: true,
            },
            {
                title: '工作台',
                authCode: AUTHCODE.bench,
                url: `${manage}/bench`,
                icon: 'menu-bench-icon',
                ifShow: true,
            },
            {
                title: '基础资料管理',
                authCode: AUTHCODE.base,
                openSub: true,
                icon: 'menu-base-icon',
                ifShow: true,
                children: [
                    {
                        title: '航标资料管理',
                        authCode: AUTHCODE.base_buoy,
                        icon: 'menu-base-buoy-icon',
                        url: `${manage}/base/buoy`,
                        openSub: true,
                        ifShow: true,
                        children: [
                            {
                                title: '航标资料表',
                                authCode: AUTHCODE.base_buoy_form,
                                url: `${manage}/base/buoy/form`,
                                icon: 'menu-base-buoy-form-icon',
                                ifShow: true,
                            },
                            {
                                title: '航标变更管理',
                                authCode: AUTHCODE.base_buoy_change,
                                icon: 'menu-base-buoy-change-icon',
                                ifShow: true,
                                url: `${manage}/base/buoy/change`,
                            },
                            {
                                title: '永久撤除航标',
                                authCode: AUTHCODE.base_buoy_remove,
                                ifShow: true,
                            }
                        ]
                    },
                ]
            },
        ]
    },
    {
        authCode: AUTHCODE.main,
        title: '工况监控',
        icon: 'menu-monitor-icon',
        url: main,
        ifShow: true,
    },
    {
        authCode: AUTHCODE.example,
        title: '组件示例',
        icon: 'menu-report-icon',
        url: example,
        ifShow: true,
        children: [
            {
                title: '按钮',
                url: `${example}/button`
            }, {
                title: '表格',
                children: [
                    {
                        title: '普通表格',
                        url: `${example}/table`,
                    }, {
                        title: '多表头表格',
                        url: `${example}/multi-table`,
                    }
                ]
            },
            {
                title: '多种选框',
                url: `${example}/box`
            }, {
                title: '选择框',
                url: `${example}/select`
            }, {
                title: '时间日期',
                url: `${example}/date-time`
            }, {
                title: '视频控件',
                url: `${example}/flv`
            }, {
                title: '文件上传',
                url: `${example}/file`
            }, {
                title: '3d模型',
                url: `${example}/3d`
            }, {
                title: '地图',
                url: `${example}/map`
            }, {
                title: '输入框',
                url: `${example}/input`
            }, {
                title: '弹窗',
                url: `${example}/modal`
            }
        ]
    },
    {
        title: '系统设置',
        icon: 'menu-setting-icon',
        authCode: AUTHCODE.setting,
        url: set,
        ifShow: true,
        children: [
            {
                title: '机构管理',
                authCode: AUTHCODE.set_org,
                ifShow: true,
                icon: 'sys-org-icon',
                url: '/admin/setting/org'
            },
            {
                title: '用户管理',
                authCode: AUTHCODE.set_user,
                icon: 'sys-user-icon',
                url: '/admin/setting/user2'
            },
            {
                title: '角色管理',
                authCode: AUTHCODE.set_role,
                icon: 'sys-role-icon',
                url: '/admin/setting/role2'
            },
        ]
    },
    {
        id: '10006',
        title: '无权限',
        ifShow: false,
        icon: 'monitor-mgr-icon',
        url: '/admin/error/404',
    }
]