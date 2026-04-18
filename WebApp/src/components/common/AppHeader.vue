<template>
    <div class="header">
        <div class="header-container">
            <div class="app-name">
                <router-link to="/">二手交易平台</router-link>
            </div>
            <div class="search-container">
                <el-input placeholder="搜闲置..." v-model="searchValue" @keyup.enter.native="searchIdle">
                    <el-button slot="append" icon="el-icon-search" @click="searchIdle"></el-button>
                </el-input>
            </div>
            <el-button type="primary" icon="el-icon-plus"  @click="toRelease">发布闲置</el-button>
            <el-button type="primary" icon="el-icon-chat-dot-round" @click="toMessage">消息</el-button>
            <router-link v-if="!isLogin" class="user-name-text" to="/login">登录</router-link>
            <el-dropdown trigger="click" v-else>
                <div style="cursor:pointer;display: flex;align-items: center;">
                    <div style="font-size: 16px;color: #409EFF;padding-right: 5px;">{{nicknameValue?nicknameValue:nickname}}</div>
                    <el-avatar :src="avatarValue?avatarValue:avatar"></el-avatar>
                </div>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item><div @click="toMe">个人中心</div></el-dropdown-item>
                    <el-dropdown-item divided style="color: red;"><div @click="loginOut">退出登录</div></el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>
<script>

    export default {
        name: 'Header',
        props: ['searchInput','nicknameValue','avatarValue'],
        data() {
            return {
                searchValue: this.searchInput,
                nickname:'登录',
                avatar:'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
                isLogin:false
            };
        },
        created(){
            // console.log("header");
            if(! this.$globalData.userInfo.nickname){
                this.$api.getUserInfo().then(res=>{
                    console.log('Header getUserInfo:',res);
                    if(res.status_code===1){
                        this.nickname=res.data.nickname;
                        this.avatar=res.data.avatar;
                        res.data.signInTime=res.data.signInTime.substring(0,10);
                        this.$globalData.userInfo=res.data;
                        this.isLogin=true;
                    }
                })
            }else {
                this.nickname=this.$globalData.userInfo.nickname;
                this.avatar=this.$globalData.userInfo.avatar;
                this.isLogin=true;
            }
        },
        methods: {
            searchIdle() {
                if ('/search' !== this.$route.path) {
                    this.$router.push({path: '/search', query: {searchValue: this.searchValue}});
                } else {
                    this.$router.replace({path: '/search', query: {searchValue: this.searchValue}});
                    this.$router.go(0);
                }

            },
            toMe() {
                if ('/me' !== this.$route.path) {
                    this.$router.push({path: '/me'});
                }
            },
            toMessage(){
                if ('/message' !== this.$route.path) {
                    this.$router.push({path: '/message'});
                }
            },
            toRelease(){
                if ('/release' !== this.$route.path) {
                    this.$router.push({path: '/release'});
                }
            },
            loginOut(){
                this.$api.logout().then(res=>{
                    if(res.status_code===1){
                        this.$globalData.userInfo={};
                        console.log("login out");
                        if ('/index' === this.$route.path) {
                            this.$router.go(0);
                        }else {
                            this.$router.push({path: '/index'});
                        }
                    }else {
                        this.$message.error('网络或系统异常，退出登录失败！');
                    }
                });

            }
        }
    };
</script>
<style scoped>
    .header {
        position: fixed;
        top: 16px;
        left: 16px;
        right: 16px;
        width: auto;
        height: 64px; 
        background-color: rgba(255, 255, 255, 0.85);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-sm); 
        display: flex;
        align-items: center;
        padding: 0 24px; 
        z-index: 1000;
        transition: all var(--transition-normal);
    }

    .header-container {
        display: flex;
        align-items: center;
        justify-content: space-between; 
        width: 100%;
        max-width: 1280px; 
        margin: 0 auto; 
    }

    .app-name a {
        font-size: 20px; 
        font-weight: 700;
        color: var(--color-text);
        text-decoration: none;
        letter-spacing: -0.5px;
    }

    .search-container {
        flex-grow: 1; 
        margin: 0 24px; 
        max-width: 480px; 
    }

    .search-container >>> .el-input__inner {
        border-radius: var(--radius-md); 
        border: 1px solid var(--color-border);
        background-color: var(--color-bg);
        transition: all var(--transition-normal);
        color: var(--color-text);
    }
    
    .search-container >>> .el-input__inner:focus {
        border-color: var(--color-primary);
        background-color: var(--color-bg-card);
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
    }

    .search-container >>> .el-input-group__append {
        background-color: transparent;
        border: 1px solid var(--color-border);
        border-left: 0;
        border-radius: 0 var(--radius-md) var(--radius-md) 0;
    }

    .el-button {
        margin-left: 12px; 
        border-radius: var(--radius-md);
        font-weight: 500;
        transition: all var(--transition-normal);
    }

    .user-name-text {
        font-size: 15px;
        font-weight: 500;
        color: var(--color-text-secondary);
        text-decoration: none;
        margin-left: 20px;
        transition: color var(--transition-normal);
    }
    
    .user-name-text:hover {
        color: var(--color-primary);
    }

    .el-dropdown {
        margin-left: 20px;
    }

    .el-avatar {
        margin-left: 10px;
        border: 1px solid var(--color-border);
    }
</style>
