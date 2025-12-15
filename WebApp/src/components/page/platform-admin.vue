<template>
    <div style="background-color: transparent;min-height:100vh;">
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
                                    background-color="transparent"
                                    text-color="#303133"
                                    active-text-color="#4f46e5">
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
                            </el-menu>
                        </el-col>
                    </el-aside>
                    <el-main>
                        <IdleGoods v-if="mode == 1"></IdleGoods>
                        <orderList v-if="mode == 2"></orderList>
                        <userList v-if="mode == 3"></userList>
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
    export default {
        name: "platform-admin",
        components: {
            AppFoot,
            IdleGoods,
            orderList,
            userList,
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
        height: 64px;
        background: var(--header-bg);
        backdrop-filter: var(--backdrop-blur);
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0 1px 0 var(--card-border), 0 6px 20px rgba(0,0,0,0.06);
        z-index: 1000;
        padding: 0 20px;
    }
    .app-name {
        display: flex;
        align-items: center;
        height: 100%;
    }
    .app-name a {
        color: var(--text-primary);
        font-size: 20px;
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
        width: 220px !important;
        background-color: var(--card-bg);
        box-shadow: 2px 0 6px rgba(0,21,41,.08);
        min-height: calc(100vh - 64px);
    }
    .el-menu {
        border-right: none; /* Remove default border */
    }
    .el-menu-item i {
        margin-right: 10px;
    }
    .el-main {
        padding: 20px;
        background-color: transparent;
    }
    .foot {
        text-align: center;
        padding: 15px 0;
        background-color: var(--card-bg);
        border-top: 1px solid var(--card-border);
        color: var(--text-secondary);
    }
</style>
