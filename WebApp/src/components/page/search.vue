<template>
    <div>
        <app-head :searchInput="searchValue"></app-head>
        <app-body>
            <div style="min-height: 85vh;">
                <div style="margin: 0 20px;padding-top: 20px;">
                    <div style="text-align: center;color: #555555;padding: 20px;" v-if="idleList.length===0">暂无匹配的闲置物品</div>
                    <el-row :gutter="30">
                    <el-col :span="6" v-for="(idle,index) in idleList" :key="idle.id">
                    <div class="idle-card ui-card" v-reveal :style="revealDelayStyle(index)" @click="toDetails(idle)">
                                <el-image
                                    style="width: 100%; height: 180px; border-top-left-radius: var(--radius-md); border-top-right-radius: var(--radius-md);"
                                        :src="idle.imgUrl"
                                        fit="contain">
                                    <div slot="error" class="image-slot">
                                        <i class="el-icon-picture-outline">无图</i>
                                    </div>
                                </el-image>
                                <div class="idle-title">
                                    {{idle.idleName}}
                                </div>
                                <el-row style="margin: 5px 10px;">
                                <el-col :span="12">
                                    <div class="idle-price">￥{{idle.idlePrice}}</div>
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
                        const first = pictureList[0] || '';
                        list[i].imgUrl = first.startsWith('data:image') || /^(https?:)?\/\//.test(first) || first.startsWith('blob:') ? first : (first ? `data:image/jpeg;base64,${first}` : '');
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
            },
            revealDelayStyle(i){
                const base = 60; // ms
                const col = i % 4; // 4 col grid
                const row = Math.floor(i / 4);
                const delay = (row * 4 + col) * base;
                return `transition-delay:${delay}ms`;
            }
        }
    }
</script>

<style scoped>
    .idle-card {
        height: 340px;
        margin-bottom: 20px;
        cursor: pointer;
        overflow: hidden;
        position: relative;
        transition: transform var(--transition) ease, box-shadow var(--transition) ease;
    }
    .idle-card:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow-md);
    }

    .fenye {
        display: flex;
        justify-content: center;
        height: 60px;
        align-items: center;
    }

    .idle-title {
        font-size: 16px;
        font-weight: 600;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin: 12px 12px 6px 12px;
    }

    .idle-price {
        font-size: 18px;
        color: var(--brand);
        font-weight: 700;
    }

    .idle-place {
        font-size: 12px;
        color: var(--text-secondary);
        float: right;
        padding-right: 20px;

    }

    .idle-time {
        color: var(--text-muted);
        font-size: 12px;
        margin: 0 12px;
    }

    .user-nickname {
        color: var(--text-muted);
        font-size: 12px;
        display: flex;
        align-items: center;
        height: 30px;
        padding-left: 8px;
    }

    .user-info {
        padding: 8px 12px 12px 12px;
        height: 30px;
        display: flex;
    }
</style>