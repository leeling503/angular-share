import { Menu } from './models'

/**
 * id 保留
 * key 必须，通过key 判断当前显示的左侧菜单栏，key 应该是最外层module的 path 
 * 例如：
 * { path: 'monitor', loadChildren: '../workspace/monitor/monitor.module#MonitorModule' },
 * { path: 'daily', loadChildren: '../workspace/daily-mgr/daily-mgr.module#DailyMgrModule' },
 * 那么 日常管理的key是daily,工况管理的key是 monitor
 * 
 * 
 */

export const GONGSI_MENUS: Menu[] = [
    { title: "大数据展示", icon: "left_menu_bigdata.png", path: '/home', },
    { title: "实时监控", icon: "left_menu_monitor.png", path: '/layout/monitor', canClose: false },
    { title: "数据查询", icon: "left_menu_query.png", path: '/layout/query', },
    { title: "统计分析", icon: "left_menu_statistics.png", path: '/layout/statistics', }
]

export const SETTING_MENU: Menu[] = [{
    title: "系统管理",
    icon: "left_menu_sys.png",
    menus: [
        { title: "航标管理", icon: "left_menu_hbgl.png", path: "/layout/sys/buoy" },
        { title: "航道管理", icon: "left_menu_hdgl.png", path: "/layout/sys/searoute" },
        { title: "灯质管理", icon: "left_menu_dzgl.png", path: "/layout/sys/light" },
        { title: "机构管理", icon: "left_menu_jggl.png", path: "/layout/sys/org" },
        { title: "角色管理", icon: "left_menu_jsgl.png", path: "/layout/sys/role" },
        { title: "用户管理", icon: "left_menu_yhgl.png", path: "/layout/sys/user" },
        { title: "数据修复", icon: "left_menu_sjxf.png", path: "/layout/sys/repair" },
        { title: "日志管理", icon: "left_menu_rzgl.png", path: "/layout/sys/log" }
    ]
}]

