<template>
    <div>
        <app-head></app-head>
        <app-body>
            <div class="idle-details-container">
                <div class="details-header">
                    <div class="details-header-user-info">
                        <el-image
                                style="width: 80px; height: 80px;border-radius: 5px;"
                                :src="idleItemInfo.user.avatar"
                                fit="contain"></el-image>
                        <div style="margin-left: 10px;">
                            <div class="details-header-user-info-nickname">{{idleItemInfo.user.nickname}}</div>
                            <div class="details-header-user-info-time">{{idleItemInfo.user.signInTime.substring(0,10)}} 加入平台</div>
                        </div>
                    </div>
                    <div class="details-header-buy" :style="'width:'+(isMaster?'150px;':'320px;')">
                        <div style="color: #ff4d4f;font-size: 24px;font-weight: bold;margin-bottom: 5px;">￥{{idleItemInfo.idlePrice}} <span style="font-size: 14px; color: #909399; text-decoration: line-through; font-weight: normal;">￥{{(idleItemInfo.idlePrice * 1.5).toFixed(0)}}</span></div>
                        <div v-if="!isMaster&&idleItemInfo.idleStatus!==1" style="color: #909399;font-size: 16px;">闲置已下架或被抢光</div>
                        <el-button v-if="!isMaster&&idleItemInfo.idleStatus===1" type="danger" style="width: 140px; font-weight: bold; font-size: 16px;" @click="buyButton(idleItemInfo)">⚡ 立即秒杀</el-button>
                        <el-button v-if="!isMaster&&idleItemInfo.idleStatus===1" type="warning" plain @click="favoriteButton(idleItemInfo)">{{isFavorite?'取消收藏':'⭐ 收藏'}}</el-button>
                        <el-button v-if="isMaster&&idleItemInfo.idleStatus===1" type="danger" @click="changeStatus(idleItemInfo,2)" plain>下架</el-button>
                        <el-button v-if="isMaster&&idleItemInfo.idleStatus===2" type="primary" @click="changeStatus(idleItemInfo,1)" plain>重新上架</el-button>
                    </div>
                </div>

                <div class="details-info">
                    <div class="details-info-title">{{idleItemInfo.idleName}}</div>
                    <div class="details-info-main" v-html="idleItemInfo.idleDetails">
                        {{idleItemInfo.idleDetails}}
                    </div>
                    <div class="details-picture">
                        <el-image v-for="(imgUrl,i) in idleItemInfo.pictureList"
                                  style="width: 90%;margin-bottom: 2px;"
                                  :src="imgUrl"
                                  fit="contain"></el-image>
                    </div>
                </div>

                <div class="message-container" id="replyMessageLocation">
                    <div class="message-title">全部留言</div>
                    <div class="message-send">
                        <div v-if="isReply" style="padding-bottom: 10px;">
                            <el-button type="info" @click="cancelReply">回复：{{replyData.toMessage}} @{{replyData.toUserNickname}} <i class="el-icon-close el-icon--right"></i></el-button>
                        </div>
                        <el-input
                                type="textarea"
                                autosize
                                placeholder="留言提问..."
                                v-model="messageContent"
                                maxlength="200"
                                show-word-limit>
                        </el-input>
                        <div class="message-send-button">
                            <el-button plain @click="sendMessage">发送留言</el-button>
                        </div>
                    </div>
                    <div>
                        <div v-for="(mes,index) in messageList" class="message-container-list">
                            <div class="message-container-list-left">
                                <el-image
                                        style="width: 55px; height: 55px;border-radius: 5px;"
                                        :src="mes.fromU.avatar"
                                        fit="contain"></el-image>
                                <div class="message-container-list-text">
                                    <div class="message-nickname">{{mes.fromU.nickname}}
                                        {{mes.toU.nickname?' @'+mes.toU.nickname+'：'+
                                        mes.toM.content.substring(0,10)+
                                        (mes.toM.content.length>10?'...':''):''}}</div>
                                    <div class="message-content" v-html="mes.content">{{mes.content}}</div>
                                    <div class="message-time">{{mes.createTime}}</div>
                                </div>
                            </div>
                            <div class="message-container-list-right">
                                <el-button style="float: right;"  plain @click="replyMessage(index)">回复</el-button>
                            </div>
                        </div>
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
        name: "idle-details",
        components: {
            AppHead,
            AppBody,
            AppFoot
        },
        data() {
            return {
                messageContent:'',
                toUser:null,
                toMessage:null,
                isReply:false,
                replyData:{
                    toUserNickname:'',
                    toMessage:''
                },
                messageList:[],
                idleItemInfo:{
                    id:'',
                    idleName:'',
                    idleDetails:'',
                    pictureList:[],
                    idlePrice:0,
                    idlePlace:'',
                    idleLabel:'',
                    idleStatus:-1,
                    userId:'',
                    user:{
                        avatar:'',
                        nickname:'',
                        signInTime:''
                    },
                },
                isMaster:false,
                isFavorite:true,
                favoriteId:0
            };
        },
        created(){
            let id=this.$route.query.id;
            this.$api.getIdleItem({
                id:id
            }).then(res=>{
                console.log(res);
                if(res.data){
                    let list=res.data.idleDetails.split(/\r?\n/);
                    let str='';
                    for(let i=0;i<list.length;i++){
                        str+='<p>'+list[i]+'</p>';
                    }
                    res.data.idleDetails=str;
                    let pictureListData = res.data.pictureList ? JSON.parse(res.data.pictureList) : [];
                    res.data.pictureList = pictureListData.map(base64Str => 
                        base64Str && base64Str.startsWith('data:image') ? base64Str : `data:image/jpeg;base64,${base64Str}`
                    );
                    this.idleItemInfo=res.data;
                    console.log(this.idleItemInfo);
                    let userId=this.getCookie('shUserId');
                    console.log('userid',userId)
                    if(userId == this.idleItemInfo.userId){
                        console.log('isMaster');
                        this.isMaster=true;
                    }
                    this.checkFavorite();
                    this.getAllIdleMessage();
                }
                $('html,body').animate({
                    scrollTop: 0
                }, {duration: 500, easing: "swing"});
            });
        },
        methods: {
            getAllIdleMessage(){
                this.$api.getAllIdleMessage({
                    idleId:this.idleItemInfo.id
                }).then(res=>{
                    console.log('getAllIdleMessage',res.data);
                    if(res.status_code===1){
                        this.messageList=res.data;
                    }
                }).catch(()=>{
                })
            },
            checkFavorite(){
                this.$api.checkFavorite({
                    idleId:this.idleItemInfo.id
                }).then(res=>{
                    if(!res.data){
                        this.isFavorite=false;
                    }else {
                        this.favoriteId=res.data;
                    }
                })
            },
            getCookie(cname){
                var name = cname + "=";
                var ca = document.cookie.split(';');
                for(var i=0; i<ca.length; i++)
                {
                    var c = ca[i].trim();
                    if (c.indexOf(name)===0) return c.substring(name.length,c.length);
                }
                return "";
            },
            replyMessage(index){
                $('html,body').animate({
                    scrollTop: $("#replyMessageLocation").offset().top-600
                }, {duration: 500, easing: "swing"});
                this.isReply=true;
                this.replyData.toUserNickname=this.messageList[index].fromU.nickname;
                this.replyData.toMessage=this.messageList[index].content.substring(0,10)+(this.messageList[index].content.length>10?'...':'');
                this.toUser=this.messageList[index].userId;
                this.toMessage=this.messageList[index].id;
            },
            changeStatus(idle,status){
                this.$api.updateIdleItem({
                    id:idle.id,
                    idleStatus:status
                }).then(res=>{
                    console.log(res);
                    if(res.status_code===1){
                        this.idleItemInfo.idleStatus=status;
                    }else {
                        this.$message.error(res.msg)
                    }
                });
            },
            buyButton(idleItemInfo){
                this.$api.addOrder({
                    idleId:idleItemInfo.id,
                    orderPrice:idleItemInfo.idlePrice,
                }).then(res=>{
                    console.log(res);
                    if(res.status_code===1){
                        this.$router.push({path: '/order', query: {id: res.data.id}});
                    }else {
                        this.$message.error(res.msg)
                    }
                }).catch(e=>{

                })
            },
            favoriteButton(idleItemInfo){
                if(this.isFavorite){
                    this.$api.deleteFavorite({
                        id: this.favoriteId
                    }).then(res=>{
                        console.log(res);
                        if(res.status_code===1){
                            this.$message({
                                message: '已取消收藏！',
                                type: 'success'
                            });
                            this.isFavorite=false;
                        }else {
                            this.$message.error(res.msg)
                        }
                    }).catch(e=>{
                    })
                }else {
                    this.$api.addFavorite({
                        idleId:idleItemInfo.id
                    }).then(res=>{
                        console.log(res);
                        if(res.status_code===1){
                            this.$message({
                                message: '已收藏！',
                                type: 'success'
                            });
                            this.isFavorite=true;
                            this.favoriteId=res.data;
                        }else {
                            this.$message.error(res.msg)
                        }
                    }).catch(e=>{
                    })
                }
            },
            cancelReply(){
                this.isReply=false;
                this.toUser=this.idleItemInfo.userId;
                this.toMessage=null;
                this.replyData.toUserNickname='';
                this.replyData.toMessage='';
            },
            sendMessage(){
                let content=this.messageContent.trim();
                if(this.toUser==null){
                    this.toUser=this.idleItemInfo.userId;
                }
                if(content){
                    let contentList=content.split(/\r?\n/);
                    let contenHtml=contentList[0];
                    for(let i=1;i<contentList.length;i++){
                        contenHtml+='<br>'+contentList[i];
                    }
                    this.$api.sendMessage({
                        idleId:this.idleItemInfo.id,
                        content:contenHtml,
                        toUser:this.toUser,
                        toMessage:this.toMessage
                    }).then(res=>{
                        if(res.status_code===1){
                            this.$message({
                                message: '留言成功！',
                                type: 'success'
                            });
                            this.messageContent='';
                            this.cancelReply();
                            this.getAllIdleMessage();
                        }else {
                            this.$message.error("留言失败！"+res.msg);
                        }
                    }).catch(()=>{
                        this.$message.error("留言失败！");
                    });

                }else{
                    this.$message.error("留言为空！");
                }
            }
        },
    }
