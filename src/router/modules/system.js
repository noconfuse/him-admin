const systemRouter = {
    path: '/system',
    component: 'Layout',
    redirect: '/system/account',
    name: 'System',
    alwaysShow: true, // 一直显示根路由
    meta: { title: '账户管理', icon: 'password' },
    children: [
        {
            path: 'account',
            name: 'Account',
            component: 'system/account',
            meta: { title: '账户管理', breadcrumb: false }
        },
        {
            path: 'menu',
            name: 'Menu',
            component: 'system/menu',
            meta: { title: '菜单管理' }
        },
        {
            path: 'role',
            name: 'Role',
            component: 'system/role',
            meta: { title: '角色管理' }
        }
    ]
};

export default systemRouter;
