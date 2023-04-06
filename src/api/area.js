/*
 * @Author: 陈文增 847078795@qq.com
 * @Date: 2022-02-21 22:27:20
 * @LastEditors: 陈文增 847078795@qq.com
 * @LastEditTime: 2022-06-16 15:09:05
 * @FilePath: /iot-mp-web/src/api/area.js
 * @Description: 地区相关接口
 */
import request from '@/utils/request';
import { API_PREFIX_SYSTEM } from '@/utils/config';

/**
 * 国家列表
 * @param {*} type
 * @returns
 */
export function queryCountryList (type = -1) {
    return request({
        url: `${API_PREFIX_SYSTEM}/area/queryCountryList/` + type,
        method: 'get'
    });
}

/**
 * 地址列表
 * @param {*} type
 * @returns
 */
export function queryAreaList (type = -1) {
    return request({
        url: `${API_PREFIX_SYSTEM}/area/queryList/` + type,
        method: 'get'
    });
}