</script>

<style scoped>
    .idle-details-container {
        min-height: 85vh;
        background-color: var(--surface-color);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-md);
        margin: 24px 0;
        overflow: hidden;
        border: 1px solid var(--border-color);
    }

    .details-header {
        height: auto;
        border-bottom: 1px solid var(--border-color);
        background: linear-gradient(135deg, rgba(255, 77, 79, 0.05), rgba(255, 255, 255, 0));
        display: flex;
        justify-content: space-between;
        padding: 32px 40px;
        align-items: center;
    }

    .details-header-user-info {
        display: flex;
        align-items: center;
    }

    .details-header-user-info-nickname {
        font-weight: 800;
        font-size: 22px;
        color: var(--text-primary);
        margin-bottom: 6px;
        letter-spacing: 0.5px;
    }

    .details-header-user-info-time {
        font-size: 14px;
        color: var(--text-tertiary);
        font-weight: 500;
    }

    .details-header-buy {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        background: rgba(255, 255, 255, 0.8);
        padding: 20px;
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-sm);
        border: 1px solid rgba(255, 77, 79, 0.1);
    }
    
    .details-header-buy .el-button {
        margin-top: 16px;
        margin-left: 0;
        width: 160px;
        height: 44px;
        font-size: 16px;
    }
    
    .details-header-buy > div {
        display: flex;
        justify-content: space-between;
        width: 100%;
        gap: 16px;
    }

    .details-info {
        padding: 40px;
    }

    .details-info-title {
        font-size: 28px;
        font-weight: 800;
        color: var(--text-primary);
        margin-bottom: 24px;
        line-height: 1.4;
        position: relative;
        padding-bottom: 16px;
    }
    .details-info-title::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 60px;
        height: 4px;
        background: var(--primary-color);
        border-radius: 2px;
    }

    .details-info-main {
        font-size: 16px;
        color: var(--text-secondary);
        line-height: 1.8;
        margin-bottom: 40px;
        white-space: pre-wrap;
        background: #fcfcfd;
        padding: 24px;
        border-radius: var(--radius-md);
        border: 1px solid var(--border-color);
    }

    .details-picture {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 24px;
    }
    
    .details-picture .el-image {
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-md);
        border: 1px solid var(--border-color);
    }

    .message-container {
        padding: 0 40px 40px 40px;
    }

    .message-title {
        font-size: 22px;
        font-weight: 800;
        color: var(--text-primary);
        margin-bottom: 24px;
        border-left: 4px solid var(--primary-color);
        padding-left: 12px;
        display: flex;
        align-items: center;
    }

    .message-send {
        margin-bottom: 40px;
        background: var(--bg-color);
        padding: 24px;
        border-radius: var(--radius-md);
        border: 1px solid var(--border-color);
    }

    .message-send-button {
        margin-top: 16px;
        display: flex;
        justify-content: flex-end;
    }

    .message-container-list {
        display: flex;
        justify-content: space-between;
        padding: 24px 0;
        border-bottom: 1px solid var(--border-color);
        transition: background-color 0.3s;
    }
    .message-container-list:hover {
        background-color: #fcfcfd;
    }
    .message-container-list:last-child {
        border-bottom: none;
    }

    .message-container-list-left {
        display: flex;
        flex: 1;
    }

    .message-container-list-text {
        margin-left: 20px;
        flex: 1;
    }

    .message-nickname {
        font-weight: 700;
        color: var(--secondary-color);
        font-size: 16px;
        margin-bottom: 8px;
    }

    .message-content {
        color: var(--text-primary);
        font-size: 15px;
        line-height: 1.6;
        margin-bottom: 12px;
    }

    .message-time {
        font-size: 13px;
        color: var(--text-tertiary);
        font-weight: 500;
    }
    
    .message-container-list-right {
        margin-left: 24px;
    }
</style>