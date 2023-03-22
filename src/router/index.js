import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store';
import productRouter from './modules/product';
import deviceRouter from './modules/device';
import systemRouter from './modules/system';
import userRouter from './modules/user';
Vue.use(Router);

const map = new Map();

/* Layout */
map.set('Layout', () => import('@/layout'));
map.set('Blank', () => import('@/layout/blank'));

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/login/index'),
        hidden: true
    },
    {
        path: '/404',
        component: () => import('@/views/404'),
        hidden: true
    },
    {
        path: '/dashboard',
        component: map.get('Layout'),
        redirect: '/dashboard/index',
        children: [
            {
                path: 'index',
                name: 'Dashboard',
                component: () => import('@/views/dashboard/index')
            }
        ],
        hidden: true
    },
    {
        path: '/',
        component: map.get('Layout'),
        redirect: () => {
            const accessedRoutes = store.getters.accessedRoutes;
            const path = accessedRoutes.length ? accessedRoutes[0].path : '/dashboard';
            return path;
        }
    }
];

export const asyncRoutes = [
    productRouter,
    deviceRouter,
    userRouter,
    systemRouter,
    // 404 page must be placed at the end !!!
    { path: '*', redirect: '/404', hidden: true }
];

const loadView = (view) => {
    return (resolve) => require([`@/views/${view}`], resolve);
};

export const getRouterList = (userRouter) => {
    digui(userRouter);
    function digui (userRouter = []) {
        userRouter.forEach(function (item, index) {
            if (item.children != null && item.children.length > 0) {
                digui(item.children);
            } else {
                delete item.children;
            }
            if (item.component) {
                switch (item.component) {
                    case 'Layout':
                    case 'Blank':
                        item.component = map.get(item.component);// 通过映射找到我们定义好的组件
                        break;
                    default:
                        item.component = loadView(item.component);
                        break;
                }
            } else {
                delete item.component;
            }
        });
    }
    return userRouter;
};

const createRouter = () => new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
});

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter () {
    const newRouter = createRouter();
    router.matcher = newRouter.matcher; // reset router
}

export default router;
