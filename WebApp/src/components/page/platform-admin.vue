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
        background-color: var(--color-bg);
        min-height: 100vh;
    }
    .header {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 64px;
        background: var(--color-bg-card);
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: var(--shadow-sm);
        border-bottom: 1px solid var(--color-border);
        z-index: 1000;
        padding: 0 32px;
    }
    .app-name {
        display: flex;
        align-items: center;
        height: 100%;
    }
    .app-name a {
        color: var(--color-text);
        font-size: 20px;
        font-weight: 700;
        text-decoration: none;
        letter-spacing: -0.5px;
    }
    .app-title {
        color: var(--color-text-secondary);
        font-size: 15px;
        font-weight: 500;
    }
    .el-container.is-vertical {
        padding-top: 64px;
    }
    .mainBody {
        display: flex;
        width: 100%;
    }
    .el-aside {
        width: 240px !important;
        background-color: var(--color-bg-card);
        border-right: 1px solid var(--color-border);
        min-height: calc(100vh - 64px);
    }
    .el-menu {
        border-right: none;
        background: transparent;
    }
    .el-menu-item {
        font-weight: 500;
        margin: 8px 16px;
        border-radius: var(--radius-md);
    }
    .el-menu-item.is-active {
        background-color: var(--color-bg);
    }
    .el-menu-item i {
        margin-right: 12px;
        font-size: 18px;
    }
    .el-main {
        padding: 32px;
        background-color: var(--color-bg);
    }
    .foot {
        text-align: center;
        padding: 24px 0;
        background-color: var(--color-bg-card);
        border-top: 1px solid var(--color-border);
        color: var(--color-text-secondary);
    }
</style>