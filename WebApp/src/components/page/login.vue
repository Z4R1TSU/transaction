<template>
    <div class="login-container">
        <el-card class="box-card">
            <div class="login-body">
                <div class="login-title" @click="toIndex">二手交易平台</div>
                <el-form ref="form" :model="userForm">
                    <el-input placeholder="请输入手机号..." v-model="userForm.accountNumber" class="login-input">
                        <template slot="prepend">
                            <div class="el-icon-user-solid"></div>
                        </template>
                    </el-input>
                    <el-input placeholder="请输入密码..." v-model="userForm.userPassword" class="login-input"
                              @keyup.enter.native="login"  show-password>
                        <template slot="prepend">
                            <div class="el-icon-lock"></div>
                        </template>
                    </el-input>
                    <div class="login-submit">
                        <el-button type="primary" @click="login">登录</el-button>
                    </div>
                    <div class="other-submit">
                        <router-link to="/sign-in" class="sign-in-text">注册</router-link>
                        <router-link to="/login-admin" class="sign-in-text">后台登录</router-link>
                    </div>
                </el-form>
            </div>
        </el-card>
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
        height: 100vh;
        width: 100%;
        background: transparent;
    }

    .box-card {
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-lg);
        background: var(--card-bg);
        border: 1px solid var(--card-border);
    }

    .login-body {
        padding: 40px;
        width: 400px;
        height: 100%;
    }

    @media (max-width: 480px) {
        .login-body {
            width: 100%;
            padding: 26px 18px;
        }
    }

    .login-title {
        padding-bottom: 30px;
        text-align: center;
        font-weight: 600;
        font-size: 24px;
        color: var(--text-primary);
        cursor: pointer;
        position: relative;
    }
    .login-title::after {
        content: '';
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: -10px;
        width: 120px;
        height: 2px;
        background: linear-gradient(90deg, var(--brand), var(--accent));
        border-radius: 2px;
    }

    .login-input {
        margin-bottom: 20px;
    }

    .login-submit {
        display: flex;
        justify-content: center;
        margin-top: 10px;
    }

    .login-submit .el-button {
        width: 100%;
        padding: 12px 20px;
        font-size: 16px;
    }

    .sign-in-container {
        padding: 0 10px;
    }

    .sign-in-text {
        color: var(--brand);
        font-size: 14px;
        text-decoration: none;
        line-height:28px;
    }
    .other-submit{
        display:flex;
        justify-content: space-between;
        margin-top: 20px; /* Increased margin top */
    }
</style>
