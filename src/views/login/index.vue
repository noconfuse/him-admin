<template>
    <div class="login-container">
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
            <div class="logo">
                <img src="@/assets/images/logo.png" alt="">
            </div>
            <div class="title-container">
                <h3 class="title">HIMUSEUM</h3>
            </div>

            <el-form-item prop="username">
                <span class="svg-container">
                    <svg-icon icon-class="user" />
                </span>
                <el-input ref="username" v-model="loginForm.username" placeholder="账号" name="username" type="text" tabindex="1" />
            </el-form-item>

            <el-form-item prop="password">
                <span class="svg-container">
                    <svg-icon icon-class="password" />
                </span>
                <el-input :key="passwordType" ref="password" v-model="loginForm.password" :type="passwordType" placeholder="密码" name="password" tabindex="2" @keyup.enter.native="handleLogin" />
                <span class="show-pwd" @click="showPwd">
                    <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
                </span>
            </el-form-item>

            <el-form-item prop="verificationCode">
                <el-input ref="username" v-model="loginForm.verificationCode" placeholder="验证码" name="username" type="text" maxlength="16" tabindex="3" @keyup.enter.native="handleLogin" />
                <div class="verify-pic">
                    <img :src="verifyPic" alt="" @click.prevent.stop="_refreshPic">
                </div>
            </el-form-item>
            <el-form-item class="remember-account">
                <el-checkbox v-model="checked">记住账号</el-checkbox>
            </el-form-item>

            <el-button :loading="loading" type="primary" style="width:100%;margin-top:30px;" size="large" @click.native.prevent="handleLogin" @keyup.enter.native="handleLogin">登录
            </el-button>
        </el-form>
        <div class="copyright">copyright © 2022 homycloud.com</div>
    </div>
</template>

