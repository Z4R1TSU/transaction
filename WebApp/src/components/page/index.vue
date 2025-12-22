<template>
    <div>
        <app-head></app-head>
        <app-body>
            <div style="min-height: 85vh;">
            <el-tabs v-model="labelName" type="card" @tab-click="handleClick">
                <el-tab-pane label="全部" name="0"></el-tab-pane>
                <el-tab-pane label="数码" name="1"></el-tab-pane>
                <el-tab-pane label="家电" name="2"></el-tab-pane>
                <el-tab-pane label="户外" name="3"></el-tab-pane>
                <el-tab-pane label="图书" name="4"></el-tab-pane>
                <el-tab-pane label="其他" name="5"></el-tab-pane>
            </el-tabs>
            <div class="hero">
                <canvas ref="particles" class="particles"></canvas>
                <div class="hero-content">
                    <h1 class="hero-title" v-reveal>发现优价好物</h1>
                    <p class="hero-subtitle" v-reveal :style="'transition-delay:120ms'">二手不二价 · 校园同城 · 安心流转</p>
                    <div class="hero-actions" v-reveal :style="'transition-delay:220ms'">
                        <el-button class="btn-glow" type="primary" icon="el-icon-search" @click="$router.push('/search')">开始探索</el-button>
                        <el-button class="btn-glow" plain icon="el-icon-plus" @click="toRelease">发布闲置</el-button>
                    </div>
                </div>
                <div class="scroll-indicator">
                    <span></span>
                </div>
            </div>
            <div style="margin: 0 20px;">
                <el-row :gutter="30">
                    <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="(idle,index) in idleList" :key="idle.id">
                        <div class="idle-card ui-card" v-reveal :style="revealDelayStyle(index)" @click="toDetails(idle)">
                            <el-image
                                    style="width: 100%; height: 180px; border-top-left-radius: var(--radius-md); border-top-right-radius: var(--radius-md);"
                                    :src="idle.imgUrl"
                                    fit="contain">
                                <div slot="error" class="image-slot">
                                    <i class="el-icon-picture-outline">无图</i>
                                </div>
                            </el-image>
                            <div class="idle-title">
                                {{idle.idleName}}
                            </div>
                            <el-row style="margin: 5px 10px;">
                                <el-col :span="12">
                                    <div class="idle-price">￥{{idle.idlePrice}}</div>
                                </el-col>
                                <el-col :span="12">
                                    <div class="idle-place">{{idle.idlePlace}}</div>
                                </el-col>
                            </el-row>
                            <div class="idle-time">{{idle.timeStr}}</div>
                            <div class="user-info">
                                <el-image
                                        style="width: 30px; height: 30px; border-radius: 12px;"
                                        :src="idle.user.avatar"
                                        fit="contain">
                                    <div slot="error" class="image-slot">
                                        <i class="el-icon-picture-outline">无图</i>
                                    </div>
                                </el-image>
                                <div class="user-nickname">{{idle.user.nickname}}</div>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </div>
            <div class="fenye">
                <el-pagination
                        background
                        @current-change="handleCurrentChange"
                        :current-page.sync="currentPage"
                        :page-size="8"
                        layout="prev, pager, next, jumper"
                        :total="totalItem">
                </el-pagination>
            </div>
            </div>
            <app-foot></app-foot>
        </app-body>
    </div>
</template>

