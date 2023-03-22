<template>
    <div class="app-container">
        <SearchCriteria :filter="filter" @search="initData" />
        <div class="table-list">
            <div class="list-page-operation">
                <div class="l" />
                <div class="r">
                    <el-button type="success" @click="handleAdd">添加角色</el-button>
                </div>
            </div>
            <el-table ref="multipleTable" v-loading="loading" :data="tableData" border style="width: 100%" row-key="uuid" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" reserve-selection align="center" :selectable="_computedHasSelect" />
                <el-table-column prop="roleName" label="角色名称" show-overflow-tooltip />
                <el-table-column prop="remarks" label="描述" show-overflow-tooltip />
                <el-table-column prop="createdBy" label="账号创建人" show-overflow-tooltip />
                <el-table-column prop="createdTime" label="创建时间" show-overflow-tooltip />
                <el-table-column prop="lastUpdatedTime" label="最后编辑创建时间" show-overflow-tooltip min-width="120" />
                <el-table-column label="操作" align="center" width="180">
                    <template slot-scope="{row,$index}">
                        <div class="link-list">
                            <el-link type="primary" :underline="false" @click="handleEdit(row,$index)">
                                编辑
                            </el-link>
                            <el-link type="danger" :underline="false" @click="handleDel(row,$index)">
                                删除
                            </el-link>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <Pagination :pagination="pagination" @refresh="initData" />
        <Dialog :dialog="dialog" @confirm="handleConfirm" @close="handleCloseForm">
            <el-form :ref="dialog.ref" :model="dialog.form" :rules="dialog.rules" label-width="100px">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="dialog.form.roleName" placeholder="请输入角色名称" maxlength="64" />
                </el-form-item>
                <el-form-item label="描述">
                    <el-input v-model="dialog.form.remarks" placeholder="请输入描述" type="textarea" maxlength="500" />
                </el-form-item>
                <el-form-item label="角色权限" prop="menuList">
                    <!-- check-strictly -->
                    <el-tree ref="authTree" style="margin-top:4px;" :data="menuList" show-checkbox node-key="uuid" default-expand-all :default-checked-keys="dialog.form.menuList" :props="defaultProps" :check-strictly="checkStrictly" @check="handleCheck" />
                </el-form-item>
            </el-form>
        </Dialog>
    </div>
</template>

