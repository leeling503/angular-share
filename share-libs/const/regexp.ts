/**正则对象的key值*/
type Regkey = 'number' | "int" | 'point' | 'phone' | 'email';

export const SL_REGEXP: { [key in Regkey]: { title: string, reg: RegExp } } = {
    number: { title: '', reg: /^\-{0,1}\d*\.{0,1}\d*/ },
    int: { title: '', reg: /^\-{0,1}\d*\.{0,1}\d*/ },
    point: { title: '', reg: /^\-{0,1}\d*\.{0,1}\d*/ },
    email: { title: '邮箱', reg: /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/i },
    phone: { title: '手机号码', reg: /^1(3|5|6|7|8|9)[0-9]{9}$/ },
}