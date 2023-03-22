<template>
    <div>
        <div class="upload-pic" :class="[listType]">
            <div class="l">
                <el-upload class="avatar-uploader" action="#" :accept="accept" :multiple="multiple" :limit="limit" :file-list="fileList" :list-type="listType" :class="{'hide':hideUploadEdit}" :before-upload="beforeUpload"
                    :on-change="onChange" :on-remove="handleRemove" :on-exceed="handleExceed" :disabled="disabled">
                    <i v-if="listType == 'picture-card'" class="el-icon-plus avatar-uploader-icon" />
                    <el-button v-else :disabled="hideUploadEdit" size="medium" type="primary">点击上传</el-button>
                    <div v-if="listType == 'picture-card'" slot="file" slot-scope="{file}" style="width: 100%; height: 100%">
                        <img v-if="_isPic(file.url)" class="el-upload-list__item-thumbnail" :src="file.url" alt="">
                        <video v-if="_isVideo(file.url)" fit="cover" controls class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                        <span class="el-upload-list__item-actions">
                            <span v-if="_isPic(file.url)" class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                                <i class="el-icon-zoom-in" />
                            </span>
                            <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file)">
                                <i class="el-icon-delete" />
                            </span>
                        </span>
                    </div>
                </el-upload>
            </div>
            <div class="r">
                <div class="upload-tips">
                    <div v-if="limitSize" class="tip-title">*注意</div>
                    <ul>
                        <slot />
                        <li v-if="limitSize">文件大小不超过{{ size }}MB</li>
                    </ul>
                </div>
            </div>
        </div>
        <el-dialog :visible.sync="dialogVisible" append-to-body>
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
        <!-- 剪裁组件弹窗 -->
        <el-dialog :visible.sync="cropperModel" append-to-body>
            <Cropper ref="vueCropper" :auto-crop-width="autoCropWidth" :auto-crop-height="autoCropHeight" :fixed-number="fixedNumber" @upload="_uploadBase64Pic" />
        </el-dialog>
    </div>
</template>
<script>
import Cropper from '@/components/Cropper';
import { uploadPic, uploadBase64Pic } from '@/api/upload';
let loading;
export default {
    name: 'UploadPic',
    components: {
        Cropper
    },
    props: {
        type: {
            type: String,
            default: 'pic'
        },
        listType: {
            type: String,
            default: 'picture-card'
        },
        accept: {
            type: String,
            default: '.jpg,.png,.jpeg'
        },
        multiple: {
            type: Boolean,
            default: true
        },
        limit: {
            type: Number,
            default: 6
        },
        limitSize: {
            type: Boolean,
            default: true
        },
        size: {
            type: Number,
            default: 20
        },
        fileList: {
            type: Array,
            default () {
                return [];
            }
        },
        isCropper: {
            // 是否使用裁剪功能
            type: Boolean,
            default: false
        },
        autoCropWidth: {
            // 剪裁框比例设置
            type: Number,
            default: 200
        },
        autoCropHeight: {
            // 剪裁框比例设置
            type: Number,
            default: 200
        },
        fixedNumber: {
            // 剪裁框比例设置
            type: Array,
            default: function () {
                return [1, 1];
            }
        },
        aiType: {
            type: String,
            default: 'other'
        },
        disabled: {
            type: Boolean,
            default: false
        },
        intercept: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            dialogImageUrl: '',
            dialogVisible: false,
            cropperModel: false // 剪裁组件弹窗开关
        };
    },
    computed: {
        hideUploadEdit () {
            return this.fileList.length >= this.limit;
        }
    },
    methods: {
        onChange (file, fileList) {
            if (!this.isCropper) return false;
            this.cropperModel = true;
            this.$nextTick(() => {
                if (this.$refs.vueCropper) {
                    this.$refs.vueCropper.option.img = file.url;
                }
            });
        },
        beforeUpload (file) {
            if (this.isCropper) return false;
            if (this.limitSize) {
                const isLt2M = file.size / 1024 / 1024 < this.size;

                if (!isLt2M) {
                    this.$message.error(`上传文件大小不能超过 ${this.size}MB!`);
                    return false;
                }
            }
            if (this.intercept) {
                this.$emit('upload', file);
            } else {
                this._uploadPic(file);
            }
            return false;
        },
        _uploadPic (file) {
            loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            uploadPic(file, this.aiType).then((res) => {
                this.fileList.push({
                    name: res.data,
                    url: res.data,
                    uid: file.uid
                });
                loading.close();
            }).catch((e) => {
                loading.close();
            });
        },
        _uploadBase64Pic (file) {
            loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            uploadBase64Pic({
                'base64Img': file
            }, this.aiType).then((res) => {
                this.cropperModel = false;
                this.fileList.push({
                    name: res.data,
                    url: res.data,
                    uid: file.uid
                });
                this.$refs.vueCropper.isDisabled = false;
                loading.close();
            }).catch((e) => {
                this.$refs.vueCropper.isDisabled = false;
                loading.close();
            });
        },
        handleRemove (file) {
            const fileIndex = this.fileList.findIndex((item) => item.uid == file.uid);
            if (fileIndex > -1) {
                this.fileList.splice(fileIndex, 1);
            }
        },
        handleExceed () {
            this.$message.error(`上传文件不能超过 ${this.limit}个!`);
            return false;
        },
        handlePictureCardPreview (file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        _isPic (url) {
            return /\.(gif|jpg|jpeg|png|GIF|JPEG|JPG|PNG)$/.test(url);
        },
        _isVideo (url) {
            return /\.(mp4)$/.test(url);
        }

    }
};
</script>

<style lang="scss" scoped>
.upload-pic {
    width: 100%;
    display: flex;
    .r {
        .upload-tips {
            padding-top: 10px;
            font-size: 14px;
            line-height: 1;
            padding-left: 20px;
            color: #f56c6c;
            font-weight: bold;
        }

        ul {
            padding: 0;

            li {
                font-size: 12px;
                list-style: none;
                color: #909399;
                margin-top: 10px;
                font-weight: 400;
                letter-spacing: 1px;
                line-height: 18px;
            }
        }
    }
    &.text {
        display: block;
        margin-top: 10px;
        .r {
            .upload-tips {
                padding-left: 0;
            }
        }
    }
}

.hide {
    ::v-deep .el-upload--picture-card {
        display: none !important;
    }
}
</style>
