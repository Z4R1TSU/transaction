<template>
    <div class="login-container">
        <el-card class="box-card">
            <div class="login-body">
                <div class="login-title">后台管理</div>
                <el-form ref="form" :model="userForm">
                    <el-input placeholder="请输入管理员账号" v-model="userForm.accountNumber" class="login-input">
                        <template slot="prepend">
                            <div class="el-icon-user-solid"></div>
                        </template>
                    </el-input>
                    <el-input placeholder="请输入管理员密码" v-model="userForm.adminPassword" class="login-input"
                              @keyup.enter.native="login"  show-password>
                        <template slot="prepend">
                            <div class="el-icon-lock"></div>
                        </template>
                    </el-input>
                    <div class="login-submit">
                        <el-button type="primary" @click="login">登录</el-button>
                    </div>
                    <div class="other-submit">
                        <router-link to="/login" class="sign-in-text">返回前台</router-link>
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
                    accountNumber: 'root',
                    adminPassword: '123456'
                }
            };
        },
        methods: {
            login() {
                this.$api.adminLogin({
                    accountNumber: this.userForm.accountNumber,
                    adminPassword: this.userForm.adminPassword
                }).then(res => {
                    console.log(res);
                    if (res.status_code === 1) {
                        console.log(res);
                        this.$sta.isLogin = true;
                        this.$sta.adminName=res.data.adminName;
                        this.$router.replace({path:'/platform-admin'});
                    } else {
                        this.$message.error('登录失败，账号或密码错误！');
                    }
                });

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
        background: var(--color-text); /* Dark background for admin login */
    }

    .box-card {
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-lg);
        border: 1px solid var(--color-border);
    }

    .login-body {
        padding: 48px;
        width: 420px;
        height: 100%;
    }

    .login-title {
        padding-bottom: 40px;
        text-align: center;
        font-weight: 700;
        font-size: 28px;
        color: var(--color-text);
        letter-spacing: -0.5px;
    }

    .login-input {
        margin-bottom: 24px;
    }
    
    .login-input >>> .el-input__inner {
        border-radius: 0 var(--radius-md) var(--radius-md) 0;
        transition: all var(--transition-normal);
    }
    
    .login-input >>> .el-input__inner:focus {
        border-color: var(--color-primary);
    }
    
    .login-input >>> .el-input-group__prepend {
        border-radius: var(--radius-md) 0 0 var(--radius-md);
        background-color: var(--color-bg);
    }

    .login-submit {
        display: flex;
        justify-content: center;
        margin-top: 32px;
    }

    .login-submit .el-button {
        width: 100%;
        padding: 14px 20px;
        font-size: 16px;
        font-weight: 600;
        border-radius: var(--radius-md);
        transition: all var(--transition-normal);
    }

    .sign-in-text {
        color: var(--color-text-secondary);
        font-size: 14px;
        text-decoration: none;
        line-height:28px;
        transition: color var(--transition-normal);
    }
    
    .sign-in-text:hover {
        color: var(--color-primary);
    }
    
    .other-submit{
        display:flex;
        justify-content: space-between;
        margin-top: 24px;
    }
</style>