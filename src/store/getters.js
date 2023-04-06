const getters = {
    sidebar: state => state.app.sidebar,
    cachedViews: state => state.tagsView.cachedViews,
    device: state => state.app.device,
    token: state => state.user.token,
    userInfo: state => state.user.userInfo,

    // 字典
    dictMap: state => state.dict.dictMap,
    checkSts: state => state.dict.checkSts,

    // 权限
    accessedRoutes: state => state.permission.accessedRoutes,
    permission_routes: state => state.permission.routes,
    btnPermission: state => state.permission.btnPermission
};

export default getters;