<script>
import {
    getRoleList,
    queryAllMenuBtnList,
    addRole,
    updateRole,
    queryRoleDetail,
    deleteRole
} from '@/api/system';
import { validateLength } from '@/utils/validate';
import { pageSize, pageSizes } from '@/settings';
import SearchCriteria from '@/components/SearchCriteria';
import Pagination from '@/components/Pagination';
import Dialog from '@/components/Dialog';
const baseForm = {
    roleName: '',
    remarks: '',
    menuList: []
};
export default {
    name: 'Role',
    components: {
        SearchCriteria,
        Pagination,
        Dialog
    },
    data () {
        return {
            loading: true,
            pagination: {
                // 分页信息
                page: 1,
                size: pageSize,
                pageSizes: pageSizes,
                total: 0
            },
            filter: {
                roleName: {
                    type: 'input',
                    label: '关键词',
                    value: '',
                    placeholder: '角色名称'
                },
                daterange: {
                    type: 'datePicker',
                    datePickerType: 'daterange',
                    label: '添加时间',
                    value: '',
                    startPlaceholder: '开始时间',
                    endPlaceholder: '结束时间'
                }
            },
            tableData: [],
            multipleSelection: [],
            optType: '',
            menuList: [],
            defaultProps: {
                children: 'children',
                label: (data) => {
                    return data.menuName;
                }
            },
            checkStrictly: true,
            nodes: [],
            dialog: {
                title: '',
                show: false,
                loading: true,
                ref: 'form',
                form: {},
                btnLoading: false,
                rules: {
                    roleName: [
                        {
                            required: true,
                            validator: validateLength.bind({
                                label: '角色名称',
                                minLength: 2,
                                maxLength: 64
                            }),
                            trigger: 'blur'
                        }
                    ]
                }
            }
        };
    },
    async created () {
        this.initData();
    },
    async activated () {
        this.menuList = await this._queryAllMenuBtnList();
    },
    methods: {
        /**
         * 判断当前行是否可以被选中
         */
        _computedHasSelect (row) {
            return true;
        },
        /**
         * table 选择框变化
         */
        handleSelectionChange (val) {
            this.multipleSelection = val;
            console.log(this.multipleSelection);
        },
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
            getRoleList({
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
        async handleAdd () {
            this.optType = 'add';
            this.dialog.loading = true;
            this.dialog.title = '添加角色';
            this.dialog.show = true;
            this.dialog.form = JSON.parse(JSON.stringify(baseForm));
            this.dialog.loading = false;
        },
        async handleEdit (row, index) {
            this.optType = 'edit';
            this.dialog.loading = true;
            this.dialog.show = true;
            this.dialog.form.menuList = await this._queryRoleDetail(row);
            this.$nextTick(() => {
                if (this.dialog.form.menuList.length) {
                    this.dialog.form.menuList.forEach((value) => {
                        // 真的大坑，我自己摸索好久！！！
                        this.$refs.authTree.setChecked(value, true, false); // 给树节点赋值
                    });
                }
                const form = {};
                for (const i in baseForm) {
                    if (i != 'menuList') {
                        form[i] = row[i];
                    }
                }
                form.uuid = row.uuid;
                this.dialog.form = form;
                this.dialog.loading = false;
            });
        },
        handleDel (row, index) {
            this.$syncConfirm({
                message: this.$tipsText.del,
                confirmFn: async () => {
                    return await deleteRole(row.uuid);
                },
                confirmSuccessCallback: this.initData
            });
        },
        _queryRoleDetail (row) {
            return new Promise((resolve) => {
                queryRoleDetail(row.uuid).then((res) => {
                    const { data = {} } = res;
                    const menuList = data.menuList || [];
                    let roleMenuList = [];
                    menuList.forEach((item) => {
                        roleMenuList.push(item.menuUuid);
                        roleMenuList = roleMenuList.concat(item.btnList || []);
                    });
                    resolve(roleMenuList);
                });
            });
        },
        _queryAllMenuBtnList () {
            return new Promise((resolve) => {
                queryAllMenuBtnList().then((res) => {
                    const { data } = res;
                    resolve(this._transferMenuData(data));
                });
            });
        },
        /**
         * 转换菜单数据
         */
        _transferMenuData (data) {
            digui(data);
            function digui (data = []) {
                data.forEach(function (item, index) {
                    if (item.children != null && item.children.length > 0) {
                        digui(item.children);
                    }
                    // delete item.btnList;
                    if (item.btnList && item.btnList.length) {
                        item.children = item.btnList.map((item) => {
                            return {
                                meta: {
                                    title: item.btnName
                                },
                                menuUuid: item.menuUuid,
                                btnCode: item.btnCode,
                                btnUuid: item.btnUuid,
                                uuid: item.btnUuid,
                                children: []
                            };
                        });
                    }
                });
            }
            return data;
        },
        handleCloseForm () {
            this.dialog.show = false;
            this.dialog.btnLoading = false;
            this.$refs.authTree && this.$refs.authTree.setCheckedKeys([]);
        },
        handleConfirm () {
            this._computedNodes();
            if (!this.nodes.length) {
                this.$message({
                    message: '请选择权限',
                    type: 'error'
                });
                return false;
            }
            const form = this.dialog.form;
            const roleName = form.roleName;
            const remarks = form.remarks;
            const nodes = this.nodes;
            const menuList = [];
            const pathList = nodes.filter((item) => item.menuType != '3') || [];
            if (pathList.length) {
                pathList.forEach((item) => {
                    const btnList = nodes.filter(
                        (node) => node.menuType == '3' && (node.parentUuid == item.uuid)
                    );
                    menuList.push({
                        menuUuid: item.uuid,
                        btnList: btnList.map((btn) => btn.uuid)
                    });
                });
            }
            switch (this.optType) {
                case 'add':
                    addRole({
                        roleName: roleName,
                        remarks: remarks,
                        menuList: menuList
                    }).then((res) => {
                        this.$message({
                            message: '操作成功',
                            type: 'success'
                        });
                        this.handleCloseForm();
                        this.initData();
                    }).catch((e) => {
                        this.dialog.btnLoading = false;
                    });
                    break;
                case 'edit':
                    updateRole({
                        roleName: roleName,
                        remarks: remarks,
                        menuList: menuList,
                        uuid: form.uuid
                    }).then((res) => {
                        this.$message({
                            message: '操作成功',
                            type: 'success'
                        });
                        this.handleCloseForm();
                        this.initData();
                    }).catch((e) => {
                        this.dialog.btnLoading = false;
                    });
                    break;
            }
        },
        handleCheck (currentObj, treeStatus) {
            // 用于：父子节点严格互不关联时，父节点勾选变化时通知子节点同步变化，实现单向关联。
            const selected = treeStatus.checkedKeys.indexOf(currentObj.uuid); // -1未选中
            // 选中
            if (selected !== -1) {
                // 子节点只要被选中父节点就被选中
                this.selectedParent(currentObj);
                // 统一处理子节点为相同的勾选状态
                this.uniteChildSame(currentObj, true);
            } else {
                // 未选中 处理子节点全部未选中
                if (currentObj.children.length !== 0) {
                    this.uniteChildSame(currentObj, false);
                }
            }
        },
        // 统一处理子节点为相同的勾选状态
        uniteChildSame (treeList, isSelected) {
            this.$refs.authTree.setChecked(treeList.uuid, isSelected);
            for (let i = 0; i < treeList.children.length; i++) {
                this.uniteChildSame(treeList.children[i], isSelected);
            }
        },
        // 统一处理父节点为选中
        selectedParent (currentObj) {
            const currentNode = this.$refs.authTree.getNode(currentObj);
            if (currentNode.parent.key !== undefined) {
                this.$refs.authTree.setChecked(currentNode.parent, true);
                this.selectedParent(currentNode.parent);
            }
        },
        _computedNodes () {
            const halfCheckedNodes =
                this.$refs.authTree.getHalfCheckedNodes() || [];
            const checkedNodes = this.$refs.authTree.getCheckedNodes() || [];
            this.nodes = halfCheckedNodes.concat(checkedNodes);
        }
    }
};
</script>

<style lang="scss" scoped>
</style>
