const deviceRouter = {
    path: '/device',
    component: 'Layout',
    redirect: '/device/device',
    name: 'DeviceLayout',
    alwaysShow: true, // 一直显示根路由
    meta: { title: '测试', icon: 'el-icon-printer' },
    children: []
};

export default deviceRouter;
