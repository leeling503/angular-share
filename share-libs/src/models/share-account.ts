export interface Account {
    /**角色code 区别超级管理员和普通用户等*/
    roleCode?: string;
    /**角色拥有的菜单权限列表 */
    menuCodeList?: string[];
}