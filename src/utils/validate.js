/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal (path) {
    return /^(https?:|mailto:|tel:)/.test(path);
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername (str) {
    const valid_map = ['admin', 'editor'];
    return valid_map.indexOf(str.trim()) >= 0;
}

/**
 * element form 验证
 * @param {*} rule
 * @param {*} value
 * @param {*} callback
 *
 * 手机号验证
 * !/^1[0-9]{10}$/.test(value)
 */
export function validateMobile (rule, value, callback) {
    const label = this.label || '手机号';
    if (!value) {
        callback(new Error(`请输入${label}`));
    } else if (!/^1[0-9]{10}$/.test(value)) {
        callback(new Error(`${label}格式有误！`));
    } else {
        callback();
    }
}

/**
 * 邮箱验证
 * @param {*} rule
 * @param {*} value
 * @param {*} callback
 */
export function validateEmail (rule, value, callback) {
    if (!value) {
        callback(new Error('请输入邮箱'));
        // }else if(!/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(value)){
    } else if (!/^([a-zA-Z\d])((\w|-)+\.?)+@([a-zA-Z\d]+\.)+[a-zA-Z]{2,6}$/.test(value)) {
        callback(new Error('邮箱格式有误！'));
    } else {
        callback();
    }
}

/**
 * 身份证验证
 * @param {*} rule
 * @param {*} value
 * @param {*} callback
 */
export function validateIdCard (rule, value, callback) {
    if (!value) {
        callback(new Error('请输入身份证'));
    } else if (!/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value)) {
        callback(new Error('身份证格式有误！'));
    } else {
        callback();
    }
}

/**
 * 账户名验证
 * @param {*} rule
 * @param {*} value
 * @param {*} callback
 */
export function validateAccountName (rule, value, callback) {
    if (!value) {
        callback(new Error('请输入账号'));
    } else if (!/(^[a-zA-Z][a-zA-Z0-9_]{1,63}$)/.test(value)) {
        callback(new Error('请输入2-64个字符，支持字母、数字、下划线，以字母开头'));
    } else {
        callback();
    }
}

/**
 * 密码验证
 * @param {*} rule
 * @param {*} value
 * @param {*} callback
 */
export function validatePassword (rule, value, callback) {
    if (!value) {
        callback(new Error('请输入密码'));
    } else if (!/(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*?]+)$)^[\w~!@#$%^&*?]{6,32}$/.test(value)) {
        callback(new Error('请输入6-32个字符，必须包含数字、字母和特殊符号中的两种以上'));
    } else {
        callback();
    }
}

/**
 * 验证长度
 * @param {*} rule
 * @param {*} value
 * @param {*} callback
 */
export function validateLength (rule, value, callback) {
    if (!value) {
        callback(new Error(`请输入${this.label}`));
    } else if (value.length >= this.minLength && this.maxLength >= value.length) {
        callback();
    } else {
        callback(new Error(`请输入${this.minLength}-${this.maxLength}个字符`));
    }
}

