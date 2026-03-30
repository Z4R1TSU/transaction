<template>
    <div style="background-color: #f6f6f6;min-height:100vh;">
        <el-container>
            <el-header>
                <div class="header">
                    <div class="app-name">
                        <router-link to="/platform-admin" >后台管理</router-link>
                    </div>
                    <span class="app-title">管理员：{{admin.nickname}}</span>
                    <div  class="app-logOut">
                        <el-button style="margin-right: 100px" type="primary" @click="logout">退出登录</el-button>
                    </div>
                </div>
            </el-header>
            <el-container>
                <div class="mainBody">
                    <el-aside>
                        <el-col :span="24" >
                            <el-menu
                                    default-active="1"
                                    class="el-menu-vertical-demo"
                                    @select="handleSelect"
                                    background-color="#ffffff"
                                    text-color="#303133"
                                    active-text-color="#409EFF">
                                <el-menu-item index="1">
                                    <i class="el-icon-goods"></i>
                                    <span>闲置管理</span>
                                </el-menu-item>
                                <el-menu-item index="2">
                                    <i class="el-icon-s-goods"></i>
                                    <span slot="title">订单管理</span>
                                </el-menu-item>
                                <el-menu-item index="3" >
                                    <i class="el-icon-s-custom"></i>
                                    <span slot="title">用户管理</span>
                                </el-menu-item>
                                <el-menu-item index="4" >
                                    <i class="el-icon-menu"></i>
                                    <span slot="title">所有商品管理</span>
                                </el-menu-item>
                                <el-menu-item index="5" >
                                    <i class="el-icon-s-data"></i>
                                    <span slot="title">秒杀QPS监控</span>
                                </el-menu-item>
                                <el-menu-item index="6" >
                                    <i class="el-icon-warning"></i>
                                    <span slot="title">违禁词管理</span>
                                </el-menu-item>
                            </el-menu>
                        </el-col>
                    </el-aside>
                    <el-main>
                        <IdleGoods v-if="mode == 1"></IdleGoods>
                        <orderList v-if="mode == 2"></orderList>
                        <userList v-if="mode == 3"></userList>
                        <AllIdleGoods v-if="mode == 4"></AllIdleGoods>
                        <FlashSaleQps v-if="mode == 5"></FlashSaleQps>
                        <BannedWordList v-if="mode == 6"></BannedWordList>
                    </el-main>
                </div>
            </el-container>
        </el-container>
        <div class="foot">
            <app-foot></app-foot>
        </div>
    </div>
</template>

<script>
    import AppFoot from '../common/AppFoot.vue'
    import IdleGoods from '../common/IdleGoods.vue'
    import orderList from '../common/orderList.vue'
    import userList from '../common/userList.vue'
    import AllIdleGoods from '../common/AllIdleGoods.vue'
    import FlashSaleQps from '../common/FlashSaleQps.vue'
    import BannedWordList from '../common/BannedWordList.vue'
    export default {
        name: "platform-admin",
        components: {
            AppFoot,
            IdleGoods,
            orderList,
            userList,
            AllIdleGoods,
            FlashSaleQps,
            BannedWordList
        },
        data(){
            return {
                mode:1,
                admin:{
                    nickname:'管理员',
                },
            }
        },
        created() {
            if (!this.$sta.isLogin) {
                this.$message.error('请先登录管理员账号');
                this.$router.push('/login-admin');
                return;
            }
            this.admin.nickname=this.$sta.adminName;
        },
        methods: {
            logout(){
                this.$api.loginOut({
                }).then(res => {
                    if(res.status_code === 1){
                        this.$sta.isLogin=false;
                        this.$sta.adminName='';
                        this.$router.push({path:'/login-admin'});
                    }
                }).catch(e => {
                    console.log(e)
                })
            },
            handleSelect(val){
                if(this.mode !== val){
                    this.mode = val
                }
            },
        },
    }
</script>

<style scoped>
    .admin-layout {
        background-color: #f0f2f5; /* Consistent background */
        min-height: 100vh;
    }
    .header {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 60px; /* Consistent header height */
        background: #ffffff;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* Consistent shadow */
        z-index: 1000;
        padding: 0 20px;
    }
    .app-name {
        display: flex;
        align-items: center;
        height: 100%;
    }
    .app-name a {
        color: #303133; /* Darker text */
        font-size: 20px; /* Adjusted font size */
        font-weight: 600;
        text-decoration: none;
    }
    .admin-info {
        display: flex;
        align-items: center;
        color: #555;
    }
    .admin-info .app-title {
        margin-right: 20px;
        font-size: 16px;
    }

    .el-container.is-vertical {
        padding-top: 60px; /* Account for fixed header */
    }

    .mainBody {
        display: flex;
        width: 100%;
        padding-top: 1px; /* Fix potential overlap issue */
    }
    .el-aside {
        width: 220px !important; /* Fixed width for aside */
        background-color: #ffffff;
        box-shadow: 2px 0 6px rgba(0,21,41,.08);
        min-height: calc(100vh - 60px); /* Full height minus header */
    }
    .el-menu {
        border-right: none; /* Remove default border */
    }
    .el-menu-item i {
        margin-right: 10px;
    }
    .el-main {
        padding: 20px;
        background-color: #f0f2f5;
    }
    .foot {
        /* Removed fixed positioning for simplicity, assuming AppFoot handles its own styling */
        text-align: center;
        padding: 15px 0;
        background-color: #ffffff;
        border-top: 1px solid #e8e8e8;
        color: #888;
    }
</style>