<template>
    <el-drawer
        custom-class="devices-drawer"
        :visible.sync="drawer"
        :direction="direction"
        :show-close="false"
        append-to-body
        :with-header="false"
    >
        <div class="devices-detail">
            <div class="header">
                <div class="title">设备详情</div>
                <div class="opt">
                    <el-button
                        type="warning"
                        plain
                        size="mini"
                    >导出Excel</el-button>
                    <el-button
                        plain
                        size="mini"
                        @click="handleClose"
                    >关闭</el-button>
                </div>
            </div>
            <div class="content">
                <div class="table">
                    <div class="thead">
                        <div class="tr">
                            <div class="td">设备基本信息</div>
                        </div>
                    </div>
                    <div class="tbody">
                        <div class="tr">
                            <div class="td">
                                设备名称
                            </div>
                            <div class="td">一位开关面板</div>
                        </div>
                        <div class="tr">
                            <div class="td">
                                设备SN码
                            </div>
                            <div class="td">XXXXXXXXXXXXXX</div>
                        </div>
                        <div class="tr">
                            <div class="td">
                                所属产品
                            </div>
                            <div class="td">单键智控面板 P11</div>
                        </div>
                        <div class="tr">
                            <div class="td">
                                产品型号
                            </div>
                            <div class="td">P-110Z-TL</div>
                        </div>
                        <div class="tr">
                            <div class="td">
                                产品类目
                            </div>
                            <div class="td">宏云HomyPanel面板系列</div>
                        </div>
                        <div class="tr">
                            <div class="td">
                                产品类型
                            </div>
                            <div class="td">网关子设备</div>
                        </div>
                        <div class="tr">
                            <div class="td">
                                所属网关
                            </div>
                            <div class="td">智能终端T1</div>
                        </div>
                        <div class="tr">
                            <div class="td">
                                通讯方式
                            </div>
                            <div class="td">ZigBee3.0</div>
                        </div>
                        <div class="tr">
                            <div class="td">
                                研发方式
                            </div>
                            <div class="td">自研</div>
                        </div>
                        <div class="tr">
                            <div class="td">
                                厂家名称
                            </div>
                            <div class="td">宏云智能</div>
                        </div>
                        <div class="tr">
                            <div class="td">
                                当前包版本
                            </div>
                            <div class="td">V1.0.1-20220520</div>
                        </div>
                    </div>
                </div>
                <div class="table">
                    <div class="thead">
                        <div class="tr">
                            <div class="td">设备激活信息</div>
                        </div>
                    </div>
                    <div class="tbody">
                        <div class="tr">
                            <div class="td">
                                是否激活
                            </div>
                            <div class="td">是</div>
                        </div>
                        <div class="tr">
                            <div class="td">
                                首次激活时间
                            </div>
                            <div class="td">2022-05-19 14:48:38</div>
                        </div>
                        <div class="tr">
                            <div class="td">
                                最近激活时间
                            </div>
                            <div class="td">2022-05-19 14:48:38</div>
                        </div>
                        <div class="tr">
                            <div class="td">
                                当前在线
                            </div>
                            <div class="td">是</div>
                        </div>
                        <div class="tr">
                            <div class="td">
                                绑定用户
                            </div>
                            <div class="td">13828399876</div>
                        </div>
                        <div class="tr">
                            <div class="td">
                                绑定APP
                            </div>
                            <div class="td">宏云智能</div>
                        </div>
                    </div>
                </div>
                <div class="table">
                    <div class="thead">
                        <div class="tr">
                            <div class="td">设备安装信息</div>
                        </div>
                    </div>
                    <div class="tbody">
                        <div class="tr">
                            <div class="td">
                                安装地址
                            </div>
                            <div class="td" />
                        </div>
                        <div class="tr">
                            <div class="td">
                                安装位置
                            </div>
                            <div class="td">客厅</div>
                        </div>
                        <div class="tr">
                            <div class="td">
                                所属客户
                            </div>
                            <div class="td">北京万科</div>
                        </div>
                        <div class="tr">
                            <div class="td">
                                所属项目
                            </div>
                            <div class="td">翡翠公园</div>
                        </div>
                    </div>
                </div>
                <div class="table">
                    <div class="thead">
                        <div class="tr">
                            <div class="td">设备参数</div>
                        </div>
                    </div>
                    <div class="tbody">
                        <div class="tr">
                            <div class="td">
                                尺寸
                            </div>
                            <div class="td">86*86mm</div>
                        </div>
                        <div class="tr">
                            <div class="td">
                                重量
                            </div>
                            <div class="td">50g</div>
                        </div>
                        <div class="tr">
                            <div class="td">
                                材料
                            </div>
                            <div class="td">塑料</div>
                        </div>
                        <div class="tr">
                            <div class="td">
                                颜色
                            </div>
                            <div class="td">白色/黑色/金色/银色</div>
                        </div>
                        <div class="tr">
                            <div class="td">
                                输入电压
                            </div>
                            <div class="td">230V～50Hz</div>
                        </div>
                        <div class="tr">
                            <div class="td">
                                输出
                            </div>
                            <div class="td">220V</div>
                        </div>
                        <div class="tr">
                            <div class="td">
                                负载
                            </div>
                            <div class="td">200W</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </el-drawer>
</template>
<script>
export default {
    name: 'DevicesDetail',
    data() {
        return {
            drawer: false,
            direction: 'rtl'
        };
    },
    methods: {
        handleClose() {
            this.drawer = false;
        }
    }
};
</script>
<style lang="scss" scope>
.devices-drawer {
    .el-drawer__body {
        height: 100%;
    }
}
.devices-detail {
    width: 100%;
    height: 100%;
    padding: 10px;
    box-sizing: border-box;
    .header {
        display: flex;
        align-items: center;
        padding-bottom: 10px;
        .title {
            flex: 1;
            font-weight: bold;
        }
    }
    .content {
        height: calc(100% - 38px);
        overflow: auto;
        &::-webkit-scrollbar {
            display: none;
        }
    }
}

.table {
    border: 1px solid #ebeef5;
    border-bottom: none;
    &:last-child {
        border-bottom: 1px solid #ebeef5;
    }
    .thead {
        background: #f9fcff;
        .tr {
            &:last-child {
                border-bottom: 1px solid #ebeef5;
            }
            .td {
                flex: 1 !important;
                font-size: 14px;
                font-weight: 500;
            }
        }
    }
    .tr {
        border-bottom: 1px solid #ebeef5;
        display: flex;
        align-items: center;
        &:last-child {
            border-bottom: none;
        }
        .td {
            padding: 10px;
            border-right: 1px solid #ebeef5;
            font-size: 12px;
            &:first-child {
                flex: 0 0 25%;
                min-width: 100px;
            }
            &:last-child {
                border-right: 0;
            }
        }
    }
}

@media only screen and (max-width: 1200px) {
    .devices-drawer {
        width: 40% !important;
    }
}
@media only screen and (max-width: 700px) {
    .devices-drawer {
        width: 50% !important;
    }
}
@media only screen and (max-width: 500px) {
    .devices-drawer {
        width: 100% !important;
    }
}
</style>
