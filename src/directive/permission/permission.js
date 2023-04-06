/*
 * @Author: 陈文增 847078795@qq.com
 * @Date: 2022-02-21 22:27:20
 * @LastEditors: 陈文增 847078795@qq.com
 * @LastEditTime: 2022-06-16 15:37:06
 * @FilePath: /iot-mp-web/src/directive/permission/permission.js
 * @Description: 权限指令
 */
import store from '@/store';

function checkPermission (el, binding) {
    const { value } = binding;
    const btnPermission = store.getters && store.getters.btnPermission;
    const btnList = value || [];
    const intersect = btnPermission.filter(elem => btnList.includes(elem));
    const hasPermission = !!intersect.length;
    if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el);
    }
}

export default {
    inserted (el, binding) {
        checkPermission(el, binding);
    },
    update (el, binding) {
        checkPermission(el, binding);
    }
};
