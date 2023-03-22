<template>
    <div>
        <el-table ref="multipleTable" :data="tableData" border style="width: 100%" row-key="uuid">
            <el-table-column prop="username" align="center" label="设备名称" />
            <el-table-column prop="name" align="center" label="设备SN" />
            <el-table-column align="center" label="在线状态/绑定状态" min-width="140">
                <template slot-scope="{row}">
                    <div class="status">
                        <div class="item">
                            <el-link type="success" :underline="false">
                                在线
                            </el-link>
                        </div>
                        <div class="item">
                            <el-link type="success" :underline="false">
                                已绑定
                            </el-link>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="所属产品" min-width="220">
                <template slot-scope="{row}">
                    <div class="product">
                        <div class="pic">
                            <el-image style="width: 60px; height: 60px" src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg" fit="fill" />
                        </div>
                        <div class="con">
                            <div class="name">智控中心 CR3</div>
                            <div class="model">型号： CR3-000Z-HC</div>
                            <div class="category">类目：智控中心 CR3</div>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="name" align="center" label="类型" />
            <el-table-column prop="name" align="center" label="包版本" />
            <el-table-column align="center" label="绑定网关" min-width="150">
                <template slot-scope="{row}">
                    <div class="gateway">
                        <div class="name">智控中心 CR3</div>
                        <div class="model">型号： CR3-000Z-HC</div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="name" align="center" label="通讯方式" />
            <el-table-column align="center" label="时间" width="220">
                <template slot-scope="{row}">
                    <div class="activation-time">
                        <div>首次激活时间：2022-05-19 14:48:38</div>
                        <div>最近激活时间：2022-05-19 14:48:38</div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" align="center" width="200">
                <template slot-scope="{row}">
                    <div class="link-list">
                        <el-link type="primary" :underline="false" @click="handleDetail(row)">
                            设备详情
                        </el-link>
                        <el-link type="primary" :underline="false">
                            设备日志
                        </el-link>
                        <el-link v-if="type == 'my'" type="primary" :underline="false">
                            解绑
                        </el-link>
                    </div>
                </template>
            </el-table-column>
        </el-table>

        <!-- 设备详情 -->
        <DevicesDetail ref="devicesDetail" />
    </div>
</template>

<script>
import DevicesDetail from '@/components/Devices/detail.vue';
export default {
    name: 'DevicesTable',
    components: {
        DevicesDetail
    },
    props: {
        // my:我的设备
        type: {
            type: String,
            default: ''
        },
        tableData: {
            type: Array,
            default () {
                return [];
            }
        }
    },
    data () {
        return {};
    },
    methods: {
        handleDetail (row) {
            this.$refs.devicesDetail.drawer = true;
        }
    }
};
</script>

<style lang="scss" scoped>
.status {
    .item {
        line-height: 16px;
    }
    .el-link {
        font-size: 12px;
        cursor: inherit;
    }
}
.product {
    display: flex;
    align-items: center;
    .pic {
        flex: 0 0 60px;
    }
    .con {
        flex: 1;
        margin-left: 10px;
        font-size: 12px;
        color: #606266;
        line-height: 20px;
        .name {
            color: #409eff;
            font-weight: 500;
        }
    }
}
.gateway {
    font-size: 12px;
    color: #606266;
    line-height: 20px;
    text-align: left;
    .name {
        color: #409eff;
        font-weight: 500;
    }
}
.activation-time {
    font-size: 12px;
    color: #606266;
    line-height: 20px;
}
</style>
