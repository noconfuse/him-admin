<template>
    <div class="app-container">
        <SearchCriteria :filter="filter" @search="initData" />
        <div class="table-list">
            <div class="list-page-operation">
                <div class="l" />
                <div class="r">
                    <!-- <el-button type="success" @click="handleAdd()">添加图片</el-button> -->
                </div>
            </div>
            <el-table ref="multipleTable" v-loading="loading" :data="tableData" border style="width: 100%" row-key="uuid" :default-expand-all="false">
                <el-table-column prop="mediaFileType" label="媒体类型" align="left" min-width="200" />
                <el-table-column prop="mediaFileUrl" label="媒体文件" align="left" width="120">
                    <template slot-scope="{row}">
                        <el-image
                            v-if="row.mediaFileType === '图片'"
                            style="width: 100px; height: 100px"
                            :src="row.mediaFileUrl" 
                            :preview-src-list="[row.mediaFileUrl]">
                        </el-image>
                        <video v-if="row.mediaFileType === '视频'" :src="row.mediaFileUrl"></video>
                        <audio v-if="row.mediaFileType === '音频'" :src="row.mediaFileUrl"></audio>
                    </template>
                </el-table-column>
                <el-table-column prop="cityName" label="所属城市" align="left" min-width="200" />
                <!-- <el-table-column label="操作" align="center" width="140" fixed="right">
                    <template slot-scope="{row,$index}">
                        <el-link type="primary" :underline="false" @click="handleEdit(row,$index)">
                            查看
                        </el-link>
                    </template>
                </el-table-column> -->
            </el-table>
        </div>
        <Dialog :dialog="dialog" @confirm="handleConfirm">
            <el-form :ref="dialog.ref" :model="dialog.form" :rules="dialog.rules" label-width="100px">
                <el-form-item label="介绍" prop="imageIntroduce">
                    <el-input v-model="dialog.form.imageIntroduce" placeholder="请输入介绍"  />
                </el-form-item>
                <el-form-item label="英文介绍" prop="imageIntroduceEn">
                    <el-input v-model="dialog.form.imageIntroduceEn" placeholder="请输入英文介绍"  />
                </el-form-item>
                <el-form-item label="图片名称" prop="imageName">
                    <el-input v-model="dialog.form.imageName" placeholder="请输入图片名称"  />
                </el-form-item>
                <el-form-item label="图片code" prop="imageCode">
                    <el-input v-model="dialog.form.imageCode" placeholder="请输入图片code"  />
                </el-form-item>
                <el-form-item label="背景图片" prop="linkUrl">
                    <UploadFile ref="imageUrl" :multiple="false" :limit="1" :file-list.sync="dialog.form.imageUrl" accept=".jpg,.png,.jpeg">
                        <ul>
                            <li>格式：png/jpg</li>
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
                mediaFileType: {
                    type: 'input',
                    label: '文件类型',
                    value: '',
                    placeholder: '请输入文件类型',
                    filterable: true,
                },
                cityName: {
                    type: 'input',
                    label: '所属城市',
                    value: '',
                    placeholder: '请输入所属城市',
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
                    imageIntroduce: [
                        {
                            required: true,
                            message: '请输入介绍',
                            trigger: 'blur'
                        }
                    ],
                    imageIntroduceEn: [
                        {
                            required: true,
                            message: '请输入英文介绍',
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
            api.queryMediaLibraryList({
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
            this.dialog.title = '添加图片';
            this.dialog.show = true;
            this.$nextTick(() => {
                this.dialog.form = form;
            });
        },
        async handleEdit (row, index) {
            this.optType = 'edit';
            this.dialog.title = '编辑图片';
            this.dialog.show = true;
            this.$nextTick(() => {
                const data = JSON.parse(JSON.stringify(row));
                data.imageUrl = [{ url: data.imageUrl }]
                this.dialog.form = data;
            });
        },
        handleDel (row, index) {
            this.$syncConfirm({
                message: this.$tipsText.del,
                confirmFn: async () => {
                    return api.deleteMediaLibraryList(row.uuid);
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
                    form.imageUrl = form.imageUrl && form.imageUrl[0] ? form.imageUrl[0].url : ''
                    if (form.uuid) {
                        api.putMediaLibraryList(form).then(res => {
                            if (res.code === '0000') {
                                this.$message.success('修改成功')
                                this.initData()
                            }
                            this.handleCloseForm();
                        })
                    } else {
                        api.addMediaLibraryInfo(form).then(res => {
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
         * 图片类型变化
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
