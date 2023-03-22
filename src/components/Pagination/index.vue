<!--
 * @Author: 陈文增 847078795@qq.com
 * @Date: 2022-06-06 10:59:08
 * @LastEditors: 陈文增 847078795@qq.com
 * @LastEditTime: 2022-06-20 12:14:22
 * @FilePath: /iot-mp-web/src/components/Pagination/index.vue
-->
<template>
    <div class="pagination">
        <el-pagination :current-page.sync="pagination.page" :page-size="pagination.size" :page-sizes="pagination.pageSizes" background layout="total,sizes, prev, pager, next" :total="pagination.total" :hide-on-single-page="false" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
</template>

<script>
import { scrollTo } from '@/utils/scroll-to';
export default {
    name: 'Pagination',
    props: {
        pagination: {
            type: Object,
            default () {
                return {};
            }
        },
        autoScroll: {
            type: Boolean,
            default: true
        }
    },
    data () {
        return {};
    },
    methods: {
        /**
         * 每页条数变化
         */
        handleSizeChange (val) {
            this.pagination.page = 1;
            this.pagination.size = val;
            this._handleRefresh();
        },
        /**
         * 当前页码变化
         */
        handleCurrentChange (page) {
            this.pagination.page = page;
            this._handleRefresh();
        },
        _handleRefresh () {
            this.autoScroll && scrollTo(0, 800);
            this.$emit('refresh');
        }
    }
};
</script>

<style lang="scss" scoped></style>
