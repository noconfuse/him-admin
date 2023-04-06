import request from '@/utils/request';
import { API_PREFIX_SYSTEM } from '@/utils/config';

// 用户管理
export function getUserList (data = {}) {
    return request({
        url: `${API_PREFIX_SYSTEM}/user/queryUserList`,
        method: 'post',
        data
    });
}
export function addUser (data = {}) {
    return request({
        url: `${API_PREFIX_SYSTEM}/user/addUser`,
        method: 'post',
        data
    });
}
export function updateUser (data = {}) {
    return request({
        url: `${API_PREFIX_SYSTEM}/user/updateUser`,
        method: 'put',
        data
    });
}
export function deleteUser (id) {
    return request({
        url: `${API_PREFIX_SYSTEM}/user/deleteUser/` + id,
        method: 'delete'
    });
}
export function batchDeleteUser (data = {}) {
    return request({
        url: `${API_PREFIX_SYSTEM}/user/batchDeleteUser`,
        method: 'delete',
        data: data
    });
}
export function queryUserDetail (id) {
    return request({
        url: `${API_PREFIX_SYSTEM}/user/queryUserDetail/` + id,
        method: 'get'
    });
}
export function updateUserStatus (data = {}) {
    return request({
        url: `${API_PREFIX_SYSTEM}/user/updateUserStatus`,
        method: 'put',
        data
    });
}
export function resetPwd (uuid, data = {}) {
    return request({
        url: `${API_PREFIX_SYSTEM}/user/resetPwd/${uuid}`,
        method: 'put',
        data
    });
}

// 角色管理
export function getRoleList (data = {}) {
    return request({
        url: `${API_PREFIX_SYSTEM}/role/queryRoleList`,
        method: 'post',
        data
    });
}
export function addRole (data = {}) {
    return request({
        url: `${API_PREFIX_SYSTEM}/role/addRole`,
        method: 'post',
        data
    });
}
export function updateRole (data = {}) {
    return request({
        url: `${API_PREFIX_SYSTEM}/role/updateRole`,
        method: 'put',
        data
    });
}
export function deleteRole (id) {
    return request({
        url: `${API_PREFIX_SYSTEM}/role/deleteRole/` + id,
        method: 'delete'
    });
}
export function queryRoleDetail (id) {
    return request({
        url: `${API_PREFIX_SYSTEM}/role/queryRoleDetail/` + id,
        method: 'get'
    });
}

// 用户菜单列表
export function queryMenuListByUser (params = {}) {
    return request({
        url: `${API_PREFIX_SYSTEM}/menu/queryMenuListByUser`,
        method: 'get',
        params
    });
}

// 用户按钮列表
export function queryBtnListByUser (params = {}) {
    return request({
        url: `${API_PREFIX_SYSTEM}/menu/queryBtnListByUser`,
        method: 'get',
        params
    });
}

// 系统菜单管理
export function queryAllMenuBtnList (data = {}) {
    return request({
        url: `${API_PREFIX_SYSTEM}/menu/queryAllMenuBtnList`,
        method: 'post',
        data
    });
}
export function insertMenuBtn (data = {}) {
    return request({
        url: `${API_PREFIX_SYSTEM}/menu/insertMenuBtn`,
        method: 'post',
        data
    });
}
export function deleteMenuBtn (uuid, menuType) {
    return request({
        url: `${API_PREFIX_SYSTEM}/menu/deleteMenuBtn/${uuid}/${menuType}`,
        method: 'delete'
    });
}
export function updateMenuBtn (uuid, data = {}) {
    return request({
        url: `${API_PREFIX_SYSTEM}/menu/updateMenuBtn/${uuid}`,
        method: 'put',
        data
    });
}

// 获取图形验证码
export function queryVerificationCode () {
    return request({
        url: `${API_PREFIX_SYSTEM}/oauth/queryVerificationCode`,
        method: 'get'
    });
}

// 操作日志
export function getOperationLogList (data = {}) {
    return request({
        url: `${API_PREFIX_SYSTEM}/log/queryList`,
        method: 'post',
        data
    });
}
export function getLoginLogList (data = {}) {
    return request({
        url: `${API_PREFIX_SYSTEM}/login/log/queryList`,
        method: 'post',
        data
    });
}
