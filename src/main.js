/*
 * @Author: 陈文增 847078795@qq.com
 * @Date: 2022-02-21 22:27:20
 * @LastEditors: 陈文增 847078795@qq.com
 * @LastEditTime: 2022-06-17 14:03:09
 * @FilePath: /iot-mp-web/src/main.js
 * @Description: 程序主入口
 */
import Vue from 'vue';
import ECharts from 'vue-echarts';

import 'normalize.css/normalize.css'; // A modern alternative to CSS resets

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss'; // global css

import App from './App';
import store from './store';
import router from './router';

import '@/icons'; // icon
import '@/permission'; // permission control

import syncConfirm from '@/utils/confirm';
import tipsText from '@/utils/tips-text';

/**
 * 指令注册
 */
import permissionDirective from '@/directive/permission'; // 指令
permissionDirective.install(Vue);

/**
 * 注册mixin
 */
import Mixin from '@/mixin';
Vue.mixin(Mixin);

// set ElementUI lang to EN
// Vue.use(ElementUI, { size:"mini",locale })
Vue.use(ElementUI, { size: 'mini' });
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.component('v-chart', ECharts);

Vue.config.productionTip = false;

// 全局公用方法挂载
Vue.prototype.$syncConfirm = syncConfirm;
Vue.prototype.$tipsText = tipsText;

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
});
