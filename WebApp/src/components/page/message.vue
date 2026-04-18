<template>
    <div>
        <app-head></app-head>
        <app-body>
            <div class="message-container">
                <div class="message-container-title">我的消息</div>
                <div v-for="(mes,index) in meslist" class="message-container-list" @click="toDetails(mes.idle.id)">
                    <div class="message-container-list-left">
                        <el-image
                                style="width: 55px; height: 55px;border-radius: 5px;"
                                :src="mes.fromU.avatar"
                                fit="cover"></el-image>
                        <div class="message-container-list-text">
                            <div class="message-nickname">{{mes.fromU.nickname}}</div>
                            <div class="message-content">{{mes.content}}</div>
                            <div class="message-time">{{mes.createTime}}</div>
                        </div>
                    </div>
                    <div class="message-container-list-right">
                        <el-image
                                style="width:130px; height: 90px;"
                                :src="mes.idle.imgUrl"
                                fit="contain"></el-image>
                    </div>
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
        name: "message",
        components: {
            AppHead,
            AppBody,
            AppFoot
        },
        data(){
            return{
                meslist:[]
            };
        },
        created(){
            this.$api.getAllMyMessage().then(res=>{
                console.log(res);
                if(res.status_code===1){
                    for(let i=0;i<res.data.length;i++){
                        let imgList = [];
                        if (res.data[i].idle.pictureList) {
                            try {
                                imgList = JSON.parse(res.data[i].idle.pictureList);
                            } catch (err) {
                                imgList = [res.data[i].idle.pictureList];
                            }
                        }
                        res.data[i].idle.imgUrl = imgList.length > 0 && imgList[0] ? (imgList[0].startsWith('data:image') ? imgList[0] : `data:image/jpeg;base64,${imgList[0]}`) : '';
                        let contentList=res.data[i].content.split('<br>');
                        let contenHtml=contentList[0];
                        for(let i=1;i<contentList.length;i++){
                            contenHtml+='  '+contentList[i];
                        }
                        res.data[i].content=contenHtml;
                    }
                    this.meslist=res.data;
                }
            })
        },
        methods:{
            toDetails(id){
                this.$router.push({path: '/details',query:{id:id}});
            }
        }
    }
</script>

<style scoped>
    .message-container{
        min-height: 85vh;
        padding: 20px 40px;
        background: var(--color-bg-card);
        border-radius: var(--radius-lg);
    }
    .message-container-title{
        font-size: 20px;
        padding: 0 0 24px 0;
        font-weight: 700;
        color: var(--color-text);
        border-bottom: 1px solid var(--color-border);
    }
    .message-container-list{
        cursor:pointer;
        padding: 24px 0;
        border-bottom: 1px solid var(--color-border-light);
        display: flex;
        justify-content: space-between;
        align-items: center;
        transition: background-color var(--transition-normal);
    }
    .message-container-list:hover {
        background-color: var(--color-bg);
        border-radius: var(--radius-md);
        padding: 24px 16px;
        margin: 0 -16px;
    }
    .message-container-list-left{
        flex: 1;
        display: flex;
        gap: 16px;
        min-width: 0;
    }
    .message-container-list-left >>> .el-image {
        border-radius: var(--radius-full) !important;
        border: 1px solid var(--color-border-light);
        flex-shrink: 0;
    }
    .message-container-list-right{
        width: 140px;
        flex-shrink: 0;
        margin-left: 24px;
    }
    .message-container-list-right >>> .el-image {
        border-radius: var(--radius-md);
        border: 1px solid var(--color-border-light);
    }
    .message-container-list-text{
        flex: 1;
        min-width: 0;
    }
    .message-nickname{
        font-weight: 600;
        font-size: 16px;
        padding-bottom: 8px;
        color: var(--color-text);
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .message-content{
        font-size: 15px;
        padding-bottom: 12px;
        color: var(--color-text-secondary);
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        line-height: 1.5;
    }
    .message-time{
        font-size: 13px;
        color: var(--color-text-muted);
    }
</style>