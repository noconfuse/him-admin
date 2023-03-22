<!--
 * @Author: 陈文增 847078795@qq.com
 * @Date: 2022-06-17 16:25:07
 * @LastEditors: 陈文增 847078795@qq.com
 * @LastEditTime: 2022-06-20 16:18:39
 * @FilePath: /iot-mp-web/src/views/log/login.vue
-->
<template>
    <div class="app-container">
        <SearchCriteria :filter="filter" @search="initData" />
        <div class="table-list">
            <el-table v-loading="loading" :data="tableData" border style="width: 100%">
                <el-table-column prop="loginName" label="登录账号" width="100" />
                <el-table-column prop="loginIp" label="登录IP" width="120" />
                <el-table-column prop="loginStatus" label="登录状态" width="80">
                    <template slot-scope="{row}">
                        <el-tag :type="row.loginStatus == '1' ? 'danger' : 'success'">{{ formatterVal(row,'loginStatus') }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="loginDesc" label="登录描述" show-overflow-tooltip />
                <el-table-column prop="borderName" label="浏览器名称" min-width="100" />
                <el-table-column prop="borderType" label="浏览器类型" min-width="100" />
                <el-table-column prop="browserManufacturer" label="浏览器生产商" min-width="100" />
                <el-table-column prop="browserVersion" label="浏览器版本" width="100" />
                <el-table-column prop="osName" label="操作系统" />
                <el-table-column prop="loginTime" label="登录时间" width="140" />
            </el-table>
        </div>
        <Pagination :pagination="pagination" @refresh="initData" />
    </div>
</template>

<script>
import { getLoginLogList } from '@/api/system';
import { pageSize, pageSizes } from '@/settings';
import SearchCriteria from '@/components/SearchCriteria';
import Pagination from '@/components/Pagination';
export default {
    name: 'LoginLog',
    components: {
        SearchCriteria,
        Pagination
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
                loginName: {
                    type: 'input',
                    label: '登录账号',
                    value: '',
                    placeholder: '请输入登录账号'
                },
                loginStatus: {
                    type: 'select',
                    label: '登录状态',
                    value: '',
                    placeholder: '请选择登录状态',
                    filterable: true,
                    options: []
                },
                daterange: {
                    type: 'datePicker',
                    datePickerType: 'daterange',
                    label: '登录时间',
                    value: [],
                    startPlaceholder: '开始时间',
                    endPlaceholder: '结束时间'
                }
            },
            tableData: [],
            loginStatus: [
                {
                    lableDesc: '成功',
                    uuid: 0
                },
                {
                    lableDesc: '失败',
                    uuid: 1
                }
            ]
        };
    },
    activated () {
        this.filter.loginStatus.options = this._packingOptions(this.loginStatus);
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
            getLoginLogList({
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
        }
    }
};
</script>

<style lang="scss" scoped></style>
