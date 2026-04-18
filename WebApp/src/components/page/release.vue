<template>
    <div>
        <app-head></app-head>
        <app-body>
            <div class="release-idle-container">
                <div class="release-idle-container-title">发布闲置</div>
                <div class="release-idle-container-form">
                    <el-input placeholder="请输入闲置名称" v-model="idleItemInfo.idleName"
                              maxlength="30"
                              show-word-limit>
                    </el-input>
                    <el-input
                            class="release-idle-detiles-text"
                            type="textarea"
                            autosize
                            placeholder="请输入闲置的详细介绍..."
                            v-model="idleItemInfo.idleDetails"
                            maxlength="1000"
                            show-word-limit>
                    </el-input>
                    <div class="release-idle-place">
                        <div class="release-tip">您的地区</div>
                        <el-cascader
                                :options="options"
                                v-model="selectedOptions"
                                @change="handleChange"
                                :separator="' '"
                                style="width: 90%;"
                        >
                        </el-cascader>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <div>
                            <div class="release-tip">闲置类别</div>
                            <el-select  v-model="idleItemInfo.idleLabel" placeholder="请选择类别">
                                <el-option
                                        v-for="item in options2"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                        <div style="width: 300px;">
                            <el-input-number v-model="idleItemInfo.idlePrice" :precision="2" :step="10" :max="10000000">
                                <div slot="prepend">价格</div>
                            </el-input-number>
                        </div>

                    </div>
                    <div class="release-idle-container-picture">
                        <div class="release-idle-container-picture-title">上传闲置照片</div>
                        <el-upload
                                action="http://localhost:8040/file/upload-base64"
                                :on-preview="fileHandlePreview"
                                :on-remove="fileHandleRemove"
                                :on-success="fileHandleSuccess"
                                :show-file-list="showFileList"
                                :limit="10"
                                :on-exceed="handleExceed"
                                accept="image/*"
                                drag
                                multiple>
                            <i class="el-icon-upload"></i>
                            <div class="el-upload__text">将图片拖到此处，或<em>点击上传</em></div>
                        </el-upload>
                        <div class="picture-list">
                            <el-image style="width: 600px;margin-bottom: 2px;" fit="contain"
                                      v-for="(img,index) in imgList" :src="img"
                                      :preview-src-list="imgList"></el-image>
                        </div>
                        <el-dialog :visible.sync="imgDialogVisible">
                            <img width="100%" :src="dialogImageUrl" alt="">
                        </el-dialog>
                    </div>
                    <div style="display: flex;justify-content: center;margin-top: 30px;margin-bottom: 30px;">
                        <el-button type="primary" plain @click="releaseButton">确认发布</el-button>
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
    import options from '../common/country-data.js'

    export default {
        name: "release",
        components: {
            AppHead,
            AppBody,
            AppFoot
        },
        data() {
            return {
                imgDialogVisible:false,
                dialogImageUrl:'',
                showFileList:true,
                options:options,
                selectedOptions:[],
                options2: [{
                    value: 1,
                    label: '数码'
                }, {
                    value: 2,
                    label: '家电'
                }, {
                    value: 3,
                    label: '户外'
                }, {
                    value: 4,
                    label: '图书'
                }, {
                    value: 5,
                    label: '其他'
                }],
                imgList:[],
                idleItemInfo:{
                    idleName:'',
                    idleDetails:'',
                    pictureList:'',
                    idlePrice:0,
                    idlePlace:'',
                    idleLabel:''
                }
            };
        },
        methods: {
            handleChange(value) {
                console.log(value);
                this.idleItemInfo.idlePlace=value[1];
            },
            fileHandleRemove(file, fileList) {
                console.log(file, fileList);
                let removedUrl = file.response && file.response.status_code === 1 ? (file.response.data.startsWith('data:image') ? file.response.data : `data:image/jpeg;base64,${file.response.data}`) : file.url; // file.url might be used if it's an already uploaded image shown in the list
                if (removedUrl) {
                    const index = this.imgList.indexOf(removedUrl);
                    if (index !== -1) {
                        this.imgList.splice(index, 1);
                    }
                }
            },
            fileHandlePreview(file) {
                console.log(file);
                // file.response.data should be the base64 string
                this.dialogImageUrl = file.response && file.response.status_code === 1 ? (file.response.data.startsWith('data:image') ? file.response.data : `data:image/jpeg;base64,${file.response.data}`) : file.url;
                this.imgDialogVisible = true;
            },
            fileHandleSuccess(response, file, fileList){
                console.log("file:",response,file,fileList);
                if (response.status_code === 1 && response.data) {
                    // Assuming response.data is the Base64 string
                    // Prepend with data URI scheme if not already present
                    const base64Image = response.data.startsWith('data:image') ? response.data : `data:image/jpeg;base64,${response.data}`;
                    this.imgList.push(base64Image);
                } else {
                    this.$message.error(response.msg || '图片上传失败');
                }
            },
            releaseButton(){
                this.idleItemInfo.pictureList=JSON.stringify(this.imgList);
                console.log(this.idleItemInfo);
                if(this.idleItemInfo.idleName&&
                    this.idleItemInfo.idleDetails&&
                    this.idleItemInfo.idlePlace&&
                    this.idleItemInfo.idleLabel&&
                    this.idleItemInfo.idlePrice){
                    this.$api.addIdleItem(this.idleItemInfo).then(res=>{
                        if (res.status_code === 1) {
                            this.$message({
                                message: '发布成功！',
                                type: 'success'
                            });
                            console.log(res.data);
                            this.$router.replace({path: '/details', query: {id: res.data.id}});
                        } else {
                            this.$message.error('发布失败！'+res.msg);
                        }
                    }).catch(e=>{
                        this.$message.error('请填写完整信息');
                    })
                }else {
                    this.$message.error('请填写完整信息！');
                }

            },
            handleExceed(files, fileList) {
                this.$message.warning(`限制10张图片，本次选择了 ${files.length} 张图，共选择了 ${files.length + fileList.length} 张图`);
            },
        }
    }
