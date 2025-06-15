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
                    accountNumber: '17322611234',
                    userPassword: '123456'
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
        background: linear-gradient(to right, #74ebd5, #ACB6E5); /* Modern gradient background */
    }

    .box-card {
        border-radius: 15px; /* Rounded corners for the card */
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); /* Softer shadow */
    }

    .login-body {
        padding: 40px; /* Increased padding */
        width: 400px;
        height: 100%;
    }

    .login-title {
        padding-bottom: 30px;
        text-align: center;
        font-weight: 600;
        font-size: 24px; /* Slightly larger title */
        color: #303133; /* Darker color for better contrast */
        cursor: pointer;
    }

    .login-input {
        margin-bottom: 25px; /* Increased margin */
    }

    .login-submit {
        display: flex;
        justify-content: center;
        margin-top: 10px; /* Added margin top */
    }

    .login-submit .el-button {
        width: 100%; /* Full width button */
        padding: 12px 20px; /* Larger button padding */
        font-size: 16px; /* Larger button font size */
    }

    .sign-in-container {
        padding: 0 10px;
    }

    .sign-in-text {
        color: #409EFF;
        font-size: 14px; /* Adjusted font size */
        text-decoration: none;
        line-height:28px;
    }
    .other-submit{
        display:flex;
        justify-content: space-between;
        margin-top: 20px; /* Increased margin top */
    }
</style>