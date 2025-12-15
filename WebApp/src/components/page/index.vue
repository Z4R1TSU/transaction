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
            initParticles(){
                const canvas = this.$refs.particles;
                if(!canvas) return;
                const ctx = canvas.getContext('2d');
                const DPR = window.devicePixelRatio || 1;
                const resize = () => {
                    const rect = canvas.getBoundingClientRect();
                    canvas.width = rect.width * DPR;
                    canvas.height = rect.height * DPR;
                };
                resize();
                window.addEventListener('resize', resize);

                const particles = Array.from({length: 36}).map(() => ({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height * .6,
                    r: 1 + Math.random() * 2 * DPR,
                    vx: (Math.random() - .5) * 0.4 * DPR,
                    vy: (Math.random() - .5) * 0.4 * DPR,
                    c: `rgba(${180+Math.floor(Math.random()*40)}, ${160+Math.floor(Math.random()*60)}, 255, ${0.25+Math.random()*0.35})`
                }));

                const step = () => {
                    ctx.clearRect(0,0,canvas.width,canvas.height);
                    for(const p of particles){
                        p.x += p.vx; p.y += p.vy;
                        if(p.x<0||p.x>canvas.width) p.vx*=-1;
                        if(p.y<0||p.y>canvas.height) p.vy*=-1;
                        ctx.beginPath();
                        const g = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*4);
                        g.addColorStop(0,p.c);
                        g.addColorStop(1,'transparent');
                        ctx.fillStyle = g;
                        ctx.arc(p.x,p.y,p.r*4,0,Math.PI*2);
                        ctx.fill();
                    }
                    requestAnimationFrame(step);
                };
                step();
            }
        }
    }
</script>

<style scoped>
    .hero{
        position: relative;
        height: 260px;
        margin: 10px 20px 20px 20px;
        background: radial-gradient(800px 300px at 20% 0%, rgba(124,108,255,0.20), transparent 60%),
                    radial-gradient(600px 260px at 100% 0%, rgba(34,211,238,0.20), transparent 55%),
                    var(--card-bg);
        border: 1px solid var(--card-border);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-sm);
        overflow: hidden;
    }
    .hero-content{
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 12px;
        text-align: center;
    }
    .hero-title{
        font-size: 34px;
        font-weight: 900;
        margin: 0;
        background: linear-gradient(90deg, #5b21b6, #8b5cf6, #a78bfa);
        -webkit-background-clip: text; background-clip: text; color: transparent;
        text-shadow: 0 6px 24px rgba(139,92,246,.25);
    }
    .hero-subtitle{
        margin: 0;
        color: var(--text-secondary);
    }
    .hero-actions{ margin-top: 8px; }

    .scroll-indicator{
        position: absolute; left: 50%; transform: translateX(-50%); bottom: 12px;
        width: 22px; height: 36px; border-radius: 12px; border: 2px solid var(--card-border);
        display: flex; justify-content: center; align-items: flex-start; padding-top: 6px;
        opacity: .7;
    }
    .scroll-indicator span{ width: 4px; height: 8px; background: var(--text-secondary); border-radius: 2px; animation: scrolly 1.6s ease-in-out infinite; }
    @keyframes scrolly { 0%{ transform: translateY(0); opacity: .8;} 70%{ transform: translateY(14px); opacity: .2;} 100%{ transform: translateY(0); opacity: .8;} }

    .idle-card {
        height: 340px;
        margin-bottom: 20px;
        cursor: pointer;
        overflow: hidden;
        position: relative;
        transition: transform var(--transition) ease, box-shadow var(--transition) ease;
    }
    .idle-card:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow-md);
    }

    .fenye {
        display: flex;
        justify-content: center;
        height: 60px;
        align-items: center;
    }

    .idle-title {
        font-size: 16px;
        font-weight: 600;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin: 12px 12px 6px 12px;
    }

    .idle-price {
        font-size: 18px;
        color: var(--brand);
        font-weight: 700;
    }

    .idle-place {
        font-size: 12px;
        color: var(--text-secondary);
        float: right;
        padding-right: 20px;

    }

    .idle-time {
        color: var(--text-muted);
        font-size: 12px;
        margin: 0 12px;
    }

    .user-nickname {
        color: var(--text-muted);
        font-size: 12px;
        display: flex;
        align-items: center;
        height: 30px;
        padding-left: 8px;
    }

    .user-info {
        padding: 8px 12px 12px 12px;
        height: 30px;
        display: flex;
    }
</style>