<script>
    import AppHead from '../common/AppHeader.vue';
    import AppBody from '../common/AppPageBody.vue'
    import AppFoot from '../common/AppFoot.vue'

    export default {
        name: "index",
        components: {
            AppHead,
            AppBody,
            AppFoot
        },
        data() {
            return {
                labelName: '0',
                idleList: [],
                currentPage: 1,
                totalItem:1
            };
        },
        created() {
            this.findIdleItem(1)
        },
        mounted(){
            this.initParticles();
        },
        watch:{
            $route(to,from){
                this.labelName=to.query.labelName;
                let val=parseInt(to.query.page)?parseInt(to.query.page):1;
                // let totalPage=parseInt(this.totalItem/8)+1;
                // val=parseInt(val%totalPage);
                // val=val===0?totalPage:val;
                this.currentPage=parseInt(to.query.page)?parseInt(to.query.page):1;
                this.findIdleItem(val);
            }
        },
        methods: {
            findIdleItem(page){
                const loading = this.$loading({
                    lock: true,
                    text: '加载数据中',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0)'
                });
                if(this.labelName > 0){
                    this.$api.findIdleItemByLabel({
                        idleLabel:this.labelName,
                        page: page,
                        nums: 8
                    }).then(res => {
                        console.log(res);
                        let list = res.data.list;
                        for (let i = 0; i < list.length; i++) {
                            list[i].timeStr = list[i].releaseTime.substring(0, 10) + " " + list[i].releaseTime.substring(11, 19);
                            let pictureList = list[i].pictureList ? JSON.parse(list[i].pictureList) : [];
                            const first = pictureList[0] || '';
                            list[i].imgUrl = first.startsWith('data:image') || /^(https?:)?\/\//.test(first) || first.startsWith('blob:') ? first : (first ? `data:image/jpeg;base64,${first}` : '');
                        }
                        this.idleList = list;
                        this.totalItem=res.data.count;
                        console.log(this.totalItem);
                    }).catch(e => {
                        console.log(e)
                    }).finally(()=>{
                        loading.close();
                    })
                }else{
                    this.$api.findIdleItem({
                      page: page,
                      nums: 8,
                    }).then(res => {
                      console.log(res);
                      let list = res.data.list;
                      for (let i = 0; i < list.length; i++) {
                        list[i].timeStr = list[i].releaseTime.substring(0, 10) + " " + list[i].releaseTime.substring(11, 19);
                        let pictureList = list[i].pictureList ? JSON.parse(list[i].pictureList) : [];
                        const first = pictureList[0] || '';
                        list[i].imgUrl = first.startsWith('data:image') || /^(https?:)?\/\//.test(first) || first.startsWith('blob:') ? first : (first ? `data:image/jpeg;base64,${first}` : '');
                      }
                      this.idleList = list;
                      this.totalItem=res.data.count;
                    }).catch(e => {
                      console.log(e)
                    }).finally(()=>{
                        loading.close();
                    })
                }
            },
            handleClick(tab, event) {
                // console.log(tab,event);
                console.log(this.labelName);
                this.$router.replace({query: {page: 1,labelName:this.labelName}});
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.$router.replace({query: {page: val,labelName:this.labelName}});
            },
            toDetails(idle) {
                this.$router.push({path: '/details', query: {id: idle.id}});
            },
            toRelease(){
                this.$router.push({path: '/release'});
            },
            revealDelayStyle(i){
                const base = 60; // ms
                const col = i % 4; // 4 col grid
                const row = Math.floor(i / 4);
                const delay = (row * 4 + col) * base;
                return `transition-delay:${delay}ms`;
            },
            initParticles() {
                const canvas = this.$refs.particles;
                if (!canvas) return;
                const ctx = canvas.getContext('2d');
                
                let width, height;
                let particles = [];
                
                const resize = () => {
                    width = canvas.offsetWidth;
                    height = canvas.offsetHeight;
                    canvas.width = width * window.devicePixelRatio;
                    canvas.height = height * window.devicePixelRatio;
                    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
                    createParticles();
                };
                
                const createParticles = () => {
                    particles = [];
                    const cnt = Math.floor(width * height / 20000); // Density
                    for (let i = 0; i < cnt; i++) {
                        particles.push({
                            x: Math.random() * width,
                            y: Math.random() * height,
                            vx: (Math.random() - 0.5) * 0.4,
                            vy: (Math.random() - 0.5) * 0.4,
                            size: Math.random() * 2 + 0.5,
                            alpha: Math.random() * 0.3 + 0.1
                        });
                    }
                };
                
                const draw = () => {
                    ctx.clearRect(0, 0, width, height);
                    const brandColor = getComputedStyle(document.documentElement).getPropertyValue('--brand').trim() || '#4f46e5';
                    ctx.fillStyle = brandColor;
                    
                    particles.forEach(p => {
                        p.x += p.vx;
                        p.y += p.vy;
                        
                        if (p.x < 0) p.x = width;
                        if (p.x > width) p.x = 0;
                        if (p.y < 0) p.y = height;
                        if (p.y > height) p.y = 0;
                        
                        ctx.globalAlpha = p.alpha;
                        ctx.beginPath();
                        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                        ctx.fill();
                    });
                    
                    requestAnimationFrame(draw);
                };
                
                window.addEventListener('resize', resize);
                resize();
                draw();
            }
        }
    }
</script>

<style scoped>
    .hero {
        position: relative;
        height: 400px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        margin-bottom: 40px;
        overflow: hidden;
    }
    
    .particles {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
        pointer-events: none;
    }
    
    .hero-content {
        z-index: 1;
        position: relative;
    }
    
    .hero-title {
        font-size: 48px;
        font-weight: 800;
        margin-bottom: 16px;
        background: linear-gradient(135deg, var(--text-primary) 0%, var(--brand) 100%);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        letter-spacing: -1px;
    }
    
    .hero-subtitle {
        font-size: 18px;
        color: var(--text-secondary);
        margin-bottom: 32px;
        max-width: 600px;
    }
    
    .hero-actions {
        display: flex;
        gap: 16px;
    }
    
    .scroll-indicator {
        position: absolute;
        bottom: 20px;
        width: 24px;
        height: 40px;
        border: 2px solid var(--text-muted);
        border-radius: 12px;
        display: flex;
        justify-content: center;
        opacity: 0.5;
    }
    
    .scroll-indicator span {
        width: 4px;
        height: 8px;
        background: var(--text-muted);
        border-radius: 2px;
        margin-top: 6px;
        animation: scrollPin 2s infinite;
    }
    
    @keyframes scrollPin {
        0% { transform: translateY(0); opacity: 1; }
        100% { transform: translateY(12px); opacity: 0; }
    }

    .idle-card {
        background: var(--card-bg);
        border: 1px solid var(--card-border);
        border-radius: var(--radius-md);
        overflow: hidden;
        cursor: pointer;
        transition: all 0.3s ease;
        margin-bottom: 20px;
        position: relative;
    }
    
    .idle-card:hover {
        transform: translateY(-5px);
        box-shadow: var(--shadow-lg);
        border-color: var(--brand);
    }

    .idle-title {
        font-size: 16px;
        font-weight: 600;
        padding: 12px 12px 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: var(--text-primary);
    }

    .idle-price {
        font-size: 18px;
        color: var(--brand);
        font-weight: 700;
    }

    .idle-place {
        font-size: 12px;
        color: var(--text-muted);
        text-align: right;
        line-height: 24px;
    }

    .idle-time {
        padding: 0 12px;
        font-size: 12px;
        color: var(--text-muted);
        margin-bottom: 8px;
    }

    .user-info {
        display: flex;
        align-items: center;
        padding: 8px 12px;
        border-top: 1px solid var(--card-border);
        background: rgba(255,255,255,0.3);
    }
    
    .user-nickname {
        margin-left: 8px;
        font-size: 13px;
        color: var(--text-secondary);
    }
    
    .fenye {
        display: flex;
        justify-content: center;
        margin: 40px 0;
    }
</style>
