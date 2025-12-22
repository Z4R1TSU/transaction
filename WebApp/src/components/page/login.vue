<template>
    <div class="login-container">
        <div class="login-wrapper">
            <!-- Left Side: Visual -->
            <div class="login-visual">
                <div class="visual-content">
                    <h1 class="visual-title">Welcome Back</h1>
                    <p class="visual-desc">发现校园里的宝藏，让闲置好物继续发光。</p>
                </div>
                <div class="visual-shapes">
                    <div class="shape shape-1"></div>
                    <div class="shape shape-2"></div>
                    <div class="shape shape-3"></div>
                </div>
            </div>
            
            <!-- Right Side: Form -->
            <div class="login-form-area">
                <div class="form-card">
                    <div class="form-header">
                        <div class="app-logo" @click="toIndex">二手交易平台</div>
                        <p class="form-subtitle">登录您的账号以继续</p>
                    </div>
                    
                    <el-form ref="form" :model="userForm" class="login-form">
                        <div class="input-group">
                            <el-input 
                                placeholder="请输入手机号" 
                                v-model="userForm.accountNumber" 
                                prefix-icon="el-icon-user">
                            </el-input>
                        </div>
                        
                        <div class="input-group">
                            <el-input 
                                placeholder="请输入密码" 
                                v-model="userForm.userPassword" 
                                prefix-icon="el-icon-lock"
                                show-password
                                @keyup.enter.native="login">
                            </el-input>
                        </div>

                        <div class="form-actions">
                            <el-button type="primary" class="btn-block btn-lg" @click="login" :loading="loading">
                                立即登录
                            </el-button>
                        </div>
                        
                        <div class="form-footer">
                            <router-link to="/sign-in" class="link">注册新账号</router-link>
                            <span class="divider"></span>
                            <router-link to="/login-admin" class="link">后台登录</router-link>
                        </div>
                    </el-form>
                </div>
            </div>
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
                },
                loading: false
            };
        },

        methods: {
            login() {
                if (!this.userForm.accountNumber || !this.userForm.userPassword) {
                    this.$message.warning('请输入账号和密码');
                    return;
                }
                
                this.loading = true;
                this.$api.userLogin({
                    accountNumber: this.userForm.accountNumber,
                    userPassword: this.userForm.userPassword
                }).then(res => {
                    if (res.status_code === 1) {
                        res.data.signInTime = res.data.signInTime.substring(0,10);
                        this.$globalData.userInfo = res.data;
                        this.$message.success('登录成功');
                        this.$router.replace({path: '/index'});
                    } else {
                        this.$message.error(res.msg);
                    }
                }).catch(e => {
                    this.$message.error('登录失败，请检查网络');
                }).finally(() => {
                    this.loading = false;
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
        background-color: var(--bg);
        position: relative;
        overflow: hidden;
    }
    
    .login-wrapper {
        display: flex;
        width: 100%;
        max-width: 1000px;
        height: 600px;
        background: var(--card-bg);
        border: 1px solid var(--card-border);
        border-radius: 24px;
        box-shadow: var(--shadow-lg);
        overflow: hidden;
        backdrop-filter: var(--backdrop-blur);
        z-index: 10;
        margin: 20px;
    }

    /* Left Visual Side */
    .login-visual {
        flex: 1;
        position: relative;
        background: linear-gradient(135deg, var(--brand) 0%, var(--brand-700) 100%);
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 60px;
        overflow: hidden;
    }
    
    .visual-content {
        position: relative;
        z-index: 2;
        color: #fff;
    }
    
    .visual-title {
        font-size: 42px;
        font-weight: 800;
        margin-bottom: 20px;
        line-height: 1.1;
    }
    
    .visual-desc {
        font-size: 18px;
        opacity: 0.9;
        line-height: 1.6;
    }
    
    .visual-shapes .shape {
        position: absolute;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 50%;
    }
    
    .shape-1 {
        width: 300px;
        height: 300px;
        top: -100px;
        right: -50px;
        background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%);
    }
    
    .shape-2 {
        width: 200px;
        height: 200px;
        bottom: 50px;
        left: -50px;
        background: radial-gradient(circle, rgba(34,211,238,0.3) 0%, rgba(34,211,238,0) 70%);
    }

    /* Right Form Side */
    .login-form-area {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 40px;
        background: var(--bg-elevated);
    }
    
    .form-card {
        width: 100%;
        max-width: 360px;
    }
    
    .form-header {
        text-align: center;
        margin-bottom: 40px;
    }
    
    .app-logo {
        font-size: 24px;
        font-weight: 900;
        background: linear-gradient(90deg, var(--brand), var(--accent));
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        margin-bottom: 8px;
        cursor: pointer;
    }
    
    .form-subtitle {
        color: var(--text-secondary);
        font-size: 14px;
    }
    
    .input-group {
        margin-bottom: 20px;
    }
    
    .btn-block {
        width: 100%;
    }
    
    .btn-lg {
        padding: 12px;
        font-size: 16px;
        border-radius: var(--radius-sm);
    }
    
    .form-footer {
        margin-top: 24px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 14px;
    }
    
    .link {
        color: var(--text-secondary);
        text-decoration: none;
        transition: color 0.2s;
    }
    
    .link:hover {
        color: var(--brand);
    }
    
    .divider {
        width: 1px;
        height: 14px;
        background: var(--card-border);
        margin: 0 16px;
    }

    /* Responsive */
    @media (max-width: 768px) {
        .login-wrapper {
            flex-direction: column;
            height: auto;
            max-width: 400px;
        }
        
        .login-visual {
            padding: 40px;
            text-align: center;
        }
        
        .visual-title {
            font-size: 32px;
        }
        
        .login-form-area {
            padding: 40px 20px;
        }
    }
</style>