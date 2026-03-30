<template>
    <div>
        <app-head :searchInput="searchValue"></app-head>
        <app-body>
            <div style="min-height: 85vh;">
                <div style="margin: 0 20px;padding-top: 20px;">
                    <div style="text-align: center;color: #555555;padding: 20px;" v-if="idleList.length===0">暂无匹配的闲置物品</div>
                    <el-row :gutter="30">
                        <el-col :span="6" v-for="(idle,index) in idleList">
                            <div class="idle-card" @click="toDetails(idle)">
                                <el-image
                                        style="width: 100%; height: 160px"
                                        :src="idle.imgUrl"
                                        fit="cover">
                                    <div slot="error" class="image-slot">
                                        <i class="el-icon-picture-outline">无图</i>
                                    </div>
                                </el-image>
                                <div class="idle-title">
                                    {{idle.idleName}}
                                </div>
                                <el-row style="margin: 5px 10px;">
                                    <el-col :span="12">
                                        <div class="idle-prive">￥{{idle.idlePrice}}</div>
                                    </el-col>
                                    <el-col :span="12">
                                        <div class="idle-place">{{idle.idlePlace}}</div>
                                    </el-col>
                                </el-row>
                                <div class="idle-time">{{idle.timeStr}}</div>
                                <div class="user-info">
                                    <el-image
                                            style="width: 30px; height: 30px"
                                            :src="idle.user.avatar"
                                            fit="contain">
                                        <div slot="error" class="image-slot">
                                            <i class="el-icon-picture-outline">无图</i>
                                        </div>
                                    </el-image>
                                    <div class="user-nickname">{{idle.user.nickname}}</div>
                                </div>
                            </div>
                        </el-col>
                    </el-row>
                </div>
                <div class="fenye">
                    <el-pagination
                            background
                            @current-change="handleCurrentChange"
                            :current-page.sync="currentPage"
                            :page-size="8"
                            layout="prev, pager, next, jumper"
                            :total="totalItem">
                    </el-pagination>
                </div>
            </div>
            <app-foot></app-foot>
        </app-body>
    </div>
</template>

<script>
    import AppHead from '../common/AppHeader.vue';
    import AppBody from '../common/AppPageBody.vue'
    import AppFoot from '../common/AppFoot.vue'

    export default {
        name: "search",
        components: {
            AppHead,
            AppBody,
            AppFoot
        },
        data() {
            return {
                idleList: [],
                currentPage: 1,
                searchValue: '',
                totalItem:1
            };
        },
        created() {
            this.findIdleTiem(1, this.$route.query.searchValue);
            this.searchValue = this.$route.query.searchValue;
        },
        watch: {
            $route(to, from) {
                this.searchValue = to.query.searchValue;
                this.findIdleTiem(to.query.page, to.query.searchValue);
            }
        },
        methods: {
            findIdleTiem(page, findValue) {
                this.$api.findIdleItem({
                    page: page,
                    nums: 8,
                    findValue: findValue
                }).then(res => {
                    console.log(res);
                    let list = res.data.list;
                    for (let i = 0; i < list.length; i++) {
                        list[i].timeStr = list[i].releaseTime.substring(0, 10) + " " + list[i].releaseTime.substring(11, 19);
                        let pictureList = list[i].pictureList ? JSON.parse(list[i].pictureList) : [];
                        list[i].imgUrl = pictureList.length > 0 && pictureList[0] ? (pictureList[0].startsWith('data:image') ? pictureList[0] : `data:image/jpeg;base64,${pictureList[0]}`) : '';
                    }
                    this.idleList = list;
                    this.totalItem=res.data.count;
                }).catch(e => {
                    console.log(e)
                })
            },
            handleClick(tab, event) {
                console.log(tab, event);
                console.log(this.labelName)
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.$router.replace({query: {page: val, searchValue: this.searchValue}});
            },
            toDetails(idle) {
                this.$router.push({path: '/details', query: {id: idle.id}});
            }
        }
    }
</script>

<style scoped>
    .idle-card {
        background: #fff;
        border-radius: 8px;
        margin-bottom: 20px;
        cursor: pointer;
        transition: all 0.3s ease;
        overflow: hidden;
        border: 1px solid #ebeef5;
        height: 310px;
    }
    .idle-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 16px rgba(0,0,0,0.1);
    }

    .fenye {
        display: flex;
        justify-content: center;
        height: 80px;
        align-items: center;
    }

    .idle-title {
        font-size: 16px;
        font-weight: 600;
        color: #303133;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin: 12px 10px 8px 10px;
    }

    .idle-prive {
        font-size: 18px;
        color: #ff4d4f;
        font-weight: bold;
    }

    .idle-place {
        font-size: 13px;
        color: #909399;
        float: right;
        padding-top: 4px;
    }

    .idle-time {
        color: #909399;
        font-size: 12px;
        margin: 0 10px;
    }

    .user-info {
        padding: 10px;
        display: flex;
        align-items: center;
        border-top: 1px solid #f2f6fc;
        margin-top: 8px;
    }

    .user-nickname {
        color: #606266;
        font-size: 13px;
        margin-left: 8px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
</style>