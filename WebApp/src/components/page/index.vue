<template>
    <div>
        <app-head></app-head>
        <app-body>
            <div style="min-height: 85vh;">
            
            <!-- 轮播图区域 -->
            <div class="banner-container">
                <el-carousel height="300px">
                    <el-carousel-item v-for="item in 3" :key="item" :class="'banner-item-' + item">
                        <div class="banner-content">
                            <h2>校园秒杀季 限时开启</h2>
                            <p>全场好物，底价带走</p>
                        </div>
                    </el-carousel-item>
                </el-carousel>
            </div>

            <div class="normal-section-title">全部好物</div>
            <el-tabs v-model="labelName" type="card" @tab-click="handleClick">
                <el-tab-pane label="全部" name="0"></el-tab-pane>
                <el-tab-pane label="数码" name="1"></el-tab-pane>
                <el-tab-pane label="家电" name="2"></el-tab-pane>
                <el-tab-pane label="户外" name="3"></el-tab-pane>
                <el-tab-pane label="图书" name="4"></el-tab-pane>
                <el-tab-pane label="其他" name="5"></el-tab-pane>
            </el-tabs>
            <div style="margin: 0 5px;">
                <el-row :gutter="20">
                    <el-col :span="6" v-for="(idle,index) in idleList" :key="index">
                        <div class="idle-card normal-card" @click="toDetails(idle)">
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
                                        style="width: 30px; height: 30px; border-radius: 50%;"
                                        :src="idle.user.avatar"
                                        fit="cover">
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
    import { getFirstImageSrc } from '../../utils/image'

    export default {
        name: "index",
        components: {
            AppHead,
            AppBody,
            AppFoot
        },
        data() {
            return {
                labelName: '0',
                idleList: [],
                currentPage: 1,
                totalItem:1
            };
        },
        created() {
            this.syncRouteState(this.$route);
        },
        watch:{
            $route(to,from){
                this.syncRouteState(to);
            }
        },
        methods: {
            syncRouteState(route) {
                const nextLabelName = route.query.labelName !== undefined ? String(route.query.labelName) : '0';
                const page = parseInt(route.query.page, 10);
                const nextPage = Number.isNaN(page) || page < 1 ? 1 : page;

                this.labelName = nextLabelName;
                this.currentPage = nextPage;
                this.findIdleItem(nextPage);
            },
            findIdleItem(page){
                const loading = this.$loading({
                    lock: true,
                    text: '加载数据中',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0)'
                });
                if(this.labelName > 0){
                    this.$api.findIdleItemByLabel({
                        idleLabel:this.labelName,
                        page: page,
                        nums: 8
                    }).then(res => {
                        console.log(res);
                        let list = res.data.list;
                        for (let i = 0; i < list.length; i++) {
                            list[i].timeStr = list[i].releaseTime.substring(0, 10) + " " + list[i].releaseTime.substring(11, 19);
                            list[i].imgUrl = getFirstImageSrc(list[i].pictureList);
                        }
                        this.idleList = list;
                        this.totalItem=res.data.count;
                        console.log(this.totalItem);
                    }).catch(e => {
                        console.log(e)
                    }).finally(()=>{
                        loading.close();
                    })
                }else{
                    this.$api.findIdleItem({
                      page: page,
                      nums: 8,
                    }).then(res => {
                      console.log(res);
                      let list = res.data.list;
                      for (let i = 0; i < list.length; i++) {
                        list[i].timeStr = list[i].releaseTime.substring(0, 10) + " " + list[i].releaseTime.substring(11, 19);
                        list[i].imgUrl = getFirstImageSrc(list[i].pictureList);
                      }
                      this.idleList = list;
                      this.totalItem=res.data.count;
                    }).catch(e => {
                      console.log(e)
                    }).finally(()=>{
                        loading.close();
                    })
                }
            },
            handleClick(tab, event) {
                // console.log(tab,event);
                console.log(this.labelName);
                this.$router.replace({query: {page: 1,labelName:this.labelName}});
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.$router.replace({query: {page: val,labelName:this.labelName}});
            },
            toDetails(idle) {
                this.$router.push({path: '/details', query: {id: idle.id}});
            }
        }
    }
</script>

<style scoped>
    /* Banner 样式 */
    .banner-container {
        margin: 20px 0 30px 0;
        border-radius: var(--radius-lg);
        overflow: hidden;
        box-shadow: var(--shadow-sm);
        position: relative;
    }
    .banner-item-1 { background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%); }
    .banner-item-2 { background: linear-gradient(120deg, #f6d365 0%, #fda085 100%); }
    .banner-item-3 { background: linear-gradient(120deg, #a18cd1 0%, #fbc2eb 100%); }
    .banner-content {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #fff;
        text-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .banner-content h2 {
        font-size: 42px;
        font-weight: 800;
        margin: 0 0 12px 0;
        letter-spacing: 1px;
    }
    .banner-content p {
        font-size: 20px;
        font-weight: 500;
        margin: 0;
        opacity: 0.9;
    }

    .normal-section-title {
        font-size: 24px;
        font-weight: 800;
        margin: 10px 0 20px 0;
        color: var(--text-primary);
        position: relative;
        padding-left: 16px;
    }
    .normal-section-title::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 4px;
        height: 20px;
        background: var(--primary-color);
        border-radius: 4px;
    }

    /* 卡片通用样式 */
    .idle-card {
        background: var(--surface-color);
        border-radius: var(--radius-md);
        margin-bottom: 24px;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        overflow: hidden;
        border: 1px solid var(--border-color);
        position: relative;
        display: flex;
        flex-direction: column;
    }
    .idle-card:hover {
        transform: translateY(-6px);
        box-shadow: var(--shadow-lg);
        border-color: rgba(255, 77, 79, 0.2);
    }
    
    /* 普通卡片样式 */
    .normal-card {
        height: 320px;
    }

    .fenye {
        display: flex;
        justify-content: center;
        height: 100px;
        align-items: center;
    }

    .idle-title {
        font-size: 16px;
        font-weight: 700;
        color: var(--text-primary);
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin: 16px 16px 8px;
        line-height: 1.4;
    }

    .idle-prive {
        font-size: 20px;
        color: var(--primary-color);
        font-weight: 800;
    }

    .idle-place {
        font-size: 13px;
        color: var(--text-tertiary);
        float: right;
        padding-top: 6px;
        font-weight: 500;
    }

    .idle-time {
        color: var(--text-tertiary);
        font-size: 12px;
        margin: 4px 16px;
        font-weight: 500;
    }

    .user-info {
        padding: 12px 16px;
        display: flex;
        align-items: center;
        border-top: 1px solid var(--border-color);
        margin-top: auto;
        background: #fcfcfd;
    }

    .user-nickname {
        color: var(--text-secondary);
        font-size: 13px;
        font-weight: 600;
        margin-left: 10px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
</style>
