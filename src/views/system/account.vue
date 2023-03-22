<template>
    <div class="app-container">
        <SearchCriteria :filter="filter" @search="initData" />
        <div class="table-list">
            <div class="list-page-operation">
                <div class="l">
                    <el-button type="danger" @click="handleBatchDel">批量删除</el-button>
                </div>
                <div class="r">
                    <el-button plain type="warning">导出Excel</el-button>
                    <el-button type="success" @click="handleAdd">添加账户</el-button>
                </div>
            </div>
            <el-table ref="multipleTable" v-loading="loading" :data="tableData" border style="width: 100%" row-key="uuid" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" reserve-selection align="center" :selectable="_computedHasSelect" />
                <el-table-column prop="username" label="账号" align="center" />
                <el-table-column prop="roleName" label="角色" align="center" min-width="100" />
                <el-table-column prop="name" label="姓名" align="center" />
                <el-table-column prop="phone" label="联系手机" align="center" min-width="100" />
                <el-table-column prop="email" label="邮箱" align="center" min-width="150" />
                <el-table-column prop="identityCard" label="身份证" align="center" min-width="150" />
                <el-table-column prop="status" label="状态" align="center">
                    <template v-if="row.status != null" slot-scope="{row}">
                        <el-tag effect="dark" :type="row.status == '0' ? 'success' : 'danger'">{{ formatterVal(row,'status') }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="lastLoginTime" label="最后登录时间" min-width="150" align="center" />
                <el-table-column prop="createdTime" label="添加时间" min-width="150" align="center" />
                <el-table-column label="操作" fixed="right" align="center" width="210">
                    <template slot-scope="{row,$index}">
                        <div class="link-list">
                            <el-link :type="row.status == '0' ? 'primary' : 'success'" :underline="false" @click="handleOptStatus(row)">
                                {{ row.status == '0' ? '停用' : '启用' }}
                            </el-link>
                            <el-link type="primary" :underline="false" @click="handleEdit(row,$index)">
                                编辑
                            </el-link>
                            <el-link type="danger" :underline="false" @click="handleDel(row,$index)">
                                删除
                            </el-link>
                            <el-link type="warning" :underline="false" @click="handleResetPassword(row)">
                                重置密码
                            </el-link>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <Pagination :pagination="pagination" @refresh="initData" />
        <Dialog :dialog="dialog" @confirm="handleConfirm">
            <el-form :ref="dialog.ref" :model="dialog.form" :rules="dialog.rules" label-width="100px">
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="dialog.form.name" placeholder="请输入姓名" maxlength="64" />
                </el-form-item>
                <el-form-item label="账号" prop="username">
                    <el-input v-model="dialog.form.username" placeholder="请输入账号" maxlength="64" />
                </el-form-item>
                <el-form-item v-if="optType == 'add'" label="密码" prop="password">
                    <el-input v-model="dialog.form.password" type="password" show-password placeholder="请输入密码" maxlength="32" />
                </el-form-item>
                <el-form-item v-if="optType == 'add'" label="确认密码" prop="confirmPassword">
                    <el-input v-model="dialog.form.confirmPassword" type="password" show-password placeholder="请输入确认密码" maxlength="32" />
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                    <el-input v-model="dialog.form.phone" placeholder="请输入手机号" maxlength="11" />
                </el-form-item>
                <el-form-item label="角色" prop="roleUuid">
                    <el-select v-model="dialog.form.roleUuid" placeholder="请选择角色">
                        <el-option v-for="item in roleList" :key="item.uuid" :label="item.lableDesc" :value="item.uuid" />
                    </el-select>
                </el-form-item>
                <el-form-item label="个人邮箱" prop="email">
                    <el-input v-model="dialog.form.email" placeholder="请输入个人邮箱" maxlength="30" />
                </el-form-item>
                <el-form-item label="身份证">
                    <el-input v-model="dialog.form.identityCard" placeholder="请输入身份证" maxlength="18" />
                </el-form-item>
            </el-form>
        </Dialog>
    </div>
</template>

<script>
import {
    getUserList,
    getRoleList,
    addUser,
    updateUser,
    deleteUser,
    batchDeleteUser,
    updateUserStatus,
    queryUserDetail,
    resetPwd
} from '@/api/system';
import { pageSize, pageSizes } from '@/settings';
import {
    validateMobile,
    validateEmail,
    validateIdCard,
    validateAccountName,
    validatePassword,
    validateLength
} from '@/utils/validate';
import SearchCriteria from '@/components/SearchCriteria';
import Pagination from '@/components/Pagination';
import Dialog from '@/components/Dialog';
const baseForm = {
    name: '',
    username: '',
    password: '',
    confirmPassword: '',
    phone: '',
    roleUuid: '',
    identityCard: '',
    email: '',
    status: 0
};
export default {
    name: 'Account',
    components: {
        SearchCriteria,
        Pagination,
        Dialog
    },
    data () {
        return {
            loading: true,
            filter: {
                searchValue: {
                    type: 'input',
                    label: '关键词',
                    value: '',
                    placeholder: '账号/昵称/手机号/邮箱'
                },
                roleUuid: {
                    type: 'select',
                    label: '角色',
                    value: '',
                    placeholder: '请选择角色',
                    filterable: true,
                    options: []
                },
                status: {
                    type: 'select',
                    label: '状态',
                    value: '',
                    placeholder: '请选择状态',
                    filterable: true,
                    options: []
                },
                daterange: {
                    type: 'datePicker',
                    datePickerType: 'daterange',
                    label: '添加时间',
                    value: [],
                    startPlaceholder: '开始时间',
                    endPlaceholder: '结束时间'
                }
            },
            pagination: {
                // 分页信息
                page: 1,
                size: pageSize,
                pageSizes: pageSizes,
                total: 0
            },
            tableData: [],
            multipleSelection: [],
            optType: '',
            roleList: [],
            dialog: {
                title: '',
                show: false,
                ref: 'form',
                form: {},
                btnLoading: false,
                rules: {
                    name: [
                        {
                            required: true,
                            validator: validateLength.bind({
                                label: '姓名',
                                minLength: 2,
                                maxLength: 64
                            }),
                            trigger: 'blur'
                        }
                    ],
                    username: [
                        {
                            required: true,
                            validator: validateAccountName,
                            trigger: 'blur'
                        }
                    ],
                    password: [
                        {
                            required: true,
                            validator: validatePassword,
                            trigger: 'blur'
                        }
                    ],
                    confirmPassword: [
                        {
                            required: true,
                            message: '请输入确认密码',
                            trigger: 'blur'
                        }
                    ],
                    phone: [
                        {
                            required: true,
                            validator: validateMobile,
                            trigger: 'blur'
                        }
                    ],
                    roleUuid: [
                        {
                            required: true,
                            message: '请选择角色',
                            trigger: 'change'
                        }
                    ],
                    email: [
                        {
                            required: true,
                            validator: validateEmail,
                            trigger: 'blur'
                        }
                    ]
                }
            },
            status: [
                {
                    lableDesc: '开启',
                    uuid: 0
                },
                {
                    lableDesc: '禁用',
                    uuid: 1
                }
            ]
        };
    },
    async activated () {
        this.roleList = await this._getRoleList();
        console.log('this.roleList', this.roleList);
        this._initSearchOptions();
        this.initData();
    },
    methods: {
        /**
         * 初始化搜索条件数据
         */
        _initSearchOptions () {
            this.filter.status.options = this._packingOptions(this.status);
            this.filter.roleUuid.options = this.roleList;
        },
        /**
         * 判断当前行是否可以被选中
         */
        _computedHasSelect (row) {
            return true;
        },
        /**
         * table 选择框变化
         */
        handleSelectionChange (val) {
            this.multipleSelection = val;
            console.log(this.multipleSelection);
        },
        initData () {
            this.loading = true;
            const params = this._parseFilter();
            const daterange = params.daterange || [];
            let beginTime = '';
            let endTime = '';
            if (daterange.length) {
                beginTime = daterange[0];
                endTime = daterange[1];
            }
            getUserList({
                ...params,
                beginTime,
                endTime,
                pageNum: this.pagination.page,
                pageSize: this.pagination.size
            }).then((res) => {
                const { data, total } = res;
                this.pagination.total = total;
                this.tableData = data || [];
                this.loading = false;
            });
        },
        /**
         * 搜索
         */
        handleSearch () {
            this.pagination.page = 1;
            this.initData();
        },
        async handleAdd () {
            this.optType = 'add';
            this.dialog.title = '添加账户';
            this.dialog.show = true;
            this.dialog.form = JSON.parse(JSON.stringify(baseForm));
            if (!this.roleList.length) {
                this.roleList = await this._getRoleList();
            }
        },
        async handleEdit (row, index) {
            this.optType = 'edit';
            this.dialog.title = '编辑账户';
            this.dialog.show = true;
            if (!this.roleList.length) {
                this.roleList = await this._getRoleList();
            }
            const { data } = await queryUserDetail(row.uuid);
            const form = {};
            for (const i in baseForm) {
                form[i] = data[i];
            }
            form.uuid = row.uuid;

            this.dialog.form = form;
        },
        handleDel (row, index) {
            this.$syncConfirm({
                message: this.$tipsText.del,
                confirmFn: async () => {
                    return await deleteUser(row.uuid);
                },
                confirmSuccessCallback: this.initData
            });
        },
        _getRoleList () {
            return new Promise((resolve) => {
                getRoleList({
                    pageNum: 1,
                    pageSize: 1000
                }).then((res) => {
                    const { data } = res;
                    let roleList = [];
                    if (data.length) {
                        roleList = data.map((item) => {
                            return {
                                lableDesc: item.roleName,
                                uuid: item.uuid
                            };
                        });
                    }
                    resolve(roleList);
                });
            });
        },
        handleCloseForm () {
            this.dialog.show = false;
            this.dialog.btnLoading = false;
        },
        handleConfirm () {
            const form = this.dialog.form;
            // 验证密码一致性
            if (this.optType == 'add') {
                if (form.password != form.confirmPassword) {
                    this.$message({
                        message: '两次密码输入不一致!',
                        type: 'warning'
                    });
                    return false;
                }
            }
            // 如果身份证存在就校验其合法性
            if (form.idCard) {
                try {
                    validateIdCard(null, form.idCard, (error) => {
                        if (error) throw error;
                    });
                } catch (error) {
                    this.$message({
                        message: error.message,
                        type: 'warning'
                    });
                    return;
                }
            }
            switch (this.optType) {
                case 'add':
                    addUser({ ...form }).then((res) => {
                        this.$message({
                            message: '操作成功',
                            type: 'success'
                        });
                        this.handleCloseForm();
                        this.initData();
                    }).catch((e) => {
                        this.dialog.btnLoading = false;
                    });
                    break;
                case 'edit':
                    updateUser({ ...form }).then((res) => {
                        this.$message({
                            message: '操作成功',
                            type: 'success'
                        });
                        this.handleCloseForm();
                        this.initData();
                    }).catch((e) => {
                        this.dialog.btnLoading = false;
                    });
                    break;
            }
        },
        /**
         * 批量删除
         */
        handleBatchDel () {
            if (!this._verifyBatchCheck()) return;
            console.log(this.multipleSelection);
            this.$syncConfirm({
                message: this.$tipsText.batchDel,
                confirmFn: async () => {
                    return await batchDeleteUser({
                        uuidList: this.multipleSelection.map(elem => elem.uuid)
                    });
                },
                confirmSuccessCallback: () => {
                    this.handleClearSelection();
                    this.initData();
                }
            });
        },
        /**
         * 修改用户状态
         */
        handleOptStatus (row) {
            this.$syncConfirm({
                message: this.$tipsText.accountStatus,
                confirmFn: async () => {
                    return await updateUserStatus({
                        uuid: row.uuid,
                        status: row.status == '0' ? '1' : '0'
                    });
                },
                confirmSuccessCallback: this.initData
            });
        },
        /**
         * 重置账户密码
         */
        handleResetPassword (row) {
            this.$syncConfirm({
                message: this.$tipsText.resetPwd,
                confirmFn: async () => {
                    return await resetPwd(row.uuid);
                }
            });
        }
    }
};
</script>

<style lang="scss" scoped>
</style>
