export const REGEXP = {
    email: { type: 'email', errmsg: '邮箱', reg: new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$", 'i') },
    phone: { type: 'phone', errmsg: '手机号码', reg: new RegExp('^1(3|5|6|7|8|9)[0-9]{9}$') },
}