<script>
import { JSEncrypt } from 'jsencrypt';
const ACCOUNT_NAME_KEY = 'ACCOUNT_NAME';
import { queryVerificationCode } from '@/api/system';
export default {
    name: 'Login',
    data () {
        const validateUsername = (rule, value, callback) => {
            if (!value) {
                callback(new Error('请输入账号'));
            } else {
                callback();
            }
        };
        const validatePassword = (rule, value, callback) => {
            if (!value) {
                callback(new Error('请输入密码'));
            } else {
                callback();
            }
        };
        const validateCode = (rule, value, callback) => {
            if (!value) {
                callback(new Error('请输入验证码'));
            } else {
                callback();
            }
        };
        return {
            loginForm: {
                username: '',
                password: '',
                codeSerial: '',
                verificationCode: ''
            },
            loginRules: {
                username: [
                    {
                        required: true,
                        trigger: 'blur',
                        validator: validateUsername
                    }
                ],
                password: [
                    {
                        required: true,
                        trigger: 'blur',
                        validator: validatePassword
                    }
                ],
                verificationCode: [
                    {
                        required: true,
                        trigger: 'blur',
                        validator: validateCode
                    }
                ]
            },
            loading: false,
            passwordType: 'password',
            verifyPic: '',
            redirect: undefined,
            checked: false,
            otherQuery: {}
        };
    },
    watch: {
        $route: {
            handler: function (route) {
                const query = route.query;
                if (query) {
                    this.redirect = query.redirect;
                    this.otherQuery = this.getOtherQuery(query);
                }
            },
            immediate: true
        }
    },
    created () {
        const localAccountName = localStorage.getItem(ACCOUNT_NAME_KEY) || '';
        this.loginForm.username = localAccountName;
        this._refreshPic();
    },
    methods: {
        encryptedData (data) {
            var publicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCCyuMRsaJXsRs/IhUBsQeVU87qpa/ndLmSE0zkEq48K7ADmk/5jlwpP/FLXNn6xCexGOp1MOeSEmOEa6OrLrxS3UI+U8e/dJNoj+QAe2fQPMi73mZQv497P0Q2WaVeW6PSkuaTRSMDJCN2S8c/y+Y+5VmaX6uNOA48uSI/WpXAzwIDAQAB';
            const encryptor = new JSEncrypt();
            encryptor.setPublicKey(publicKey);
            return encryptor.encrypt(data);
        },
        _refreshPic () {
            queryVerificationCode().then((res) => {
                const { data = {} } = res;
                this.verifyPic = data.base64Img;
                this.loginForm.codeSerial = data.codeSerial;
            });
        },
        showPwd () {
            if (this.passwordType === 'password') {
                this.passwordType = '';
            } else {
                this.passwordType = 'password';
            }
            this.$nextTick(() => {
                this.$refs.password.focus();
            });
        },
        handleLogin () {
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    this.loading = true;

                    this.$store
                        .dispatch('user/login', {
                            ...this.loginForm,
                            password: this.encryptedData(
                                this.loginForm.password
                            )
                        })
                        .then(() => {
                            // this.$router.push({path: this.redirect || '/', query: this.otherQuery})
                            const username = this.loginForm.username;
                            if (this.checked) {
                                localStorage.setItem(ACCOUNT_NAME_KEY, username);
                            } else {
                                const localAccountName = localStorage.getItem(ACCOUNT_NAME_KEY) || '';
                                if (localAccountName != username) {
                                    localStorage.removeItem(ACCOUNT_NAME_KEY);
                                }
                            }
                            this.$router.push({ path: '/' });
                            this.loading = false;
                        })
                        .catch(() => {
                            this._refreshPic();
                            this.loading = false;
                        });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        getOtherQuery (query) {
            return Object.keys(query).reduce((acc, cur) => {
                if (cur !== 'redirect') {
                    acc[cur] = query[cur];
                }
                return acc;
            }, {});
        }
    }
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input {
        color: $cursor;
    }
}

/* reset element-ui css */
.login-container {
    .el-input {
        display: inline-block;
        height: 47px;
        width: 85%;

        input {
            background: transparent;
            border: 0px;
            -webkit-appearance: none;
            border-radius: 0px;
            padding: 12px 5px 12px 15px;
            color: $light_gray;
            height: 47px;
            caret-color: $cursor;

            &:-webkit-autofill {
                box-shadow: 0 0 0px 1000px $bg inset !important;
                -webkit-text-fill-color: $cursor !important;
            }
        }
    }

    .el-form-item {
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(0, 0, 0, 0.1);
        border-radius: 5px;
        color: #454545;
        &.remember-account {
            border: none;
            background: transparent;
            .el-checkbox__label {
                color: rgba(255, 255, 255, 0.6);
            }
        }
    }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
    min-height: 100%;
    width: 100%;
    background-color: $bg;
    overflow: hidden;

    .login-form {
        position: relative;
        width: 520px;
        max-width: 100%;
        padding: 160px 35px 0;
        margin: 0 auto;
        overflow: hidden;
    }

    .tips {
        font-size: 14px;
        color: #fff;
        margin-bottom: 10px;

        span {
            &:first-of-type {
                margin-right: 16px;
            }
        }
    }

    .svg-container {
        padding: 6px 5px 6px 15px;
        color: $dark_gray;
        vertical-align: middle;
        width: 30px;
        display: inline-block;
    }

    .title-container {
        position: relative;
        margin-top: 20px;

        .title {
            font-size: 26px;
            color: $light_gray;
            margin: 0px auto 30px auto;
            text-align: center;
            font-weight: bold;
            letter-spacing: 2px;
        }
    }

    .show-pwd {
        position: absolute;
        right: 10px;
        top: 7px;
        font-size: 16px;
        color: $dark_gray;
        cursor: pointer;
        user-select: none;
    }
}
.verify-pic {
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    padding: 4px;
    display: flex;
    justify-content: flex-end;
    cursor: pointer;
    img {
        display: block;
        width: auto;
        height: 100%;
    }
}

.copyright {
    position: absolute;
    bottom: 15px;
    left: 0;
    width: 100%;
    text-align: center;
    color: rgba(255, 255, 255, 0.6);
}
.logo {
    position: fixed;
    left: 20px;
    top: 10px;
    width: 100px;
    z-index: 100;
    img {
        display: block;
        width: 100%;
    }
}
</style>
