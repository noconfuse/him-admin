export default {
    computed: {
        checkStsClass () {
            return (row, field, arrField) => {
                const arr = arrField ? this[arrField] : this[field];
                const res = arr.find(item => item.uuid == row[field]) || {};
                return res.type || '';
            };
        }
    },
    methods: {
        formatterVal (row, field, arrField, lable) {
            let str = '';
            try {
                const arr = arrField ? this[arrField] : this[field];
                const itemData = arr.find(item => item.uuid == row[field]);
                str = itemData && (lable ? itemData[lable] : itemData.lableDesc);
            } catch (error) {
                console.log(error);
            }
            return str;
        },
        _scrollValidateEl (object) {
            let split = '';
            for (const i in object) {
                let dom = this.$refs[i];
                if (Object.prototype.toString.call(dom) !== '[object Object]') {
                    dom = dom[0];
                    split = dom.prop;
                    const index = split.indexOf('.');
                    const last = split.lastIndexOf('.');
                    this.activeName = Number(split.slice(index + 1, last));
                    break;
                }
                dom.$el.scrollIntoView({
                    block: 'center', // 值有start,center,end，nearest，当前显示在视图区域中间
                    behavior: 'smooth' // 值有auto、instant,smooth，缓动动画（当前是慢速的）
                });
            }
        },
        _transformDataToPic (obj, field) {
            obj[field] ? (obj[field] = [{ url: obj[field], name: obj[field] }]) : (obj[field] = []);
        },
        _transformPicToData (obj, field) {
            obj[field].length ? (obj[field] = obj[field][0].url) : (obj[field] = '');
        },
        _editorChange (event, field) {
            this.form[field] = event;
        },
        /**
         * 抽离字典数据 => 返回新的数据
         */
        _pullOffDict (dict) {
            let newDict = [];
            if (dict && dict.length) {
                newDict = dict.map((item) => {
                    return {
                        lableDesc: item.lableValue,
                        uuid: item.lableCode
                    };
                });
            }
            return this._unique(newDict);
        },
        /**
         * 对象数组去重
         * @param {数组} arr
         * @returns
         */
        _unique (arr) {
            return [...new Set(arr.map(e => JSON.stringify(e)))].map(e => JSON.parse(e));
        },
        /**
         *
         * @param {文件名称} name
         * @param {文件流} res
         */
        _exportFile (promise, params = {}, name, fileType) {
            return new Promise((resolve, reject) => {
                const exportLoading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                promise(params).then((res) => {
                    if (res) {
                        const fileName = name + (fileType || '.xlsx');
                        if ('download' in document.createElement('a')) { // 非IE下载
                            const blob = new Blob([res], { type: 'application/ms-excel' });
                            const elink = document.createElement('a');
                            elink.download = fileName;
                            elink.style.display = 'none';
                            elink.href = URL.createObjectURL(blob);
                            document.body.appendChild(elink);
                            elink.click();
                            URL.revokeObjectURL(elink.href); // 释放URL 对象
                            document.body.removeChild(elink);
                        }
                    }
                    exportLoading.close();
                    resolve();
                }).catch((e) => {
                    exportLoading.close();
                    console.log(e);
                });
            });
        },
        /**
         * 清空table 选择
         */
        handleClearSelection () {
            this.$refs.multipleTable && this.$refs.multipleTable.clearSelection();
        },
        /**
         * 返回
         */
        handleBack () {
            this.$router.go(-1);
        },
        /**
         * 解析搜索参数
         */
        _parseFilter () {
            const obj = {};
            if (this.filter && JSON.stringify(this.filter) != '{}') {
                const keys = Object.keys(this.filter);
                keys.forEach((elem) => {
                    obj[elem] = this.filter[elem].value;
                });
            }
            return obj;
        },
        /**
         * 验证批量操作
         */
        _verifyBatchCheck () {
            const multipleSelection = this.multipleSelection;
            if (!multipleSelection.length) {
                this.$message({
                    type: 'warning',
                    message: '请选择要操作的数据!'
                });
                return false;
            }
            return true;
        },
        /**
         * 包装筛选项选择框数据
         * @param {*} arr
         */
        _packingOptions (arr) {
            return [{ lableDesc: '全部', uuid: '' }, ...arr];
        },
        // 条件式权限校验 v-if
        _batchPermission (value) {
            const btnPermission = this.$store.getters && this.$store.getters.btnPermission;
            const btnList = value || [];
            const intersect = btnPermission.filter(elem => btnList.includes(elem));
            const hasPermission = !!intersect.length;
            return hasPermission;
        }
    }
};
