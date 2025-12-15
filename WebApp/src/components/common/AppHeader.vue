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
                    <div style="font-size: 16px;color: var(--brand);padding-right: 5px;">{{nicknameValue?nicknameValue:nickname}}</div>
                    <el-avatar :src="avatarValue?avatarValue:avatar"></el-avatar>
                </div>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item><div @click="toMe">个人中心</div></el-dropdown-item>
                    <el-dropdown-item divided style="color: red;"><div @click="loginOut">退出登录</div></el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <theme-switch />
        </div>
    </div>
</template>
<script>
    import ThemeSwitch from './ThemeSwitch.vue'

    export default {
        name: 'Header',
        props: ['searchInput','nicknameValue','avatarValue'],
        components: { ThemeSwitch },
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
        background-color: var(--header-bg);
        backdrop-filter: var(--backdrop-blur);
        -webkit-backdrop-filter: var(--backdrop-blur);
        box-shadow: 0 1px 0 var(--card-border), 0 6px 20px rgba(0,0,0,0.06);
        display: flex;
        align-items: center;
        padding: 0 20px;
        z-index: 1000;
    }

    .header-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;
    }

    .app-name a {
        font-size: 22px;
        font-weight: 900;
        text-decoration: none;
        letter-spacing: 0.3px;
        position: relative;
    }
    .app-name a, .user-name-text { color: transparent; background: linear-gradient(90deg, #5b21b6, #8b5cf6, #a78bfa); -webkit-background-clip: text; background-clip: text; }
    .app-name a::after{
        content: '';
        position: absolute;
        left: 0; bottom: -6px;
        width: 100%; height: 2px;
        background: linear-gradient(90deg,var(--brand),var(--accent));
        transform: scaleX(0);
        transform-origin: left;
        transition: transform var(--transition) ease;
        border-radius: 2px;
    }
    .app-name a:hover::after{ transform: scaleX(1); }

    .search-container {
        flex-grow: 1;
        margin: 0 20px;
        max-width: 480px;
    }

    .search-container .el-input .el-input__inner {
        border-radius: 20px;
        background: var(--card-bg);
        border-color: var(--card-border);
    }

    .el-button {
        margin-left: 10px;
    }

    .user-name-text {
        font-size: 16px;
        color: var(--brand);
        text-decoration: none;
        margin-left: 15px;
    }

    .el-dropdown {
        margin-left: 15px;
    }

    .el-avatar {
        margin-left: 8px;
    }

    @media (max-width: 900px) {
        .header {
            height: auto;
            padding: 10px 14px;
        }
        .header-container {
            flex-wrap: wrap;
            justify-content: center;
        }
        .search-container {
            order: 3;
            width: 100%;
            max-width: 100%;
            margin: 10px 0 0;
        }
        .el-button {
            margin-left: 0;
        }
    }
</style>
