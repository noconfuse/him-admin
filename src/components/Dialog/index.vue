<!--
 * @Author: 陈文增 847078795@qq.com
 * @Date: 2022-06-06 12:22:24
 * @LastEditors: 陈文增 847078795@qq.com
 * @LastEditTime: 2022-06-17 16:55:43
 * @FilePath: /iot-mp-web/src/components/Dialog/index.vue
 * @Description: 弹窗组件封装
-->
<template>
    <el-dialog class="dialog-form" append-to-body :title="dialog.title" :visible.sync="dialog.show" @close="handleClose">
        <slot />
        <div slot="footer" class="dialog-footer">
            <el-button @click="handleCancel">取 消</el-button>
            <el-button v-if="showConfirmBtn" type="primary" :loading="dialog.btnLoading" @click="handleConfirm">确 定</el-button>
            <el-button v-if="showCheckBtn" type="primary" :loading="dialog.btnLoading" @click="handleConfirm">审 核</el-button>
        </div>
    </el-dialog>
</template>
<script>
/**
 * this.dialog.ref
 * form 主体内容是否为表单 存在则是表单 确定 需验证 关闭需重置
 */
export default {
    name: 'Dialog',
    props: {
        dialog: {
            type: Object,
            default () {
                return {};
            }
        },
        showConfirmBtn: {
            type: Boolean,
            default: true
        },
        showCheckBtn: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {};
    },
    watch: {
        'dialog.show': {
            handler (val) {
                if (this.dialog.ref) {
                    this.$nextTick(() => {
                        this.$parent.$refs[this.dialog.ref].resetFields();
                    });
                }
            }
        }
    },
    methods: {
        handleConfirm () {
            if (this.dialog.ref) {
                this.$parent.$refs[this.dialog.ref].validate((valid) => {
                    if (valid) {
                        this.dialog.btnLoading = true;
                        this.$emit('confirm');
                    } else {
                        return false;
                    }
                });
            } else {
                this.$emit('confirm');
            }
        },
        handleCancel () {
            this.dialog.show = false;
        },
        handleClose () {
            this.$emit('close');
        }
    }
};
</script>
<style lang="scss" scope></style>
