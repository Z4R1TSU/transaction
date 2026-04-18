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
        top: 24px;
        left: 50%;
        transform: translateX(-50%);
        width: 90%;
        max-width: 1400px;
        height: 72px; 
        background-color: var(--glass-bg);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid var(--glass-border);
        border-radius: var(--radius-full);
        box-shadow: var(--shadow-lg); 
        display: flex;
        align-items: center;
        padding: 0 32px; 
        z-index: 1000;
        transition: all var(--transition-normal);
    }

    .header:hover {
        box-shadow: var(--shadow-lg), 0 0 30px rgba(99, 102, 241, 0.15);
    }

    .header-container {
        display: flex;
        align-items: center;
        justify-content: space-between; 
        width: 100%;
        margin: 0 auto; 
    }

    .app-name a {
        font-family: var(--font-heading);
        font-size: 24px; 
        font-weight: 800;
        background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-decoration: none;
        letter-spacing: -0.5px;
        transition: transform var(--transition-bounce);
        display: inline-block;
    }
    
    .app-name a:hover {
        transform: scale(1.05);
    }

    .search-container {
        flex-grow: 1; 
        margin: 0 40px; 
        max-width: 500px; 
    }

    .search-container >>> .el-input__inner {
        border-radius: var(--radius-full); 
        border: none !important;
        background-color: rgba(241, 245, 249, 0.8);
        transition: all var(--transition-bounce);
        color: var(--color-text);
        padding-left: 24px;
        height: 48px;
    }
    
    .search-container >>> .el-input__inner:focus {
        background-color: #FFFFFF;
        box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.15) !important;
        transform: translateY(-1px);
    }

    .search-container >>> .el-input-group__append {
        background-color: transparent;
        border: none;
        border-radius: 0 var(--radius-full) var(--radius-full) 0;
        position: absolute;
        right: 4px;
        top: 50%;
        transform: translateY(-50%);
        padding: 0;
    }
    
    .search-container >>> .el-button {
        width: 40px;
        height: 40px;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50% !important;
        background: var(--color-primary) !important;
        color: white !important;
        border: none !important;
        box-shadow: var(--shadow-md) !important;
        margin-left: 0;
    }

    .search-container >>> .el-button:hover {
        transform: scale(1.1) !important;
        box-shadow: var(--shadow-glow) !important;
    }

    .el-button {
        margin-left: 16px; 
    }

    .user-name-text {
        font-size: 16px;
        font-weight: 600;
        color: var(--color-text-secondary);
        text-decoration: none;
        margin-left: 24px;
        transition: all var(--transition-normal);
    }
    
    .user-name-text:hover {
        color: var(--color-primary);
    }

    .el-dropdown {
        margin-left: 24px;
    }

    .el-avatar {
        margin-left: 12px;
        border: 2px solid #fff;
        box-shadow: var(--shadow-sm);
        transition: transform var(--transition-bounce);
        cursor: pointer;
    }
    
    .el-avatar:hover {
        transform: scale(1.1) rotate(5deg);
        box-shadow: var(--shadow-md);
        border-color: var(--color-primary-light);
    }
</style>
