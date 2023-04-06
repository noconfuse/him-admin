/*
 * @Author: 陈文增 847078795@qq.com
 * @Date: 2022-02-21 22:27:20
 * @LastEditors: 陈文增 847078795@qq.com
 * @LastEditTime: 2022-06-16 15:08:14
 * @FilePath: /iot-mp-web/src/api/user.js
 * @Description: 系统基础接口
 */
import request from '@/utils/request';
import { API_PREFIX_SYSTEM } from '@/utils/config';

export function login (data) {
    return request({
        url: `${API_PREFIX_SYSTEM}/oauth/userLogin`,
        method: 'post',
        data
    });
}

export function getInfo () {
    return request({
        url: `${API_PREFIX_SYSTEM}/oauth/getTokenUser`,
        method: 'get'
    });
}

export function logout () {
    return request({
        url: `${API_PREFIX_SYSTEM}/oauth/exitLogin`,
        method: 'get'
    });
}

export function updateUserPwd (data = {}) {
    return request({
        url: `${API_PREFIX_SYSTEM}/user/updateUserPwd`,
        method: 'put',
        data
    });
}
