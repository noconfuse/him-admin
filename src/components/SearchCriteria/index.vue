<template>
    <div class="search-criteria">
        <div class="header">
            <div class="title">筛选查询</div>
            <div class="opt">
                <el-button type="primary" @click="handleSearch">查询</el-button>
                <el-button plain @click="handleReset">重置</el-button>
            </div>
        </div>
        <div class="search-form">
            <div class="form" :class="{'expand':showAll}">
                <el-form ref="searchForm" :inline="true" :label-width="labelWidth">
                    <el-form-item v-for="(item,key) in filter" :key="key" :label="item.label">
                        <!-- 输入框 -->
                        <template v-if="item.type == 'input'">
                            <el-input v-model="item.value" :placeholder="item.placeholder" clearable :maxlength="item.maxlength || 30" />
                        </template>
                        <!-- 选择框 -->
                        <template v-if="item.type == 'select'">
                            <el-select v-model="item.value" :placeholder="item.placeholder" clearable :multiple="item.multiple || false" :filterable="item.filterable || false" collapse-tags @change="(val) => { handleSelectChange(key,val) }">
                                <el-option v-for="option in item.options" :key="option.uuid" :label="option.lableDesc" :value="option.uuid" />
                            </el-select>
                        </template>
                        <!-- 日期选择器 -->
                        <template v-if="item.type == 'datePicker'">
                            <el-date-picker v-model="item.value" :type="item.datePickerType || 'date'" :placeholder="item.placeholder" :start-placeholder="item.startPlaceholder || ''" :end-placeholder="item.endPlaceholder || ''" :format="item.format || 'yyyy-MM-dd'" :value-format="item.format || 'yyyy-MM-dd'" />
                        </template>
                        <!-- 插槽 -->
                        <template v-if="item.type == 'slot'">
                            <slot :name="key" :item="item" />
                        </template>
                    </el-form-item>
                </el-form>
            </div>
            <div v-if="showBtnFlag" class="expand-and-collapse">
                <el-button plain @click="handleExpandCollapse">{{ showAll ? '收起' : '展开' }}</el-button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SearchCriteria',
    props: {
        filter: {
            type: Object,
            default () {
                return {};
            }
        },
        labelWidth: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            showAll: false,
            showBtnFlag: false
        };
    },
    mounted () {
        this.$nextTick(() => {
            this._computedFlag();
            window.addEventListener('resize', this._computedFlag);
        });
    },
    beforeDestroy () {
        window.removeEventListener('resize', this._computedFlag);
    },
    methods: {
        /**
         * @description: 计算展开收起状态
         * @return {*}
         */
        _computedFlag () {
            const formH = this.$refs['searchForm'].$el.offsetHeight;
            if (formH > 40) {
                this.showBtnFlag = true;
            } else {
                this.showBtnFlag = false;
            }
        },
        /**
         * 搜索
         */
        handleSearch () {
            this.$emit('search');
        },
        /**
         * 重置搜索条件
         */
        handleReset () {
            // 重置数据
            const keys = Object.keys(this.filter);
            keys.forEach((elem) => {
                const value = this.filter[elem].value;
                if (Array.isArray(value)) {
                    this.filter[elem].value = [];
                } else {
                    this.filter[elem].value = '';
                }
            });
            console.log('this.filter', this.filter);
            this.handleSearch();
        },
        handleExpandCollapse () {
            this.showAll = !this.showAll;
        },
        handleSelectChange (key, val) {
            this.$emit('change', {
                key,
                val
            });
        }
    }
};
</script>

<style scoped lang="scss">
.search-criteria {
    border: 1px solid #ebeef5;
    .header {
        display: flex;
        align-items: center;
        padding: 10px 20px;
        border-bottom: 1px solid #ebeef5;
        background: #fafafa;
        .title {
            flex: 1;
            letter-spacing: 1px;
        }
    }

    .search-form {
        padding: 10px 20px 0;
        display: flex;
        .form {
            flex: 1;
            max-height: 39px;
            overflow: hidden;
            transition: all ease-in 0.3s;
            &.expand {
                max-height: inherit !important;
            }
        }
    }

    ::v-deep {
        .el-form-item {
            margin-bottom: 10px;
        }
        .el-range-editor {
            // width: 176px;
            width: 240px;
        }
    }
}

@media only screen and (max-width: 768px) {
    .search-criteria {
        .search-form {
            .form {
                max-height: inherit !important;
                ::v-deep {
                    .el-form-item__label {
                        width: auto;
                        text-align: left;
                    }
                    .el-form-item__content {
                        display: block;
                    }
                }
            }
        }
    }
    .expand-and-collapse {
        display: none !important;
    }
}
</style>
