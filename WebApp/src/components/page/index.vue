<template>
    <div>
        <app-head></app-head>
        <app-body>
            <div style="min-height: 85vh;">
                <div class="category-bar">
                    <div
                        v-for="(cat, idx) in categories"
                        :key="idx"
                        :class="['category-chip', { active: labelName === String(idx) }]"
                        @click="switchCategory(String(idx))"
                    >
                        <svg v-if="idx === 0" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                        <svg v-if="idx === 1" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>
                        <svg v-if="idx === 2" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>
                        <svg v-if="idx === 3" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"></polygon><line x1="12" y1="22" x2="12" y2="15.5"></line><polyline points="22 8.5 12 15.5 2 8.5"></polyline></svg>
                        <svg v-if="idx === 4" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                        <svg v-if="idx === 5" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                        <span>{{ cat }}</span>
                    </div>
                </div>
                <div class="goods-grid">
                    <div
                        v-for="(idle, index) in idleList"
                        :key="idle.id || index"
                        class="goods-card"
                        @click="toDetails(idle)"
                    >
                        <div class="card-image-wrapper">
                            <el-image
                                style="width: 100%; height: 180px"
                                :src="idle.imgUrl"
                                fit="cover">
                                <div slot="error" class="image-error">
                                    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                                </div>
                            </el-image>
                        </div>
                        <div class="card-body">
                            <div class="card-title">{{ idle.idleName }}</div>
                            <div class="card-meta">
                                <span class="card-price">¥{{ idle.idlePrice }}</span>
                                <span class="card-place">{{ idle.idlePlace }}</span>
                            </div>
                            <div class="card-footer">
                                <div class="card-user">
                                    <el-image
                                        style="width: 24px; height: 24px; border-radius: 50%;"
                                        :src="idle.user.avatar"
                                        fit="cover">
                                        <div slot="error" class="image-slot">
                                            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                        </div>
                                    </el-image>
                                    <span class="card-username">{{ idle.user.nickname }}</span>
                                </div>
                                <span class="card-time">{{ idle.timeStr }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="pagination-bar">
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
                categories: ['全部', '数码', '家电', '户外', '图书', '其他'],
                labelName: '0',
                idleList: [],
                currentPage: 1,
                totalItem: 1
            };
        },
        created() {
            this.findIdleItem(1)
        },
        watch: {
            $route(to, from) {
                this.labelName = to.query.labelName;
                let val = parseInt(to.query.page) ? parseInt(to.query.page) : 1;
                this.currentPage = parseInt(to.query.page) ? parseInt(to.query.page) : 1;
                this.findIdleItem(val);
            }
        },
        methods: {
            switchCategory(name) {
                this.labelName = name;
                this.$router.replace({ query: { page: 1, labelName: this.labelName } });
            },
            findIdleItem(page) {
                const loading = this.$loading({
                    lock: true,
                    text: '加载数据中',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0)'
                });
                if (this.labelName > 0) {
                    this.$api.findIdleItemByLabel({
                        idleLabel: this.labelName,
                        page: page,
                        nums: 8
                    }).then(res => {
                        console.log(res);
                        let list = res.data.list;
                        for (let i = 0; i < list.length; i++) {
                            list[i].timeStr = list[i].releaseTime.substring(0, 10) + " " + list[i].releaseTime.substring(11, 19);
                            let pictureList = [];
                            if (list[i].pictureList) {
                                try {
                                    pictureList = JSON.parse(list[i].pictureList);
                                } catch (err) {
                                    pictureList = [list[i].pictureList];
                                }
                            }
                            list[i].imgUrl = pictureList.length > 0 && pictureList[0] ? (pictureList[0].startsWith('data:image') ? pictureList[0] : `data:image/jpeg;base64,${pictureList[0]}`) : '';
                        }
                        this.idleList = list;
                        this.totalItem = res.data.count;
                        console.log(this.totalItem);
                    }).catch(e => {
                        console.log(e)
                    }).finally(() => {
                        loading.close();
                    })
                } else {
                    this.$api.findIdleItem({
                        page: page,
                        nums: 8,
                    }).then(res => {
                        console.log(res);
                        let list = res.data.list;
                        for (let i = 0; i < list.length; i++) {
                            list[i].timeStr = list[i].releaseTime.substring(0, 10) + " " + list[i].releaseTime.substring(11, 19);
                            let pictureList = [];
                            if (list[i].pictureList) {
                                try {
                                    pictureList = JSON.parse(list[i].pictureList);
                                } catch (err) {
                                    pictureList = [list[i].pictureList];
                                }
                            }
                            list[i].imgUrl = pictureList.length > 0 && pictureList[0] ? (pictureList[0].startsWith('data:image') ? pictureList[0] : `data:image/jpeg;base64,${pictureList[0]}`) : '';
                        }
                        this.idleList = list;
                        this.totalItem = res.data.count;
                    }).catch(e => {
                        console.log(e)
                    }).finally(() => {
                        loading.close();
                    })
                }
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.$router.replace({ query: { page: val, labelName: this.labelName } });
            },
            toDetails(idle) {
                this.$router.push({ path: '/details', query: { id: idle.id } });
            }
        }
    }
