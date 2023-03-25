<template>
    <div v-loading="loading" class="app-container">
        <el-form ref="form" class="dialog-form vertical" label-position="top" :model="form" :rules="rules" label-width="160px">
            <div class="page-detail-section">
                <div class="title">征集内容</div>
                <div class="content">
                    <el-row :gutter="20" type="flex">
                        <el-col :xs="24" :sm="24">
                            <el-form-item label=" " prop="content">
                                <Editor :content.sync="form.content"></Editor>
                            </el-form-item>
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
import Editor from '@/components/Editor/Editor';
import api from '@/api/index'

export default {
    name: 'ExhibitMediaOpt',
    components: {
        Editor
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
