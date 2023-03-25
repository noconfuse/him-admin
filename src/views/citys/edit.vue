<template>
    <div v-loading="loading" class="app-container">
        <el-form ref="form" class="dialog-form vertical" :model="form" :rules="rules" label-width="160px">
            <div class="page-detail-section">
                <div class="title">基本信息</div>
                <div class="content">
                    <el-row :gutter="20" type="flex">
                        <el-col :xs="24" :sm="12">
                            <el-form-item label="城市名称" prop="cityName">
                                <el-input v-model="form.cityName" placeholder="请输入城市名称"  />
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="12">
                            <el-form-item label="城市名称英文" prop="cityNameEn">
                                <el-input v-model="form.cityNameEn" placeholder="请输入城市名称英文"  />
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="12">
                            <el-form-item label="城市简介" prop="cityIntroduce">
                                <el-input v-model="form.cityIntroduce" placeholder="请输入城市简介"  />
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="12">
                            <el-form-item label="城市简介英文" prop="cityIntroduceEn">
                                <el-input v-model="form.cityIntroduceEn" placeholder="请输入城市简介英文"  />
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="12">
                            <el-form-item label="城市code" prop="cityCode">
                                <el-input v-model="form.cityCode" placeholder="请输入城市code"  />
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="12">
                            <el-form-item label="作者名称" prop="authorName">
                                <el-input v-model="form.authorName" placeholder="请输入作者名称"  />
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="12">
                            <el-form-item label="作者手机" prop="authorPhone">
                                <el-input v-model="form.authorPhone" placeholder="请输入作者手机"  />
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="12">
                            <el-form-item label="作者邮箱" prop="authorEmail">
                                <el-input v-model="form.authorEmail" placeholder="请输入作者邮箱"  />
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="12">
                        </el-col>
                        <el-col :xs="24" :sm="12">
                        </el-col>
                    </el-row>
                </div>
            </div>
        </el-form>
        <div class="save-wrapper">
            <div class="save-wrapper__container">
                <el-row type="flex" justify="center" :gutter="20" style="width:100%;">
                    <el-col :xs="24" :sm="2">
                        <el-button size="small" style="width:100%;" plain @click="handleCancel()">取消</el-button>
                    </el-col>
                    <el-col :xs="24" :sm="2">
                        <el-button size="small" style="width:100%;" type="primary" @click="handleConfirm()">保存</el-button>
                    </el-col>
                </el-row>
            </div>
        </div>
    </div>
</template>
<script>
import UploadFile from '@/components/UploadPic';
import api from '@/api/index'

export default {
    name: 'ExhibitMediaOpt',
    components: {
        UploadFile
    },
    data () {
        return {
            type: '',
            uuid: '',
            loading: false,
            form: {},
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
            },
            commonBoolean: []
        };
    },
    methods: {
        async initData () {
            
        },
        handleCancel () {
            this.$router.go(-1);
        },
        async handleConfirm () {
            api.addMenuInfo(this.form).then(res => {
                if (res.code === '0000') {
                    this.$message.success('新增成功')
                }
            })
        }
    }
};
</script>
