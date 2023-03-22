/*
 * @Author: 陈文增 847078795@qq.com
 * @Date: 2022-02-21 22:27:20
 * @LastEditors: 陈文增 847078795@qq.com
 * @LastEditTime: 2022-06-20 13:26:48
 * @FilePath: /iot-mp-web/src/api/upload.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import request from '@/utils/request';
import { getToken } from '@/utils/auth';
export function uploadPic (file, type = 'other') {
    const data = new FormData();
    data.append('file', file);
    return request({
        url: `/utility/file/uploadFile?type=${type}`,
        method: 'post',
        data,
        headers: {
            'Content-Type': 'multipart/form-data',
            'token': getToken()
        }
    });
}

export function uploadBase64Pic (data, type = 'other') {
    return request({
        url: '/utility/file/uploadBase64Image',
        method: 'post',
        data: {
            ...data,
            type: type
        }
    });
}
