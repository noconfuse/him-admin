/*
 * @Author: 陈文增 847078795@qq.com
 * @Date: 2022-02-21 22:27:20
 * @LastEditors: 陈文增 847078795@qq.com
 * @LastEditTime: 2022-06-16 15:08:14
 * @FilePath: /iot-mp-web/src/api/user.js
 * @Description: 系统基础接口
 */
import request from '@/utils/request';
import { API_PREFIX_BUSSINESS } from '@/utils/config';

export default {
    //首页图片配置
    homeImageAdd: (data) => {
        return request({
            url: `${API_PREFIX_BUSSINESS}/info/home/image/add`,
            method: 'post',
            data
        });
    },
    //新增首页菜单
    addMenuInfo: (data) => {
        return request({
            url: `${API_PREFIX_BUSSINESS}/info/menu/add`,
            method: 'post',
            data
        });
    },
    //新增首页菜单
    addMenuInfo: (data) => {
        return request({
            url: `${API_PREFIX_BUSSINESS}/info/menu/add`,
            method: 'post',
            data
        });
    },
    //查询首页菜单列表
    queryMenuList: (data) => {
        return request({
            url: `${API_PREFIX_BUSSINESS}/info/menu/list`,
            method: 'post',
            data
        });
    },
    //修改首页菜单
    putMenuList: (data) => {
        return request({
            url: `${API_PREFIX_BUSSINESS}/info/menu/update/${data.uuid}`,
            method: 'put',
            data
        });
    },
    //删除首页菜单
    deleteMenuList: (uuid) => {
        return request({
            url: `${API_PREFIX_BUSSINESS}/info/menu/delete/${uuid}`,
            method: 'delete',
        });
    },
    //新增图片配置
    addPicInfo: (data) => {
        return request({
            url: `${API_PREFIX_BUSSINESS}/info/home/image/add`,
            method: 'post',
            data
        });
    },
    //查询图片配置列表
    queryPicList: (data) => {
        return request({
            url: `${API_PREFIX_BUSSINESS}/info/home/image/list`,
            method: 'post',
            data
        });
    },
    //修改图片配置
    putPicList: (data) => {
        return request({
            url: `${API_PREFIX_BUSSINESS}/info/home/image/update/${data.uuid}`,
            method: 'put',
            data
        });
    },
    //删除图片配置
    deletePicList: (uuid) => {
        return request({
            url: `${API_PREFIX_BUSSINESS}/info/home/image/delete/${uuid}`,
            method: 'delete',
        });
    },
    //随机读取图片信息
    queryRandomHomeImage: (uuid) => {
        return request({
            url: `${API_PREFIX_BUSSINESS}/info/home/image/queryRandomHomeImage`,
            method: 'delete',
        });
    },
    //新增展馆配置
    addHallInfo: (data) => {
        return request({
            url: `${API_PREFIX_BUSSINESS}/info/exhibition/hall/add`,
            method: 'post',
            data
        });
    },
    //查询展馆配置列表
    queryHallList: (data) => {
        return request({
            url: `${API_PREFIX_BUSSINESS}/info/exhibition/hall/list`,
            method: 'post',
            data
        });
    },
    //修改展馆配置
    putHallList: (data) => {
        return request({
            url: `${API_PREFIX_BUSSINESS}/info/exhibition/hall/update/${data.uuid}`,
            method: 'put',
            data
        });
    },
    //删除展馆配置
    deleteHallList: (uuid) => {
        return request({
            url: `${API_PREFIX_BUSSINESS}/info/exhibition/hall/city/delete/${uuid}`,
            method: 'delete',
        });
    },
    //新增展馆城市配置
    addHallCityInfo: (data) => {
        return request({
            url: `${API_PREFIX_BUSSINESS}/info/exhibition/hall/city/add`,
            method: 'post',
            data
        });
    },
    //查询展馆城市配置列表
    queryHallCityList: (data) => {
        return request({
            url: `${API_PREFIX_BUSSINESS}/info/exhibition/hall/city/list`,
            method: 'post',
            data
        });
    },
    //修改展馆城市配置
    putHallCityList: (data) => {
        return request({
            url: `${API_PREFIX_BUSSINESS}/info/exhibition/hall/city/update/${data.uuid}`,
            method: 'put',
            data
        });
    },
    //删除展馆城市配置
    deleteHallCityList: (uuid) => {
        return request({
            url: `${API_PREFIX_BUSSINESS}/info/exhibition/hall/city/delete/${uuid}`,
            method: 'delete',
        });
    },
    // 随机生成账号
    addExhibitHallCityUser: (data = {}) => {
        return request({
            url: `${API_PREFIX_BUSSINESS}/info/exhibition/hall/city/addExhibitHallCityUser`,
            method: 'post',
            data
        });
    },
}

