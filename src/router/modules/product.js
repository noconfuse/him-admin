const productRouter = {
    path: '/product',
    component: 'Layout',
    redirect: '/product/product',
    name: 'ProductLayout',
    alwaysShow: true, // 一直显示根路由
    meta: { title: '测试管理', icon: 'product' },
    children: []
};

export default productRouter;