</script>

<style scoped>
    .category-bar {
        display: flex;
        gap: 10px;
        padding: 4px 0 24px;
        flex-wrap: wrap;
    }

    .category-chip {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 8px 18px;
        border-radius: var(--radius-full);
        font-size: 14px;
        font-weight: 500;
        color: var(--color-text-secondary);
        background: var(--color-bg);
        border: 1.5px solid var(--color-border);
        cursor: pointer;
        transition: all var(--transition-normal);
        user-select: none;
    }

    .category-chip:hover {
        border-color: var(--color-primary-light);
        color: var(--color-primary);
        background: rgba(124, 58, 237, 0.04);
    }

    .category-chip.active {
        background: var(--color-primary);
        color: #fff;
        border-color: var(--color-primary);
        box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
    }

    .category-chip.active svg {
        stroke: #fff;
    }

    .goods-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 20px;
        padding: 0 4px;
    }

    .goods-card {
        background: var(--color-bg-card);
        border-radius: var(--radius-lg);
        overflow: hidden;
        border: 1px solid var(--color-border-light);
        cursor: pointer;
        transition: all var(--transition-normal);
    }

    .goods-card:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow-lg);
        border-color: var(--color-primary-light);
    }

    .card-image-wrapper {
        position: relative;
        overflow: hidden;
        background: var(--color-bg);
    }

    .card-image-wrapper >>> .el-image {
        transition: transform var(--transition-slow);
    }

    .goods-card:hover .card-image-wrapper >>> .el-image {
        transform: scale(1.05);
    }

    .image-error {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 180px;
        color: var(--color-text-muted);
        background: var(--color-bg);
    }

    .card-body {
        padding: 14px 16px;
    }

    .card-title {
        font-family: var(--font-heading);
        font-size: 15px;
        font-weight: 600;
        color: var(--color-text);
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin-bottom: 10px;
        line-height: 1.4;
    }

    .card-meta {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 12px;
    }

    .card-price {
        font-family: var(--font-heading);
        font-size: 18px;
        font-weight: 700;
        color: var(--color-danger);
        letter-spacing: -0.3px;
    }

    .card-place {
        font-size: 12px;
        color: var(--color-text-muted);
        background: var(--color-bg);
        padding: 3px 8px;
        border-radius: var(--radius-sm);
    }

    .card-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-top: 10px;
        border-top: 1px solid var(--color-border-light);
    }

    .card-user {
        display: flex;
        align-items: center;
        gap: 6px;
    }

    .card-username {
        font-size: 12px;
        color: var(--color-text-secondary);
        max-width: 80px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .card-time {
        font-size: 11px;
        color: var(--color-text-muted);
    }

    .pagination-bar {
        display: flex;
        justify-content: center;
        padding: 32px 0 16px;
    }

    @media (max-width: 1024px) {
        .goods-grid {
            grid-template-columns: repeat(3, 1fr);
        }
    }

    @media (max-width: 768px) {
        .goods-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
        }
    }
</style>
