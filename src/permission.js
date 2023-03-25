/*
 * @Author: 陈文增 847078795@qq.com
 * @Date: 2022-02-21 22:27:20
 * @LastEditors: 陈文增 847078795@qq.com
 * @LastEditTime: 2022-06-16 15:25:17
 * @FilePath: /iot-mp-web/src/permission.js
 * @Description: 入口权限控制
 */
import router from './router';
import store from './store';
import { Message } from 'element-ui';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css'; // progress bar style
import { getToken } from '@/utils/auth'; // get token from cookie
import getPageTitle from '@/utils/get-page-title';
import { asyncRoutes } from '@/router';

NProgress.configure({ showSpinner: false }); // NProgress Configuration

const whiteList = ['/login']; // no redirect whitelist

router.beforeEach(async (to, from, next) => {
    // start progress bar
    NProgress.start();

    // set page title
    document.title = getPageTitle(to.meta.title);

    // determine whether the user has logged in
    const hasToken = getToken();
    console.log(to, from, hasToken, 3333)
    if (hasToken) {
        if (to.path === '/login') {
            // if is logged in, redirect to the home page
            next({ path: '/' });
            NProgress.done();
        } else {
            const hasGetUserInfo = store.getters.userInfo.userName;
            if (hasGetUserInfo) {
                next();
            } else {
                try {
                    // get user info
                    await store.dispatch('user/getInfo');
                    await store.dispatch('permission/generateRoutes');
                    // await store.dispatch('permission/generatePermissionBtn');
                    next({ ...to, replace: true });
                } catch (error) {
                    // remove token and go to login page to re-login
                    await store.dispatch('user/resetToken');
                    // Message.error(error || 'Has Error')
                    // Message({
                    //     message: error.msg || 'Has Error',
                    //     type: 'error',
                    //     duration: 5 * 1000
                    // })
                    // next(`/login?redirect=${to.path}`)
                    next(`/login`);
                    NProgress.done();
                }
            }
        }
    } else {
        /* has no token*/

        if (whiteList.indexOf(to.path) !== -1) {
            // in the free login whitelist, go directly
            next();
        } else {
            // other pages that do not have permission to access are redirected to the login page.
            // next(`/login?redirect=${to.path}`)
            next(`/login`);
            NProgress.done();
        }
    }
});

router.afterEach(() => {
    // finish progress bar
    NProgress.done();
});
