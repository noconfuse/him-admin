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
                <el-table-column prop="menuName" label="中文名称" align="left" min-width="200" />
                <el-table-column prop="menuNameEn" label="英文名称" align="left" min-width="200" />
                <el-table-column prop="linkUrl" label="跳转链接" align="left" min-width="200" />
                <el-table-column label="操作" align="center" width="140" fixed="right">
                    <template slot-scope="{row,$index}">
                        <el-link type="primary" :underline="false" @click="handleEdit(row,$index)">
                            编辑
                        </el-link>
                        <el-link type="danger" style="margin-left: 10px" :underline="false" @click="handleDel(row,$index)">
                            删除
                        </el-link>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <Dialog :dialog="dialog" @confirm="handleConfirm">
            <el-form :ref="dialog.ref" :model="dialog.form" :rules="dialog.rules" label-width="100px">
                <el-form-item label="中文名称" prop="menuName">
                    <el-input v-model="dialog.form.menuName" placeholder="请输入中文名称"  />
                </el-form-item>
                <el-form-item label="英文名称" prop="menuNameEn">
                    <el-input v-model="dialog.form.menuNameEn" placeholder="请输入英文名称"  />
                </el-form-item>
                <el-form-item label="跳转地址" prop="linkUrl">
                    <el-input v-model="dialog.form.linkUrl" placeholder="请输入跳转地址"  />
                </el-form-item>
            </el-form>
        </Dialog>
    </div>
</template>

<script>
import api from '@/api/index';
import SearchCriteria from '@/components/SearchCriteria';
import Dialog from '@/components/Dialog';
const baseForm = {}
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
                menuName: {
                    type: 'input',
                    label: '中文名称',
                    value: '',
                    placeholder: '请选择中文名称',
                    filterable: true,
                },
                menuNameEn: {
                    type: 'input',
                    label: '英文名称',
                    value: '',
                    placeholder: '请选择英文名称',
                    filterable: true,
                },
            },
            tableData: [],
            parentMenuList: [],
            optType: '',
            dialog: {
                title: '',
                show: false,
                ref: 'form',
                form: {},
                btnLoading: false,
                rules: {
                    menuName: [
                        {
                            required: true,
                            message: '请输入中文名称',
                            trigger: 'blur'
                        }
                    ],
                    menuNameEn: [
                        {
                            required: true,
                            message: '请输入英文名称',
                            trigger: 'blur'
                        }
                    ],
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
    async created () {
        this.initData();
    },
    methods: {
        initData () {
            this.loading = true;
            const params = this._parseFilter()
            api.queryMenuList({
                pageSize: 10,
                pageNum: 1,
                ...params,
            }).then((res) => {
                const { data = [] } = res;
                if (data && data.length) {
                    this.tableData = data
                } else {
                    this.tableData = [];
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
                this.dialog.form = data;
            });
        },
        handleDel (row, index) {
            this.$syncConfirm({
                message: this.$tipsText.del,
                confirmFn: async () => {
                    return api.deleteMenuList(row.uuid);
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
            if (form.uuid) {
                api.putMenuList(form).then(res => {
                    if (res.code === '0000') {
                        this.$message.success('修改成功')
                        this.initData()
                    }
                    this.handleCloseForm();
                })
            } else {
                api.addMenuInfo(form).then(res => {
                    if (res.code === '0000') {
                        this.$message.success('新增成功')
                        this.initData()
                    }
                    this.handleCloseForm();
                })
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
