<!--
 * @Author: 陈文增 847078795@qq.com
 * @Date: 2022-06-17 16:25:07
 * @LastEditors: 陈文增 847078795@qq.com
 * @LastEditTime: 2022-06-20 17:35:34
 * @FilePath: /iot-mp-web/src/views/log/operation.vue
-->
<template>
    <div class="app-container">
        <SearchCriteria :filter="filter" @search="initData" />
        <div class="table-list">
            <el-table v-loading="loading" :data="tableData" border style="width: 100%">
                <el-table-column prop="createdBy" label="账号" width="100" />
                <el-table-column prop="createdTime" label="创建时间" width="140" show-overflow-tooltip />
                <el-table-column prop="operIp" label="请求IP" width="120" />
                <el-table-column prop="operUri" label="操作路径" show-overflow-tooltip />
                <el-table-column prop="operModul" label="操作模块" show-overflow-tooltip />
                <el-table-column prop="operType" label="操作类型" width="80" />
                <el-table-column prop="operDesc" label="操作描述" show-overflow-tooltip />
                <el-table-column v-if="_batchPermission(['log:operation:detail'])" label="操作" align="center" width="100" fixed="right">
                    <template slot-scope="{row,$index}">
                        <div class="link-list">
                            <el-link type="primary" :underline="false" @click="handleLook(row,$index)">
                                查看
                            </el-link>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <Pagination :pagination="pagination" @refresh="initData" />

        <Dialog :dialog="dialog" class="page-detail" :show-confirm-btn="false">
            <el-form ref="form">
                <el-form-item label="账号">
                    <div class="exhibition-text">{{ dialog.form.createdBy }}</div>
                </el-form-item>
                <el-form-item label="创建时间">
                    <div class="exhibition-text">{{ dialog.form.createdTime }}</div>
                </el-form-item>
                <el-form-item label="请求IP">
                    <div class="exhibition-text">{{ dialog.form.operIp }}</div>
                </el-form-item>
                <el-form-item label="请求参数">
                    <el-popover placement="bottom" title="请求参数" width="400" trigger="hover" :content="dialog.form.operRequParam">
                        <div slot="reference" class="ellipsis exhibition-text">{{ dialog.form.operRequParam }}</div>
                    </el-popover>
                </el-form-item>
                <el-form-item label="返回参数">
                    <el-popover placement="bottom" title="返回参数" width="400" trigger="hover" :content="dialog.form.operRespParam">
                        <div slot="reference" class="ellipsis exhibition-text">{{ dialog.form.operRespParam }}</div>
                    </el-popover>
                </el-form-item>
                <el-form-item label="操作路径">
                    <div class="exhibition-text">{{ dialog.form.operUri }}</div>
                </el-form-item>
                <el-form-item label="操作模块">
                    <div class="exhibition-text">{{ dialog.form.operModul }}</div>
                </el-form-item>
                <el-form-item label="操作类型">
                    <div class="exhibition-text">{{ dialog.form.operType }}</div>
                </el-form-item>
                <el-form-item label="操作描述">
                    <div class="exhibition-text">{{ dialog.form.operDesc }}</div>
                </el-form-item>
            </el-form>
        </Dialog>
    </div>
</template>

<script>
import { getOperationLogList } from '@/api/system';
import { pageSize, pageSizes } from '@/settings';
import SearchCriteria from '@/components/SearchCriteria';
import Pagination from '@/components/Pagination';
import Dialog from '@/components/Dialog';
export default {
    name: 'OperationLog',
    components: {
        SearchCriteria,
        Pagination,
        Dialog
    },
    data () {
        return {
            loading: true,
            pagination: { // 分页信息
                page: 1,
                size: pageSize,
                pageSizes: pageSizes,
                total: 0
            },
            filter: {
                searchValue: {
                    type: 'input',
                    label: '关键词',
                    value: '',
                    placeholder: '请输入关键词'
                },
                daterange: {
                    type: 'datePicker',
                    datePickerType: 'daterange',
                    label: '操作时间',
                    value: [],
                    startPlaceholder: '开始时间',
                    endPlaceholder: '结束时间'
                }
            },
            tableData: [],
            dialog: {
                title: '查看日志',
                show: false,
                ref: 'form',
                form: {}
            }
        };
    },
    activated () {
        this.initData();
    },
    methods: {
        initData () {
            this.loading = true;
            const params = this._parseFilter();
            const daterange = params.daterange || [];
            let beginTime = '';
            let endTime = '';
            if (daterange.length) {
                beginTime = daterange[0];
                endTime = daterange[1];
            }
            getOperationLogList({
                ...params,
                beginTime,
                endTime,
                pageNum: this.pagination.page,
                pageSize: this.pagination.size
            }).then((res) => {
                const { data, total } = res;
                this.pagination.total = total;
                this.tableData = data || [];
                this.loading = false;
            });
        },
        /**
         * 搜索
         */
        handleSearch () {
            this.pagination.page = 1;
            this.initData();
        },
        handleCurrentChange (page) {
            this.pagination.page = page;
            this.initData();
        },
        handleSizeChange (val) {
            this.pagination.page = 1;
            this.pagination.size = val;
            this.initData();
        },
        handleCloseForm () {
            this.dialog.show = false;
        },
        handleLook (row, index) {
            this.dialog.form = row;
            this.$nextTick(() => {
                this.dialog.show = true;
            });
        }
    }
};
</script>

<style lang="scss" scoped></style>
