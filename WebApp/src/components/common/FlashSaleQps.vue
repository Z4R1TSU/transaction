<template>
    <div class="qps-container">
        <el-card shadow="hover">
            <div slot="header" class="clearfix">
                <span>秒杀活动实时QPS监控</span>
                <el-button style="float: right; padding: 3px 0" type="text" @click="fetchData">手动刷新</el-button>
            </div>
            <div ref="qpsChart" style="width: 100%; height: 400px;" v-loading="loading"></div>
        </el-card>
    </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
    name: "FlashSaleQps",
    data() {
        return {
            chart: null,
            loading: false,
            timer: null
        };
    },
    mounted() {
        this.initChart();
        this.fetchData();
        // 模拟实时刷新
        this.timer = setInterval(() => {
            this.fetchData();
        }, 5000);
    },
    beforeDestroy() {
        if (this.chart) {
            this.chart.dispose();
        }
        if (this.timer) {
            clearInterval(this.timer);
        }
    },
    methods: {
        initChart() {
            this.chart = echarts.init(this.$refs.qpsChart);
            const option = {
                title: { text: '实时 QPS (Queries Per Second)' },
                tooltip: {
                    trigger: 'axis',
                    formatter: function (params) {
                        return params[0].name + '<br/>QPS: ' + params[0].value;
                    }
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: []
                },
                yAxis: {
                    type: 'value',
                    name: 'QPS'
                },
                series: [{
                    name: 'QPS',
                    type: 'line',
                    smooth: true,
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(64, 158, 255, 0.5)'
                        }, {
                            offset: 1,
                            color: 'rgba(64, 158, 255, 0.1)'
                        }])
                    },
                    itemStyle: {
                        color: '#409EFF'
                    },
                    data: []
                }]
            };
            this.chart.setOption(option);
            window.addEventListener('resize', () => {
                this.chart.resize();
            });
        },
        fetchData() {
            this.loading = true;
            this.$api.getFlashSaleQps().then(res => {
                if (res.status_code === 1) {
                    const data = res.data;
                    const times = data.map(item => {
                        const date = new Date(item.time);
                        return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
                    });
                    const values = data.map(item => item.qps);
                    
                    this.chart.setOption({
                        xAxis: { data: times },
                        series: [{ data: values }]
                    });
                } else {
                    this.$message.error('获取QPS数据失败');
                }
            }).finally(() => {
                this.loading = false;
            });
        }
    }
}
</script>

<style scoped>
.qps-container {
    padding: 20px;
}
</style>
