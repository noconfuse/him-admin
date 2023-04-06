/*
 * @Author: 陈文增 847078795@qq.com
 * @Date: 2022-06-17 12:30:25
 * @LastEditors: 陈文增 847078795@qq.com
 * @LastEditTime: 2022-06-17 13:04:59
 * @FilePath: /iot-mp-web/src/utils/confirm.js
 * @Description: 操作确认 异步关闭
 * @param: title 标题
 * @param: message 内容
 * @param: confirmButtonText 确认按钮文案
 * @param: confirmButtonLoadingText loading 状态确认按钮文案
 * @param: cancelButtonText 取消按钮文案
 * @param: showCancelButton 是否显示取消按钮
 * @param: type 提示类型
 * @param: successMsg 操作成功提示文案
 * @param: confirmFn 确认操作执行的函数
 * @param: confirmSuccessCallback 确认操作执行成功的回掉函数
 */
export default function confirm ({
    title = '提示',
    message = '',
    confirmButtonText = '确定',
    confirmButtonLoadingText = '执行中...',
    cancelButtonText = '取消',
    showCancelButton = true,
    type = 'warning',
    successMsg = '操作成功',
    confirmFn = null,
    confirmSuccessCallback = null
}) {
    this.$msgbox({
        title: title,
        message: message,
        confirmButtonText: confirmButtonText,
        cancelButtonText: cancelButtonText,
        showCancelButton: showCancelButton,
        type: type,
        beforeClose: async (action, instance, done) => {
            if (action === 'confirm') {
                instance.showClose = false;
                instance.showCancelButton = false;
                instance.closeOnPressEscape = false;
                instance.closeOnClickModal = false;

                instance.confirmButtonLoading = true;
                instance.confirmButtonText = confirmButtonLoadingText;
                try {
                    confirmFn && await confirmFn();
                    this.$message({
                        message: successMsg,
                        type: 'success'
                    });
                    setTimeout(() => {
                        done();
                        instance.confirmButtonLoading = false;
                    }, 100);
                    confirmSuccessCallback && confirmSuccessCallback();
                } catch (e) {
                    instance.showClose = true;
                    instance.showCancelButton = true;
                    instance.closeOnPressEscape = true;
                    instance.closeOnClickModal = true;

                    instance.confirmButtonLoading = false;
                    instance.confirmButtonText = confirmButtonText;
                }
            } else {
                done();
            }
        }
    });
}

