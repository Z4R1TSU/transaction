<template>
    <div class="banned-word-container">
        <el-card shadow="hover">
            <div slot="header" class="clearfix">
                <span>违禁词管理</span>
                <div style="float: right;">
                    <el-input 
                        v-model="newWord" 
                        placeholder="请输入违禁词" 
                        size="small" 
                        style="width: 200px; margin-right: 10px;"
                        @keyup.enter.native="handleAdd">
                    </el-input>
                    <el-button type="primary" size="small" @click="handleAdd" :loading="addLoading">添加</el-button>
                </div>
            </div>

            <el-table
                :data="wordList"
                style="width: 100%"
                v-loading="loading"
                border>
                <el-table-column prop="id" label="ID" width="100" align="center"></el-table-column>
                <el-table-column prop="word" label="违禁词内容"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="200" align="center">
                    <template slot-scope="scope">
                        {{ formatDate(scope.row.createTime) }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="150" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
export default {
    name: "BannedWordList",
    data() {
        return {
            wordList: [],
            loading: false,
            addLoading: false,
            newWord: ''
        };
    },
    created() {
        this.fetchData();
    },
    methods: {
        fetchData() {
            this.loading = true;
            this.$api.getBannedWordList().then(res => {
                if (res.status_code === 1) {
                    this.wordList = res.data;
                } else {
                    this.$message.error(res.msg || '获取列表失败');
                }
            }).finally(() => {
                this.loading = false;
            });
        },
        handleAdd() {
            if (!this.newWord.trim()) {
                this.$message.warning('违禁词不能为空');
                return;
            }
            this.addLoading = true;
            this.$api.addBannedWord({ word: this.newWord.trim() }).then(res => {
                if (res.status_code === 1) {
                    this.$message.success('添加成功');
                    this.newWord = '';
                    this.fetchData();
                } else {
                    this.$message.error(res.msg || '添加失败');
                }
            }).finally(() => {
                this.addLoading = false;
            });
        },
        handleDelete(id) {
            this.$confirm('确定要删除该违禁词吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$api.deleteBannedWord({ id }).then(res => {
                    if (res.status_code === 1) {
                        this.$message.success('删除成功');
                        this.fetchData();
                    } else {
                        this.$message.error(res.msg || '删除失败');
                    }
                });
            }).catch(() => {});
        },
        formatDate(timeStr) {
            if (!timeStr) return '';
            const date = new Date(timeStr);
            return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
        }
    }
}
</script>

<style scoped>
.banned-word-container {
    padding: 20px;
}
.clearfix:before,
.clearfix:after {
    display: table;
    content: "";
}
.clearfix:after {
    clear: both;
}
</style>
