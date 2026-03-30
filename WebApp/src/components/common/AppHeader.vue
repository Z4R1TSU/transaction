<template>
    <div class="header">
        <div class="header-container">
            <div class="app-name">
                <router-link to="/">二手交易秒杀平台<span class="flash-text">⚡</span></router-link>
            </div>
            <div class="search-container">
                <el-input placeholder="搜闲置, 抢好货..." v-model="searchValue" @keyup.enter.native="searchIdle" class="flash-search">
                    <el-button slot="append" icon="el-icon-search" @click="searchIdle"></el-button>
                </el-input>
            </div>
            <el-button type="danger" icon="el-icon-plus" round @click="toRelease" class="release-btn">发布闲置</el-button>
            <el-button type="warning" icon="el-icon-chat-dot-round" round @click="toMessage">消息</el-button>
            <router-link v-if="!isLogin" class="user-name-text" to="/login">登录/注册</router-link>
            <el-dropdown trigger="click" v-else class="user-dropdown">
                <div style="cursor:pointer;display: flex;align-items: center;">
                    <div class="user-nickname-display">{{nicknameValue?nicknameValue:nickname}}</div>
                    <el-avatar :src="avatarValue?avatarValue:avatar" size="medium"></el-avatar>
                </div>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item><div @click="toMe"><i class="el-icon-user"></i> 个人中心</div></el-dropdown-item>
                    <el-dropdown-item divided style="color: #ff4d4f;"><div @click="loginOut"><i class="el-icon-switch-button"></i> 退出登录</div></el-dropdown-item>
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
        top: 0;
        left: 0;
        right: 0;
        width: 100%;
        height: 64px;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 248, 246, 0.85) 100%);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        box-shadow: 0 4px 24px rgba(255, 77, 79, 0.06);
        border-bottom: 1px solid rgba(255, 77, 79, 0.1);
        display: flex;
        align-items: center;
        z-index: 1000;
        transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    }

    .header-container {
        display: flex;
        align-items: center;
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 24px;
        box-sizing: border-box;
    }

    .app-name a {
        font-size: 22px;
        font-weight: 800;
        color: var(--primary-color);
        text-decoration: none;
        display: flex;
        align-items: center;
        letter-spacing: 0.5px;
    }
    
    .flash-text {
        font-size: 20px;
        margin-left: 4px;
        color: var(--secondary-color);
        filter: drop-shadow(0 2px 4px rgba(250, 173, 20, 0.3));
    }

    .search-container {
        flex: 1;
        margin: 0 48px;
        max-width: 480px;
    }

    .flash-search /deep/ .el-input-group__append {
        background-color: var(--primary-color);
        color: white;
        border: 1px solid var(--primary-color);
        border-radius: 0 20px 20px 0;
        transition: all 0.3s;
    }
    .flash-search /deep/ .el-input-group__append:hover {
        background-color: var(--primary-hover);
        border-color: var(--primary-hover);
    }
    .flash-search /deep/ .el-input__inner {
        border: 2px solid transparent;
        background: rgba(0, 0, 0, 0.03);
        border-right: none;
        border-radius: 20px 0 0 20px;
        padding-left: 20px;
        height: 40px;
        line-height: 40px;
        transition: all 0.3s ease;
    }
    .flash-search /deep/ .el-input__inner:focus {
        background: #ffffff;
        border-color: rgba(255, 77, 79, 0.4);
        box-shadow: 0 4px 12px rgba(255, 77, 79, 0.08) !important;
    }

    .release-btn {
        box-shadow: 0 4px 12px rgba(255, 77, 79, 0.25) !important;
        padding: 10px 20px !important;
    }

    .el-button {
        margin-left: 16px;
    }

    .user-name-text {
        font-size: 15px;
        font-weight: 600;
        color: var(--text-secondary);
        text-decoration: none;
        margin-left: 24px;
        padding: 8px 16px;
        border-radius: 20px;
        transition: all 0.3s;
        background: transparent;
    }
    .user-name-text:hover {
        color: var(--primary-color);
        background: rgba(255, 77, 79, 0.1);
    }

    .user-dropdown {
        margin-left: 24px;
        padding: 4px 8px;
        border-radius: 24px;
        transition: all 0.3s;
    }
    .user-dropdown:hover {
        background: rgba(0, 0, 0, 0.05);
    }
    
    .user-nickname-display {
        font-size: 15px;
        color: var(--text-primary);
        font-weight: 600;
        padding-right: 12px;
        transition: color 0.2s;
    }

    .el-avatar {
        border: 2px solid var(--surface-color);
        box-shadow: var(--shadow-sm);
    }
</style>