</script>

<style scoped>
    .release-idle-container {
        min-height: 85vh;
        background: var(--color-bg-card);
        border-radius: 32px;
        box-shadow: var(--shadow-lg);
        border: none;
        padding-bottom: 48px;
        overflow: hidden;
    }

    .release-idle-container-title {
        font-size: 32px;
        padding: 48px 0;
        font-weight: 800;
        width: 100%;
        text-align: center;
        background: linear-gradient(135deg, var(--color-primary-light), var(--color-secondary));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        border-bottom: 1px solid var(--color-border-light);
        margin-bottom: 48px;
        letter-spacing: -1px;
    }

    .release-idle-container-form {
        padding: 0 80px;
        max-width: 900px;
        margin: 0 auto;
    }

    .release-idle-container-form >>> .el-input__inner,
    .release-idle-container-form >>> .el-textarea__inner {
        border-radius: var(--radius-md);
        border-color: var(--color-border-light);
        transition: all var(--transition-normal);
        font-family: var(--font-sans);
        background: var(--color-bg);
    }
    
    .release-idle-container-form >>> .el-input__inner:focus,
    .release-idle-container-form >>> .el-textarea__inner:focus {
        border-color: var(--color-primary);
        background: var(--color-bg-card);
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .release-idle-detiles-text {
        margin: 32px 0;
    }
    
    .release-idle-place{
        margin-bottom: 32px;
        display: flex;
        align-items: center;
        gap: 16px;
    }
    
    .release-tip{
        color: var(--color-text-secondary);
        font-weight: 600;
        font-size: 15px;
        width: 80px;
    }
    
    .release-idle-container-picture{
        margin: 40px 0;
        padding: 32px;
        background: var(--color-bg);
        border-radius: var(--radius-lg);
        border: 1px dashed var(--color-border);
    }
    
    .release-idle-container-picture-title{
        margin-bottom: 20px;
        color: var(--color-text-secondary);
        font-size: 16px;
        font-weight: 600;
    }
    
    .release-idle-container-picture >>> .el-upload-dragger {
        border-radius: var(--radius-md);
        background: var(--color-bg-card);
        border-color: var(--color-border-light);
        transition: all var(--transition-normal);
    }
    
    .release-idle-container-picture >>> .el-upload-dragger:hover {
        border-color: var(--color-primary);
        background: rgba(59, 130, 246, 0.02);
    }
    
    .picture-list {
        margin: 32px 0;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 16px;
    }
    
    .picture-list >>> .el-image {
        border-radius: var(--radius-md);
        border: 1px solid var(--color-border-light);
        box-shadow: var(--shadow-sm);
        width: 100% !important;
        height: 200px !important;
        object-fit: cover;
    }
</style>