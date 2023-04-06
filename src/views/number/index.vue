<template>
    <div class="app-container">
        <SearchCriteria :filter="filter" @search="initData" />
        <div class="table-list">
            <div class="list-page-operation">
                <div class="l" />
                <div class="r">
                    <el-button type="success" @click="handleAdd()">添加展馆</el-button>
                </div>
            </div>
            <el-table ref="multipleTable" v-loading="loading" :data="tableData" border style="width: 100%" row-key="uuid" :default-expand-all="false">
                <el-table-column prop="exhibitionHallName" label="展馆名称" align="left" min-width="200" />
                <el-table-column prop="exhibitionHallNameEn" label="展馆名称英文" align="left" min-width="200" />
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
            <el-form :ref="dialog.ref" :model="dialog.form" :rules="dialog.rules" label-width="120px">
                <el-form-item label="展馆名称" prop="exhibitionHallName">
                    <el-input v-model="dialog.form.exhibitionHallName" placeholder="请输入展馆名称"  />
                </el-form-item>
                <el-form-item label="展馆名称英文" prop="exhibitionHallNameEn">
                    <el-input v-model="dialog.form.exhibitionHallNameEn" placeholder="请输入展馆名称英文"  />
                </el-form-item>
                <el-form-item label="展馆code" prop="exhibitionHallCode">
                    <el-input v-model="dialog.form.exhibitionHallCode" placeholder="请输入展馆code"  />
                </el-form-item>
                <el-form-item label="背景音乐" prop="linkUrl">
                    <UploadFile ref="exhibitionBgsoundUrl" :multiple="false" :limit="1" :file-list.sync="dialog.form.exhibitionBgsoundUrl" accept=".mp3">
                        <ul>
                            <li>格式：mp3</li>
                        </ul>
                    </UploadFile>
                </el-form-item>
            </el-form>
        </Dialog>
    </div>
</template>

<script>
import api from '@/api/index';
import SearchCriteria from '@/components/SearchCriteria';
import Dialog from '@/components/Dialog';
import UploadFile from '@/components/UploadPic';

const baseForm = {
};
export default {
    name: 'Menu',
    components: {
        SearchCriteria,
        Dialog,
        UploadFile
    },
    data () {
        return {
            loading: true,
            filter: {
                exhibitionHallCode: {
                    type: 'input',
                    label: '展馆Code',
                    value: '',
                    placeholder: '请选择展馆Code',
                    filterable: true,
                },
                exhibitionHallName: {
                    type: 'input',
                    label: '展馆名称',
                    value: '',
                    placeholder: '请选择展馆名称',
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
                    exhibitionHallName: [
                        {
                            required: true,
                            message: '请输入展馆名称',
                            trigger: 'blur'
                        }
                    ],
                    exhibitionHallNameEn: [
                        {
                            required: true,
                            message: '请输入展馆名称英文',
                            trigger: 'blur'
                        }
                    ],
                }
            },
        };
    },
    computed: {
        
    },
    async created () {
        this.initData();
    },
    methods: {
        initData () {
            this.loading = true;
            const params = this._parseFilter()
            api.queryHallList({
                pageSize: 10,
                pageNum: 1,
                ...params
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
            this.dialog.title = '添加展馆';
            this.dialog.show = true;
            this.$nextTick(() => {
                this.dialog.form = form;
            });
        },
        async handleEdit (row, index) {
            this.optType = 'edit';
            this.dialog.title = '编辑展馆';
            this.dialog.show = true;
            this.$nextTick(() => {
                const data = JSON.parse(JSON.stringify(row));
                if (data.exhibitionBgsoundUrl) {
                    data.exhibitionBgsoundUrl = [{ url: data.exhibitionBgsoundUrl }]
                }
                this.dialog.form = data;
            });
        },
        handleDel (row, index) {
            this.$syncConfirm({
                message: this.$tipsText.del,
                confirmFn: async () => {
                    return api.deleteHallList(row.uuid);
                },
                confirmSuccessCallback: this.initData
            });
        },
        handleCloseForm () {
            this.dialog.show = false;
            this.dialog.btnLoading = false;
        },
        handleConfirm () {
            this.$refs[this.dialog.ref].validate(valid => {
                if (valid) {
                    const form = JSON.parse(JSON.stringify(this.dialog.form));
                    form.exhibitionBgsoundUrl = form.exhibitionBgsoundUrl && form.exhibitionBgsoundUrl[0] ? form.exhibitionBgsoundUrl[0].url : ''
                    if (form.uuid) {
                        api.putHallList(form).then(res => {
                            if (res.code === '0000') {
                                this.$message.success('修改成功')
                                this.initData()
                            }
                            this.handleCloseForm();
                        })
                    } else {
                        api.addHallInfo(form).then(res => {
                            if (res.code === '0000') {
                                this.$message.success('新增成功')
                                this.initData()
                            }
                            this.handleCloseForm();
                        })
                    }
                }
            })
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
         * 展馆类型变化
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
