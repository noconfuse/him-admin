/*
 * @Author: 陈文增 847078795@qq.com
 * @Date: 2022-02-21 22:27:20
 * @LastEditors: 陈文增 847078795@qq.com
 * @LastEditTime: 2022-06-16 15:31:17
 * @FilePath: /iot-mp-web/src/store/modules/permission.js
 * @Description: 权限功能
 */
import router, { constantRoutes, getRouterList, asyncRoutes } from '@/router';
import { queryMenuListByUser, queryBtnListByUser } from '@/api/system';

const state = {
    routes: [],
    accessedRoutes: [],
    btnPermission: {} // 按钮权限
};
const mutations = {
    SET_ROUTES: (state, routes) => {
        state.accessedRoutes = routes;
        state.routes = constantRoutes.concat(routes);
        console.log(state.routes);
    },
    SET_BTN_PERMISSION: (state, btnList) => {
        state.btnPermission = btnList;
    }
};

const actions = {
    generateRoutes ({ commit }) {
        return new Promise((resolve, reject) => {
            queryMenuListByUser().then(response => {
                response.data = [
                    {
                        "alwaysShow": true,
                        "component": "string",
                        "hidden": false,
                        "meta": {
                            "activeMenu": "string",
                            "breadcrumb": true,
                            "icon": "string",
                            "noCache": false,
                            "title": "首页管理"
                        },
                        "name": "home",
                        "parentUuid": "123",
                        "path": "/home",
                        "uuid": "333",
                        "children": [
                            {
                                "alwaysShow": false,
                                "component": "string",
                                "hidden": false,
                                "meta": {
                                    "activeMenu": "string",
                                    "breadcrumb": true,
                                    "icon": "string",
                                    "noCache": false,
                                    "title": "菜单配置"
                                },
                                "name": "menu",
                                "parentUuid": "123",
                                "path": "menu",
                                "uuid": "555",
                            },
                            {
                                "alwaysShow": false,
                                "component": "string",
                                "hidden": false,
                                "meta": {
                                    "activeMenu": "string",
                                    "breadcrumb": true,
                                    "icon": "string",
                                    "noCache": false,
                                    "title": "图片配置"
                                },
                                "name": "pic",
                                "parentUuid": "123",
                                "path": "pic",
                                "uuid": "666",
                            },
                        ]
                    },
                    {
                        "alwaysShow": false,
                        "component": "string",
                        "hidden": false,
                        "meta": {
                            "activeMenu": "string",
                            "breadcrumb": true,
                            "icon": "string",
                            "noCache": false,
                            "title": "子页面管理"
                        },
                        "name": "subPage",
                        "parentUuid": "123",
                        "path": "subPage",
                        "uuid": "777",
                        "children": [
                            {
                                "alwaysShow": false,
                                "component": "string",
                                "hidden": false,
                                "meta": {
                                    "activeMenu": "string",
                                    "breadcrumb": true,
                                    "icon": "string",
                                    "noCache": false,
                                    "title": "数字游览"
                                },
                                "name": "number",
                                "parentUuid": "123",
                                "path": "number",
                                "uuid": "888",
                            },
                            {
                                "alwaysShow": false,
                                "component": "string",
                                "hidden": false,
                                "meta": {
                                    "activeMenu": "string",
                                    "breadcrumb": true,
                                    "icon": "string",
                                    "noCache": false,
                                    "title": "全球征集"
                                },
                                "name": "search",
                                "parentUuid": "123",
                                "path": "search",
                                "uuid": "999",
                            },
                            {
                                "alwaysShow": false,
                                "component": "string",
                                "hidden": false,
                                "meta": {
                                    "activeMenu": "string",
                                    "breadcrumb": true,
                                    "icon": "string",
                                    "noCache": false,
                                    "title": "关于博物馆"
                                },
                                "name": "about",
                                "parentUuid": "123",
                                "path": "about",
                                "uuid": "101",
                            },
                        ]
                    },
                    {
                        "alwaysShow": false,
                        "component": "string",
                        "hidden": false,
                        "meta": {
                            "activeMenu": "string",
                            "breadcrumb": true,
                            "icon": "string",
                            "noCache": false,
                            "title": "城市资源库"
                        },
                        "name": "citys",
                        "parentUuid": "123",
                        "path": "/citys/index",
                        "uuid": "102",
                    },
                ]
                const { data } = response;
                /**
                 * 特殊处理 redirect 防止登录进来404
                 */
                _computedRedirect(data);
                function _computedRedirect (data) {
                    data.forEach(item => {
                        delete item.redirect;
                        if (item.children && item.children.length) {
                            const currentChildren = item.children.filter(item => !item.hidden);
                            currentChildren.length && (item.redirect = { name: currentChildren[0].name });
                            _computedRedirect(item.children);
                        }
                    });
                }

                data.push({ path: '*', redirect: '/404', hidden: true });

                // const routes = getRouterList(JSON.parse(JSON.stringify(asyncRoutes)));
                const routes = getRouterList(JSON.parse(JSON.stringify(data)));

                commit('SET_ROUTES', routes);
                router.addRoutes(routes);
                resolve(routes);
            }).catch(error => {
                reject(error);
            });
        });
    },
    generatePermissionBtn ({ commit }) {
        return new Promise((resolve, reject) => {
            queryBtnListByUser().then(response => {
                const { data = [] } = response;
                const btnList = data.map(elem => elem.permissions);
                commit('SET_BTN_PERMISSION', btnList);
                resolve(btnList);
            }).catch(error => {
                reject(error);
            });
        });
    }
};

export default {
    namespaced: true,
    state,
    mutations,
    actions
};
