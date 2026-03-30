<template>
    <div class="all-idle-goods">
        <el-table
            :data="idleList"
            style="width: 100%"
            v-loading="loading">
            <el-table-column prop="id" label="商品ID" width="80"></el-table-column>
            <el-table-column prop="idleName" label="商品名称" width="150"></el-table-column>
            <el-table-column label="商品图片" width="120">
                <template slot-scope="scope">
                    <el-image
                        style="width: 80px; height: 80px"
                        :src="$store.state.baseApi + scope.row.pictureList.split(',')[0]"
                        fit="cover">
                    </el-image>
                </template>
            </el-table-column>
            <el-table-column prop="idlePrice" label="价格" width="100"></el-table-column>
            <el-table-column prop="user.nickname" label="发布者" width="120"></el-table-column>
            <el-table-column label="状态" width="100">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.idleStatus === 1 ? 'success' : 'info'">
                        {{scope.row.idleStatus === 1 ? '在售' : '下架'}}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
                    <el-button 
                        size="mini" 
                        :type="scope.row.idleStatus === 1 ? 'warning' : 'success'"
                        @click="handleToggleStatus(scope.row)">
                        {{scope.row.idleStatus === 1 ? '下架' : '上架'}}
                    </el-button>
                    <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <div style="margin-top: 20px; text-align: center;">
            <el-pagination
                background
                layout="prev, pager, next"
                :current-page="page"
                :page-size="8"
                :total="total"
                @current-change="handlePageChange">
            </el-pagination>
        </div>

        <el-dialog title="编辑商品" :visible.sync="dialogVisible" width="50%">
            <el-form :model="editForm" label-width="100px">
                <el-form-item label="商品名称">
                    <el-input v-model="editForm.idleName"></el-input>
                </el-form-item>
                <el-form-item label="商品详情">
                    <el-input type="textarea" v-model="editForm.idleDetails" rows="4"></el-input>
                </el-form-item>
                <el-form-item label="价格">
                    <el-input-number v-model="editForm.idlePrice" :min="0" :precision="2"></el-input-number>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitEdit" :loading="submitLoading">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: "AllIdleGoods",
    data() {
        return {
            idleList: [],
            page: 1,
            total: 0,
            loading: false,
            dialogVisible: false,
            submitLoading: false,
            editForm: {
                id: null,
                idleName: '',
                idleDetails: '',
                idlePrice: 0
            }
        };
    },
    created() {
        this.fetchData();
    },
    methods: {
        fetchData() {
            this.loading = true;
            this.$api.getAllIdleList({ page: this.page, nums: 8 }).then(res => {
                if (res.status_code === 1) {
                    this.idleList = res.data.list;
                    this.total = res.data.count;
                } else {
                    this.$message.error(res.msg || '获取数据失败');
                }
            }).catch(() => {
                this.$message.error('网络异常');
            }).finally(() => {
                this.loading = false;
            });
        },
        handlePageChange(val) {
            this.page = val;
            this.fetchData();
        },
        handleToggleStatus(row) {
            const newStatus = row.idleStatus === 1 ? 2 : 1;
            this.$api.updateIdleStatus({ id: row.id, status: newStatus }).then(res => {
                if (res.status_code === 1) {
                    this.$message.success('状态更新成功');
                    this.fetchData();
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        handleDelete(id) {
            this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$api.deleteIdleItemByAdmin({ id }).then(res => {
                    if (res.status_code === 1) {
                        this.$message.success('删除成功');
                        this.fetchData();
                    } else {
                        this.$message.error(res.msg);
                    }
                });
            }).catch(() => {});
        },
        handleEdit(row) {
            this.editForm = {
                id: row.id,
                idleName: row.idleName,
                idleDetails: row.idleDetails,
                idlePrice: row.idlePrice
            };
            this.dialogVisible = true;
        },
        submitEdit() {
            this.submitLoading = true;
            this.$api.updateIdleItemByAdmin(this.editForm).then(res => {
                if (res.status_code === 1) {
                    this.$message.success('更新成功');
                    this.dialogVisible = false;
                    this.fetchData();
                } else {
                    this.$message.error(res.msg || '更新失败');
                }
            }).finally(() => {
                this.submitLoading = false;
            });
        }
    }
}
</script>

<style scoped>
.all-idle-goods {
    padding: 20px;
    background: #fff;
    border-radius: 4px;
}
</style>
