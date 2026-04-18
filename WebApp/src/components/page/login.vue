<template>
    <div class="login-container">
        <div class="login-content">
            <div class="login-brand">
                <div class="brand-logo">
                    <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                </div>
                <div class="brand-text" @click="toIndex">二手交易平台</div>
                <p class="brand-desc">发现好物，让闲置重获新生</p>
            </div>
            
            <el-card class="box-card">
                <div class="login-body">
                    <div class="login-title">欢迎回来</div>
                    <el-form ref="form" :model="userForm">
                        <el-input placeholder="请输入手机号" v-model="userForm.accountNumber" class="login-input">
                            <template slot="prepend">
                                <i class="el-icon-mobile-phone"></i>
                            </template>
                        </el-input>
                        <el-input placeholder="请输入密码" v-model="userForm.userPassword" class="login-input"
                                  @keyup.enter.native="login"  show-password>
                            <template slot="prepend">
                                <i class="el-icon-lock"></i>
                            </template>
                        </el-input>
                        <div class="login-submit">
                            <el-button type="primary" @click="login">立即登录</el-button>
                        </div>
                        <div class="other-submit">
                            <span class="no-account">还没有账号？ <router-link to="/sign-in" class="sign-in-text">立即注册</router-link></span>
                            <router-link to="/login-admin" class="admin-text">后台管理</router-link>
                        </div>
                    </el-form>
                </div>
            </el-card>
        </div>
    </div>
</template>

<script>
    export default {
        name: "login",
        data() {
            return {
                userForm: {
                    accountNumber: '',
                    userPassword: ''
                }
            };
        },

        methods: {
            login() {
                this.$api.userLogin({
                    accountNumber: this.userForm.accountNumber,
                    userPassword: this.userForm.userPassword
                }).then(res => {
                    console.log(res);
                    if (res.status_code === 1) {
                        res.data.signInTime=res.data.signInTime.substring(0,10);
                        this.$globalData.userInfo = res.data;
                        this.$router.replace({path: '/index'});
                    } else {
                        this.$message.error(res.msg);
                    }
                });
            },
            toIndex() {
                this.$router.replace({path: '/index'});
            }
        }
    }
</script>

<style scoped>
    .login-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        width: 100%;
        background-color: var(--color-bg);
        background-image: 
            radial-gradient(at 0% 0%, hsla(253,16%,7%,0.05) 0, transparent 50%), 
            radial-gradient(at 50% 0%, hsla(225,39%,30%,0.05) 0, transparent 50%), 
            radial-gradient(at 100% 0%, hsla(339,49%,30%,0.05) 0, transparent 50%);
    }

    .login-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        max-width: 440px;
        padding: 24px;
    }

    .login-brand {
        text-align: center;
        margin-bottom: 40px;
    }

    .brand-logo {
        width: 64px;
        height: 64px;
        background: var(--color-bg-card);
        border-radius: var(--radius-lg);
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 20px;
        box-shadow: var(--shadow-md);
        color: var(--color-primary);
    }

    .brand-text {
        font-size: 32px;
        font-weight: 800;
        color: var(--color-text);
        letter-spacing: -1px;
        margin-bottom: 8px;
        cursor: pointer;
    }

    .brand-desc {
        color: var(--color-text-secondary);
        font-size: 16px;
        margin: 0;
    }

    .box-card {
        width: 100%;
        border-radius: 20px; 
        box-shadow: 0 20px 40px -10px rgba(0,0,0,0.1); 
        border: 1px solid rgba(255,255,255,0.5);
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(12px);
    }

    .login-body {
        padding: 40px; 
    }

    .login-title {
        padding-bottom: 32px;
        text-align: left;
        font-weight: 700;
        font-size: 24px; 
        color: var(--color-text); 
    }

    .login-input {
        margin-bottom: 24px; 
    }
    
    .login-input >>> .el-input__inner {
        height: 48px;
    }
    
    .login-input >>> .el-input-group__prepend {
        padding: 0 16px;
        font-size: 18px;
        color: var(--color-text-secondary);
    }

    .login-submit {
        margin-top: 32px; 
    }

    .login-submit .el-button {
        width: 100%; 
        height: 48px;
        font-size: 16px; 
    }

    .other-submit{
        display:flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 24px; 
        font-size: 14px;
    }

    .no-account {
        color: var(--color-text-secondary);
    }

    .sign-in-text, .admin-text {
        color: var(--color-primary);
        font-weight: 600;
        text-decoration: none;
        transition: color var(--transition-fast);
    }
    
    .sign-in-text:hover, .admin-text:hover {
        color: var(--color-primary-dark);
        text-decoration: underline;
    }

    .admin-text {
        color: var(--color-text-muted);
        font-weight: 500;
    }
</style>