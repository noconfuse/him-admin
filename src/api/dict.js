/*
 * @Author: 陈文增 847078795@qq.com
 * @Date: 2022-02-21 22:27:20
 * @LastEditors: 陈文增 847078795@qq.com
 * @LastEditTime: 2022-06-16 15:09:57
 * @FilePath: /iot-mp-web/src/api/dict.js
 * @Description: 字典管理
 */
import request from '@/utils/request';
import { API_PREFIX_SYSTEM } from '@/utils/config';

export function queryDictList (type) {
    return request({
        url: `${API_PREFIX_SYSTEM}/dict/queryListByType/${type}`,
        method: 'get'
    });
}

