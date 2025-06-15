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
        top: 0;
        left: 0;
        right: 0;
        width: 100%;
        height: 60px; /* Slightly increased height */
        background-color: #ffffff; /* White background */
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08); /* Softer shadow */
        display: flex;
        align-items: center;
        padding: 0 20px; /* Added horizontal padding */
        z-index: 1000;
    }

    .header-container {
        display: flex;
        align-items: center;
        justify-content: space-between; /* Distribute space */
        width: 100%;
        max-width: 1200px; /* Max width for content */
        margin: 0 auto; /* Center content */
    }

    .app-name a {
        font-size: 22px; /* Larger app name */
        font-weight: bold;
        color: #303133;
        text-decoration: none;
    }

    .search-container {
        flex-grow: 1; /* Allow search to take available space */
        margin: 0 20px; /* Add margin around search */
        max-width: 400px; /* Max width for search */
    }

    .search-container .el-input .el-input__inner {
        border-radius: 20px; /* Rounded search input */
    }

    .el-button {
        margin-left: 10px; /* Space between buttons */
    }

    .user-name-text {
        font-size: 16px;
        color: #409EFF;
        text-decoration: none;
        margin-left: 15px;
    }

    .el-dropdown {
        margin-left: 15px;
    }

    .el-avatar {
        margin-left: 8px;
    }
</style>
