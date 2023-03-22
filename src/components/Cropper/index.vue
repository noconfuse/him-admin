<template>
    <div>
        <div class="cropper-content">
            <!-- 剪裁框 -->
            <div class="cropper">
                <vueCropper ref="cropper" :img="option.img" :output-size="option.size" :output-type="option.outputType" :info="true" :full="option.full" :can-move="option.canMove" :can-move-box="option.canMoveBox"
                    :original="option.original" :auto-crop="option.autoCrop" :auto-crop-width="autoCropWidth" :auto-crop-height="autoCropHeight" :fixed-box="option.fixedBox" :fixed="option.fixed" :fixed-number="fixedNumber"
                    @realTime="realTime" />
            </div>
            <!-- 预览框 -->
            <div v-if="false" class="show-preview" :style="{'width': '500px', 'height': '400px', 'overflow': 'hidden', 'margin': '0 25px', 'display':'flex', 'align-items' : 'center'}">
                <div :style="previews.div" class="preview">
                    <img :src="previews.url" :style="previews.img">
                </div>
            </div>
        </div>
        <div class="footer-btn">
            <!-- 缩放旋转按钮 -->
            <div class="scope-btn">
                <el-button type="primary" icon="el-icon-zoom-in" @click="changeScale(1)" />
                <el-button type="primary" icon="el-icon-zoom-out" @click="changeScale(-1)" />
                <el-button type="primary" @click="rotateLeft">逆时针旋转</el-button>
                <el-button type="primary" @click="rotateRight">顺时针旋转</el-button>
            </div>
            <!-- 确认上传按钮 -->
            <div class="upload-btn">
                <!-- <el-button type="primary" @click="uploadImg('blob')">上传</el-button> -->
                <el-button type="success" size="medium" :disabled="isDisabled" @click="uploadImg()">上传</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import { VueCropper } from 'vue-cropper';
export default {
    name: 'Cropper',
    components: { VueCropper },
    props: ['autoCropWidth', 'autoCropHeight', 'fixedNumber'],
    data () {
        return {
            previews: {}, // 预览数据
            option: {
                img: '', // 裁剪图片的地址  (默认：空)
                outputSize: 1, // 裁剪生成图片的质量  (默认:1)
                full: false, // 是否输出原图比例的截图 选true生成的图片会非常大  (默认:false)
                outputType: 'png', // 裁剪生成图片的格式  (默认:jpg)
                canMove: true, // 上传图片是否可以移动  (默认:true)
                original: false, // 上传图片按照原始比例渲染  (默认:false)
                canMoveBox: true, // 截图框能否拖动  (默认:true)
                autoCrop: true, // 是否默认生成截图框  (默认:false)
                fixedBox: false, // 固定截图框大小 不允许改变  (默认:false)
                fixed: false, // 是否开启截图框宽高固定比例  (默认:true)
                enlarge: 1
            },
            isDisabled: false,
            downImg: '#'
        };
    },
    methods: {
        changeScale (num) {
            // 图片缩放
            num = num || 1;
            this.$refs.cropper.changeScale(num);
        },
        rotateLeft () {
            // 向左旋转
            this.$refs.cropper.rotateLeft();
        },
        rotateRight () {
            // 向右旋转
            this.$refs.cropper.rotateRight();
        },
        realTime (data) {
            // 实时预览
            this.previews = data;
        },
        uploadImg (type) {
            // 将剪裁好的图片回传给父组件
            event.preventDefault();
            this.isDisabled = true;
            const that = this;
            if (type === 'blob') {
                this.$refs.cropper.getCropBlob((data) => {
                    that.$emit('upload', data);
                });
            } else {
                this.$refs.cropper.getCropData((data) => {
                    that.$emit('upload', data);
                });
            }
        }
    }
};
</script>
<style>
.cropper-content {
    display: flex;
    display: -webkit-flex;
    justify-content: flex-end;
    -webkit-justify-content: flex-end;
}
.cropper-content .cropper {
    width: 100%;
    height: 400px;
}
.cropper-content .show-preview {
    flex: 1;
    -webkit-flex: 1;
    display: flex;
    display: -webkit-flex;
    justify-content: center;
    -webkit-justify-content: center;
    overflow: hidden;
    border: 1px solid #cccccc;
    background: #cccccc;
    margin-left: 40px;
}
.preview {
    overflow: hidden;
    border: 1px solid #cccccc;
    background: #cccccc;
}
.footer-btn {
    margin-top: 30px;
    display: flex;
    display: -webkit-flex;
    justify-content: flex-end;
    -webkit-justify-content: flex-end;
}
.footer-btn .scope-btn {
    display: flex;
    display: -webkit-flex;
    justify-content: space-between;
    -webkit-justify-content: space-between;
}
.footer-btn .upload-btn {
    flex: 1;
    display: flex;
    justify-content: flex-end;
}
.footer-btn .btn {
    outline: none;
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    -webkit-appearance: none;
    text-align: center;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    outline: 0;
    margin: 0;
    -webkit-transition: 0.1s;
    transition: 0.1s;
    font-weight: 500;
    padding: 8px 15px;
    font-size: 12px;
    border-radius: 3px;
    color: #fff;
    background-color: #67c23a;
    border-color: #67c23a;
}
</style>
