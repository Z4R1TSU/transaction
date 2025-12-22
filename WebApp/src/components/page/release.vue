<template>
    <div>
        <app-head></app-head>
        <app-body>
            <div class="release-idle-container">
                <div class="release-header">
                    <h1 class="release-title" v-reveal>发布闲置</h1>
                    <p class="release-subtitle" v-reveal :style="'transition-delay:100ms'">让您的闲置物品找到新主人</p>
                </div>
                
                <div class="release-card ui-card" v-reveal :style="'transition-delay:200ms'">
                    <div class="form-section">
                        <div class="section-title">基本信息</div>
                        <el-input placeholder="请输入闲置名称 (30字以内)" v-model="idleItemInfo.idleName"
                                  maxlength="30"
                                  show-word-limit
                                  class="input-clean">
                        </el-input>
                        <el-input
                                class="release-idle-detiles-text input-clean"
                                type="textarea"
                                :rows="6"
                                placeholder="请输入闲置的详细介绍、入手渠道、转手原因等..."
                                v-model="idleItemInfo.idleDetails"
                                maxlength="1000"
                                show-word-limit>
                        </el-input>
                    </div>

                    <div class="form-section">
                        <div class="section-title">交易信息</div>
                        <div class="form-grid">
                            <div class="form-item">
                                <div class="release-tip">所在地区</div>
                                <el-cascader
                                        :options="options"
                                        v-model="selectedOptions"
                                        @change="handleChange"
                                        :separator="' / '"
                                        style="width: 100%;">
                                </el-cascader>
                            </div>
                            <div class="form-item">
                                <div class="release-tip">闲置类别</div>
                                <el-select v-model="idleItemInfo.idleLabel" placeholder="请选择类别" style="width: 100%;">
                                    <el-option
                                            v-for="item in options2"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </div>
                            <div class="form-item">
                                <div class="release-tip">转手价格</div>
                                <el-input-number v-model="idleItemInfo.idlePrice" :precision="2" :step="10" :max="10000000" :min="0.01" style="width: 100%;"></el-input-number>
                            </div>
                            <div class="form-item">
                                <div class="release-tip">数量</div>
                                <el-input-number v-model="idleItemInfo.idleStock" :step="1" :min="1" :max="9999" style="width: 100%;"></el-input-number>
                            </div>
                        </div>
                    </div>

                    <div class="form-section">
                        <div class="section-title">图片展示</div>
                        <div class="upload-area">
                            <el-upload
                                    class="image-uploader"
                                    action="http://localhost:8040/file/upload-base64"
                                    :on-preview="fileHandlePreview"
                                    :on-remove="fileHandleRemove"
                                    :on-success="fileHandleSuccess"
                                    :show-file-list="false"
                                    :limit="10"
                                    :on-exceed="handleExceed"
                                    accept="image/*"
                                    drag
                                    multiple>
                                <i class="el-icon-cloud-upload"></i>
                                <div class="el-upload__text">拖拽图片到此处，或<em>点击上传</em></div>
                                <div class="el-upload__tip" slot="tip">支持 jpg/png 文件，不超过 500kb，最多 10 张</div>
                            </el-upload>
                            
                            <div class="url-input-wrapper">
                                <el-input v-model="imageUrl" placeholder="粘贴图片 URL" class="input-clean">
                                    <el-button slot="append" icon="el-icon-plus" @click="addUrlImage"></el-button>
                                </el-input>
                            </div>
                        </div>

                        <transition-group name="list" tag="div" class="picture-list">
                            <div class="picture-item" v-for="(img,index) in imgList" :key="img">
                                <el-image 
                                    style="width: 100%; height: 100%;" 
                                    fit="cover"
                                    :src="img"
                                    :preview-src-list="imgList">
                                </el-image>
                                <div class="picture-overlay">
                                    <div class="picture-remove" @click="removeImage(index)">
                                        <i class="el-icon-delete"></i>
                                    </div>
                                </div>
                            </div>
                        </transition-group>
                    </div>

                    <div class="form-actions">
                        <el-button type="primary" class="submit-btn" @click="releaseButton">确认发布</el-button>
                    </div>
                </div>
            </div>
            <el-dialog :visible.sync="imgDialogVisible" custom-class="preview-dialog">
                <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
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
                imageUrl:'',
                idleItemInfo:{
                    idleName:'',
                    idleDetails:'',
                    pictureList:'',
                    idlePrice:0,
                    idleStock:1,
                    idlePlace:'',
                    idleLabel:''
                }
            };
        },
        methods: {
            addUrlImage(){
                const url = (this.imageUrl || '').trim();
                if(!url) return;
                const isUrl = /^(https?:)?\/\//.test(url) || url.startsWith('blob:');
                if(!isUrl){
                    this.$message.error('请输入有效的图片 URL');
                    return;
                }
                if(this.imgList.length >= 10){
                    this.$message.warning('最多上传 10 张图片');
                    return;
                }
                this.imgList.push(url);
                this.imageUrl='';
            },
            removeImage(index){
                if(index>=0 && index < this.imgList.length){
                    this.imgList.splice(index,1);
                }
            },
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
                    this.idleItemInfo.idlePrice&&
                    this.idleItemInfo.idleStock){
                    if(this.idleItemInfo.idleStock <= 0){
                        this.$message.error('商品数量必须大于 0');
                        return;
                    }
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
        max-width: 1000px;
        margin: 0 auto;
        padding: 40px 20px;
    }

    .release-header {
        text-align: center;
        margin-bottom: 40px;
    }

    .release-title {
        font-size: 32px;
        font-weight: 800;
        color: var(--text-primary);
        margin-bottom: 8px;
    }

    .release-subtitle {
        color: var(--text-secondary);
        font-size: 16px;
    }

    .release-card {
        padding: 40px;
        background: var(--card-bg);
        border: 1px solid var(--card-border);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-md);
        backdrop-filter: var(--backdrop-blur);
    }

    .form-section {
        margin-bottom: 40px;
        padding-bottom: 30px;
        border-bottom: 1px dashed var(--card-border);
    }
    
    .form-section:last-child {
        border-bottom: none;
        margin-bottom: 0;
        padding-bottom: 0;
    }

    .section-title {
        font-size: 18px;
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: 24px;
        padding-left: 12px;
        border-left: 4px solid var(--brand);
    }

    .input-clean /deep/ .el-input__inner,
    .input-clean /deep/ .el-textarea__inner {
        background: var(--bg-elevated);
        border: 1px solid transparent;
        transition: all 0.3s ease;
    }
    
    .input-clean /deep/ .el-input__inner:focus,
    .input-clean /deep/ .el-textarea__inner:focus {
        background: var(--card-bg);
        border-color: var(--brand);
        box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
    }

    .release-idle-detiles-text {
        margin-top: 20px;
    }

    .form-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 24px;
    }

    .release-tip {
        font-size: 14px;
        color: var(--text-secondary);
        margin-bottom: 8px;
        font-weight: 500;
    }

    .upload-area {
        background: var(--bg-elevated);
        padding: 24px;
        border-radius: var(--radius-md);
        text-align: center;
        margin-bottom: 20px;
    }
    
    .image-uploader /deep/ .el-upload-dragger {
        width: 100%;
        background: var(--card-bg);
        border-color: var(--card-border);
    }
    
    .url-input-wrapper {
        margin-top: 16px;
        max-width: 500px;
        margin-left: auto;
        margin-right: auto;
    }

    .picture-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        gap: 16px;
        margin-top: 20px;
    }

    .picture-item {
        position: relative;
        aspect-ratio: 1;
        border-radius: var(--radius-md);
        overflow: hidden;
        border: 1px solid var(--card-border);
        background: #fff;
    }
    
    .picture-overlay {
        position: absolute;
        inset: 0;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.2s;
    }
    
    .picture-item:hover .picture-overlay {
        opacity: 1;
    }
    
    .picture-remove {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: #fff;
        color: #ef4444;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 18px;
    }

    .form-actions {
        display: flex;
        justify-content: center;
        margin-top: 40px;
    }
    
    .submit-btn {
        width: 200px;
        height: 48px;
        font-size: 16px;
        border-radius: 24px;
    }

    @media (max-width: 768px) {
        .release-idle-container {
            padding: 20px 14px;
        }
        
        .release-card {
            padding: 20px;
        }
        
        .form-grid {
            grid-template-columns: 1fr;
        }
    }
</style>
