const systemRouter = {
    path: '/user',
    component: 'Layout',
    redirect: '/user/user',
    name: 'UserLayout',
    alwaysShow: true, // 一直显示根路由
    meta: { title: '用户管理', icon: 'user' },
    children: [
        {
            path: 'user',
            name: 'User',
            component: 'user/user',
            meta: { title: '用户管理', breadcrumb: false }
        },
        {
            path: 'detail',
            name: 'UserDetail',
            component: 'user/detail',
            meta: { title: '用户详情', noCache: true, activeMenu: '/user/user' },
            hidden: true
        },
        {
            path: 'devices',
            name: 'UserDevices',
            component: 'user/devices',
            meta: { title: '已绑定设备', activeMenu: '/user/user' },
            hidden: true
        }
    ]
};

export default systemRouter;
