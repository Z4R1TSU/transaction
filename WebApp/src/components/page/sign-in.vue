<template>
    <div class="sign-in-container">
        <el-card class="box-card">
            <div class="sign-in-body">
                <div class="sign-in-title">注册</div>
                <el-input placeholder="请输入昵称..." maxlength="30"  v-model="userInfo.nickname" class="sign-in-input" clearable>
                    <template slot="prepend">
                        <div class="el-icon-user-solid"></div>
                    </template>
                </el-input>
                <el-input placeholder="请输入手机号..." maxlength="11" v-model="userInfo.accountNumber" class="sign-in-input" clearable>
                    <template slot="prepend">
                        <div class="el-icon-phone"></div>
                    </template>
                </el-input>
                <el-input placeholder="请输入密码..." show-password maxlength="16" v-model="userInfo.userPassword" class="sign-in-input" clearable>
                    <template slot="prepend">
                        <div class="el-icon-lock"></div>
                    </template>
                </el-input>
                <el-input placeholder="请再次输入密码..." show-password maxlength="16" v-model="userPassword2" @keyup.enter.native="signIn" class="sign-in-input" clearable>
                    <template slot="prepend">
                        <div class="el-icon-lock"></div>
                    </template>
                </el-input>
                <div class="sign-in-submit">
                    <el-button type="primary" @click="signIn">提交</el-button>
                </div>
                <div class="login-container">
                    <span @click="toLogin" class="login-text">登录</span>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "sign-in",
        data(){
            return{
                userPassword2:'',
                userInfo:{
                    accountNumber:'',
                    userPassword:'',
                    nickname:''
                }
            };
        },
        methods:{
            toLogin(){
                this.$router.replace({path: '/login'});
            },
            signIn(){
                console.log(this.userInfo.nickname);
                if(this.userInfo.accountNumber&&this.userInfo.userPassword&&this.userInfo.nickname){
                    if(this.userInfo.userPassword!==this.userPassword2){
                        this.$message.error('两次输入的密码不相同！');
                    }else {
                        this.$api.signIn(this.userInfo).then(res=>{
                            if(res.status_code===1){
                                this.$message({
                                    message: '注册成功！',
                                    type: 'success'
                                });
                                this.$router.replace({path: '/login'});
                            }else {
                                this.$message.error('注册失败，用户已存！');
                            }
                        }).catch(e=>{
                            console.log(e);
                            this.$message.error('注册失败，网络异常！');
                        })
                    }
                }else{
                    this.$message.error('注册信息未填写完整！');
                }
            }
        }
    }
</script>

<style scoped>
    .sign-in-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        width: 100%;
        background-color: var(--color-bg);
    }
    
    .box-card {
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-lg);
        border: 1px solid var(--color-border);
    }

    .sign-in-body {
        padding: 48px;
        width: 420px;
        height: 100%;
    }

    .sign-in-title {
        padding-bottom: 40px;
        text-align: center;
        font-weight: 700;
        font-size: 28px;
        color: var(--color-text);
        letter-spacing: -0.5px;
    }

    .sign-in-input {
        margin-bottom: 24px;
    }
    
    .sign-in-input >>> .el-input__inner {
        border-radius: 0 var(--radius-md) var(--radius-md) 0;
        transition: all var(--transition-normal);
    }
    
    .sign-in-input >>> .el-input__inner:focus {
        border-color: var(--color-primary);
    }
    
    .sign-in-input >>> .el-input-group__prepend {
        border-radius: var(--radius-md) 0 0 var(--radius-md);
        background-color: var(--color-bg);
    }
    
    .sign-in-submit{
        display: flex;
        justify-content: center;
        margin-top: 32px;
    }
    
    .sign-in-submit .el-button {
        width: 100%;
        padding: 14px 20px;
        font-size: 16px;
        font-weight: 600;
        border-radius: var(--radius-md);
        transition: all var(--transition-normal);
    }
    
    .login-container{
        margin-top: 24px;
        text-align: center;
    }
    
    .login-text{
        color: var(--color-text-secondary);
        font-size: 14px;
        cursor:pointer;
        transition: color var(--transition-normal);
    }
    
    .login-text:hover {
        color: var(--color-primary);
    }
</style>