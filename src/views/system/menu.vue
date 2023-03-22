<template>
    <div class="app-container">
        <SearchCriteria :filter="filter" @search="initData" />
        <div class="table-list">
            <div class="list-page-operation">
                <div class="l" />
                <div class="r">
                    <el-button type="success" @click="handleAdd()">添加菜单</el-button>
                </div>
            </div>
            <el-table ref="multipleTable" v-loading="loading" :data="tableData" border style="width: 100%" row-key="uuid" :default-expand-all="false">
                <el-table-column prop="menuName" label="菜单名称" align="left" min-width="200" />
                <el-table-column prop="state" label="类型" align="center" :formatter="(row) => {return formatterVal(row,'menuType')}" />
                <el-table-column prop="state" label="是否缓存" align="center" :formatter="(row) => {return formatterVal(row,'noCache')}" />
                <el-table-column prop="state" label="显示状态" align="center" :formatter="(row) => {return formatterVal(row,'hidden')}" />
                <el-table-column prop="menuIcon" label="图标" align="center">
                    <template slot-scope="{row}">
                        <div v-if="row.menuIcon">
                            <i v-if="row.menuIcon.indexOf('el-icon') > -1" :class="row.menuIcon" />
                            <svg-icon v-else :icon-class="row.menuIcon" />
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="排序" align="center" />
                <el-table-column prop="permissions" label="权限标识" align="center" min-width="200" />
                <el-table-column prop="routeName" label="路由名称" align="center" min-width="200" />
                <el-table-column prop="routeUrl" label="路由地址" align="center" />
                <el-table-column prop="component" label="组件路径" align="center" min-width="200" />
                <el-table-column prop="state" label="状态" align="center">
                    <template v-if="row.state != null" slot-scope="{row}">
                        <el-tag :type="row.state == '1' ? 'success' : 'danger'">{{ formatterVal(row,'state') }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="createdTime" label="创建时间" min-width="145" align="center" />
                <el-table-column label="操作" align="center" width="140" fixed="right">
                    <template slot-scope="{row,$index}">
                        <div class="link-list">
                            <el-link v-if="row.menuType != '3'" type="primary" :underline="false" @click="handleAdd(row)">
                                添加
                            </el-link>
                            <el-link type="primary" :underline="false" @click="handleEdit(row,$index)">
                                编辑
                            </el-link>
                            <el-link type="danger" :underline="false" @click="handleDel(row,$index)">
                                删除
                            </el-link>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <Dialog :dialog="dialog" @confirm="handleConfirm">
            <el-form :ref="dialog.ref" :model="dialog.form" :rules="dialog.rules" label-width="100px">
                <el-form-item label="类型" prop="menuType">
                    <el-radio-group v-model="dialog.form.menuType" @change="handleMenuTypeChange">
                        <el-radio v-for="(item,index) in menuType" :key="index" :label="item.uuid" :disabled="item.disabled">{{ item.lableDesc }}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="所属菜单" prop="parentUuid">
                    <el-cascader v-model="dialog.form.parentUuid" :disabled="disabledParentMenu" :options="parentMenuList" :props="{ checkStrictly: true,label:'menuName',value:'uuid' }" clearable placeholder="请选择所属菜单" />
                </el-form-item>
                <el-form-item :label="menuTypeName + '名称'" prop="menuName">
                    <el-input v-model="dialog.form.menuName" placeholder="请输入名称" maxlength="20" />
                </el-form-item>
                <el-form-item label="排序" prop="sort">
                    <el-input-number v-model="dialog.form.sort" :min="1" :controls="false" step-strictly />
                </el-form-item>
                <template v-if="dialog.form.menuType != '3'">
                    <el-form-item :label="menuTypeName + '图标'" prop="menuIcon">
                        <el-input v-model="dialog.form.menuIcon" placeholder="支持项目内置svg以及element icon" maxlength="20" />
                    </el-form-item>
                    <el-form-item label="是否外链" prop="isLink">
                        <el-radio-group v-model="dialog.form.isLink" @change="handleClearValidate">
                            <el-radio v-for="(item,index) in isLink" :key="index" :label="item.uuid">{{ item.lableDesc }}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <template v-if="dialog.form.isLink == '0'">
                        <el-form-item label="路由名称" prop="routeName">
                            <el-input v-model="dialog.form.routeName" placeholder="请输入路由名称" maxlength="20" />
                        </el-form-item>
                        <el-form-item label="路由地址" prop="routeUrl">
                            <el-input v-model="dialog.form.routeUrl" placeholder="请输入路由地址" maxlength="64" />
                        </el-form-item>
                        <el-form-item label="组件路径" prop="component">
                            <el-select v-if="dialog.form.menuType == '1'" v-model="dialog.form.component" placeholder="请选择">
                                <el-option v-for="item in component" :key="item.uuid" :label="item.lableDesc" :value="item.uuid" />
                            </el-select>
                            <el-input v-else v-model="dialog.form.component" placeholder="请输入组件路径" maxlength="64" />
                        </el-form-item>
                        <el-form-item label="高亮路由" prop="activeMenu">
                            <el-input v-model="dialog.form.activeMenu" placeholder="请输入高亮路由" maxlength="64" />
                        </el-form-item>
                        <el-row :gutter="30" type="flex">
                            <el-col :xs="24" :sm="12" :md="12">
                                <el-form-item label="显示面包屑" prop="breadcrumb">
                                    <el-radio-group v-model="dialog.form.breadcrumb">
                                        <el-radio v-for="(item,index) in breadcrumb" :key="index" :label="item.uuid">{{ item.lableDesc }}</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </el-col>
                            <el-col :xs="24" :sm="12" :md="12">
                                <el-form-item label="是否缓存" prop="noCache">
                                    <el-radio-group v-model="dialog.form.noCache">
                                        <el-radio v-for="(item,index) in noCache" :key="index" :label="item.uuid">{{ item.lableDesc }}</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </template>
                    <el-form-item v-else label="外链地址" prop="routeUrl">
                        <el-input v-model="dialog.form.routeUrl" placeholder="请输入外链地址" maxlength="64" />
                    </el-form-item>
                    <el-row :gutter="30" type="flex">
                        <el-col :xs="24" :sm="12" :md="12">
                            <el-form-item label="显示状态" prop="hidden">
                                <el-radio-group v-model="dialog.form.hidden">
                                    <el-radio v-for="(item,index) in hidden" :key="index" :label="item.uuid">{{ item.lableDesc }}</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="12" :md="12">
                            <el-form-item label="菜单状态" prop="state">
                                <el-radio-group v-model="dialog.form.state">
                                    <el-radio v-for="(item,index) in state" :key="index" :label="item.uuid">{{ item.lableDesc }}</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </template>
                <template v-else>
                    <el-form-item key="permissions" label="权限标识" prop="permissions">
                        <el-input v-model="dialog.form.permissions" placeholder="请输入权限标识" maxlength="64" />
                    </el-form-item>
                    <el-form-item key="apiUrls" label="接口权限" prop="apiUrls">
                        <el-button type="success" style="margin-bottom:10px;" @click="handleAddApiUrls">新增</el-button>
                        <el-table :data="dialog.form.apiUrls" border style="width: 100%">
                            <el-table-column label="接口地址">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.url" placeholder="请输入接口地址" maxlength="100" />
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" align="center" width="100">
                                <template slot-scope="{row,$index}">
                                    <div class="link-list" style="justify-content:center;">
                                        <el-link type="danger" :underline="false" @click="handleDelApiUrls(row,$index)">
                                            删除
                                        </el-link>
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-form-item>
                </template>
            </el-form>
        </Dialog>
    </div>
</template>

<script>
import {
    queryAllMenuBtnList,
    insertMenuBtn,
    deleteMenuBtn,
    updateMenuBtn
} from '@/api/system';
import SearchCriteria from '@/components/SearchCriteria';
import Dialog from '@/components/Dialog';
const baseForm = {
    menuName: '',
    menuIcon: '',
    menuType: 1,
    parentUuid: ['0'],
    isLink: 0,
    routeUrl: '',
    hidden: 1,
    state: 1,
    routeName: '',
    noCache: 0,
    breadcrumb: 1,
    activeMenu: '',
    component: '',
    redirect: 'noRedirect',
    alwaysShow: 1,
    permissions: '',
    apiUrls: [],
    sort: 1
};
export default {
    name: 'Menu',
    components: {
        SearchCriteria,
        Dialog
    },
    data () {
        return {
            loading: true,
            filter: {
                state: {
                    type: 'select',
                    label: '状态',
                    value: '',
                    placeholder: '请选择状态',
                    filterable: true,
                    options: []
                }
            },
            tableData: [],
            parentMenuList: [],
            optType: '',
            dialog: {
                title: '',
                show: false,
                ref: 'form',
                form: baseForm,
                btnLoading: false,
                rules: {
                    menuType: [
                        {
                            required: true,
                            message: '请选择',
                            trigger: 'change'
                        }
                    ],
                    parentUuid: [
                        {
                            required: true,
                            message: '请选择',
                            trigger: 'change'
                        }
                    ],
                    menuName: [
                        {
                            required: true,
                            message: '请输入',
                            trigger: 'blur'
                        }
                    ],
                    sort: [
                        {
                            required: true,
                            message: '请输入',
                            trigger: 'blur'
                        }
                    ],
                    routeName: [
                        {
                            required: true,
                            message: '请输入',
                            trigger: 'blur'
                        }
                    ],
                    routeUrl: [
                        {
                            required: true,
                            message: '请输入',
                            trigger: 'blur'
                        }
                    ],
                    component: [
                        {
                            required: true,
                            message: '组件路径不能为空',
                            trigger: 'blur'
                        }
                    ],
                    hidden: [
                        {
                            required: true,
                            message: '请选择',
                            trigger: 'change'
                        }
                    ],
                    state: [
                        {
                            required: true,
                            message: '请选择',
                            trigger: 'change'
                        }
                    ],
                    permissions: [
                        {
                            required: true,
                            message: '请输入',
                            trigger: 'blur'
                        }
                    ]
                }
            },
            isLink: [
                {
                    lableDesc: '否',
                    uuid: 0
                },
                {
                    lableDesc: '是',
                    uuid: 1
                }
            ],
            hidden: [
                {
                    lableDesc: '隐藏',
                    uuid: 0
                },
                {
                    lableDesc: '显示',
                    uuid: 1
                }
            ],
            state: [
                {
                    lableDesc: '停用',
                    uuid: 0
                },
                {
                    lableDesc: '正常',
                    uuid: 1
                }
            ],
            noCache: [
                {
                    lableDesc: '缓存',
                    uuid: 0
                },
                {
                    lableDesc: '不缓存',
                    uuid: 1
                }
            ],
            breadcrumb: [
                {
                    lableDesc: '隐藏',
                    uuid: 0
                },
                {
                    lableDesc: '展示',
                    uuid: 1
                }
            ],
            component: [
                {
                    lableDesc: 'Layout',
                    uuid: 'Layout'
                },
                {
                    lableDesc: 'Blank',
                    uuid: 'Blank'
                }
            ]
        };
    },
    computed: {
        menuTypeName () {
            let name = '';
            const menuType = this.dialog.form.menuType;
            if (menuType) {
                name = this.menuType.find(elem => elem.uuid == menuType)?.lableDesc || '';
            }
            return name;
        },
        menuType () {
            const dict = [
                {
                    lableDesc: '目录',
                    uuid: 1,
                    disabled: false
                },
                {
                    lableDesc: '菜单',
                    uuid: 2,
                    disabled: false
                },
                {
                    lableDesc: '按钮',
                    uuid: 3,
                    disabled: false
                }
            ];
            if (this.optType == 'edit') {
                if (this.dialog.form.menuType == '3') {
                    dict[0].disabled = true;
                    dict[1].disabled = true;
                } else {
                    dict[2].disabled = true;
                }
            }
            return dict;
        },
        disabledParentMenu () {
            let bool = false;
            if (this.optType == 'edit' && this.dialog.form.menuType == '3' || this.optType == 'add_sub') {
                bool = true;
            }
            return bool;
        }
    },
    async activated () {
        this.filter.state.options = this._packingOptions(this.state);
        this.initData();
    },
    methods: {
        initData () {
            this.loading = true;
            const params = this._parseFilter();
            queryAllMenuBtnList({
                ...params
            }).then((res) => {
                const { data = [] } = res;
                if (data && data.length) {
                    this.tableData = data[0].children || [];
                    this.parentMenuList = this.getTreeData(JSON.parse(JSON.stringify(data)));
                } else {
                    this.tableData = [];
                    this.parentMenuList = [];
                }
                this.loading = false;
            }).catch(() => {
                this.loading = false;
            });
        },
        /**
         * 搜索
         */
        handleSearch () {
            this.initData();
        },
        async handleAdd (row) {
            const form = JSON.parse(JSON.stringify(baseForm));
            if (row && row.menuType) {
                this.optType = 'add_sub';
                form.parentUuid = row.uuid;
            } else {
                this.optType = 'add';
            }
            this.dialog.title = '添加菜单';
            this.dialog.show = true;
            this.$nextTick(() => {
                this.dialog.form = form;
            });
        },
        async handleEdit (row, index) {
            this.optType = 'edit';
            this.dialog.title = '编辑菜单';
            this.dialog.show = true;
            this.$nextTick(() => {
                const data = JSON.parse(JSON.stringify(row));
                const form = {};
                for (const i in baseForm) {
                    form[i] = data[i];
                }
                let apiUrls = form.apiUrls || [];
                if (apiUrls.length) {
                    apiUrls = apiUrls.map((elem) => {
                        return {
                            url: elem
                        };
                    });
                }
                form.apiUrls = apiUrls;
                form.uuid = row.uuid;
                this.dialog.form = form;
            });
        },
        handleDel (row, index) {
            this.$syncConfirm({
                message: this.$tipsText.del,
                confirmFn: async () => {
                    return await deleteMenuBtn(row.uuid, row.menuType);
                },
                confirmSuccessCallback: this.initData
            });
        },
        handleCloseForm () {
            this.dialog.show = false;
            this.dialog.btnLoading = false;
        },
        handleConfirm () {
            const form = JSON.parse(JSON.stringify(this.dialog.form));
            const parentUuid = form.parentUuid;
            const apiUrls = form.apiUrls || [];
            if (Array.isArray(parentUuid)) {
                form.parentUuid = parentUuid[parentUuid.length - 1];
            }
            if (apiUrls.length) {
                form.apiUrls = apiUrls.map(elem => elem.url && elem.url);
            }
            if (form.menuType == '1') {
                form.alwaysShow = 1;
            } else {
                form.alwaysShow = 0;
            }
            switch (this.optType) {
                case 'add_sub':
                case 'add':
                    insertMenuBtn({ ...form }).then((res) => {
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
                    if (form.uuid == form.parentUuid) {
                        this.$message({
                            message: '当前菜单和所属菜单冲突！',
                            type: 'error'
                        });
                        return;
                    }
                    updateMenuBtn(form.uuid, { ...form }).then((res) => {
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
         * 清空验证
         */
        handleClearValidate () {
            try {
                this.$refs[this.dialog.ref].clearValidate();
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * 菜单类型变化
         */
        handleMenuTypeChange () {
            this.dialog.form.component = '';
            this.handleClearValidate();
        },
        /**
         * 删除接口权限
         */
        handleDelApiUrls (row, index) {
            this.dialog.form.apiUrls.splice(index, 1);
        },
        /**
         * 新增接口权限
         */
        handleAddApiUrls () {
            this.dialog.form.apiUrls.push({
                url: ''
            });
        },
        getTreeData (data) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].children && data[i].children.length) {
                    data[i].children.forEach((elem, index) => {
                        if (elem.menuType == '3') {
                            data[i].children.splice(index, 1);
                        }
                    });
                }
                if (data[i].children.length < 1) {
                    // children若为空数组，则将children设为undefined
                    data[i].children = undefined;
                } else {
                    // children若不为空数组，则继续递归调⽤本⽅法
                    this.getTreeData(data[i].children);
                }
            }
            return data;
        }
    }
};
</script>

<style lang="scss" scoped>
.link-list {
    justify-content: flex-end;
}
</style>
