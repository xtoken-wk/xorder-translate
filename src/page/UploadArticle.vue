<template>
  <div class="main">
    <div class="head">
      <div class="back" @click="back()">
        <img src="static/img/register_back.png">
        文章列表
      </div>
    </div>
    <div class="property">
      <div class="property-key">标题：</div>
      <input class="property-value" v-model="title"/>
    </div>
    <div class="property" style="margin-top: 20px">
      <div class="property-key">截止时间：</div>
      <el-date-picker style="border-radius: 0px;" v-model="endTime" type="date" value-format="timestamp" placeholder="选择日期"></el-date-picker>
    </div>
    <div class="demand">
      <div class="demand-key">翻译需求：</div>
      <textarea class="demand-value" v-model="demand"></textarea>
    </div>
    <div class="property" style="align-items: flex-start">
      <div class="property-key" style="margin-top: 3px">文章上传：</div>
      <el-upload class="upload-article"
                 ref="upload"
                 :action="uploadFileDir"
                 :auto-upload="false"
                 :multiple="false"
                 :on-preview="handlePreview"
                 :on-remove="handleRemove"
                 :on-success="handleSuccess"
                 :on-error="handleError"
                 :limit="1"
                 :headers="uploadHeader"
                 :data="uploadData"
                 :on-exceed="handleExceed">
        <button class="select">点击上传</button>
      </el-upload>
    </div>
    <button class="submit" @click="upload" v-loading.fullscreen.lock="loading">提 交</button>
  </div>
</template>

<script type="text/ecmascript-6">
    import ElUpload from "../../node_modules/element-ui/packages/upload/src/index.vue";
    import httpUtil from '../assets/js/httpUtils'

    export default {
      components: {ElUpload},
      data:function () {
        return{
          title:'',
          demand:'',
          endTime:'',
          uploadUrl:'',
          uploadHeader:{token:sessionStorage.getItem('token'),source:'web'},
          uploadData:{textType:'flow',fileType:'file'},
          loading:false,
          uploadFileDir:''
        }
      },
      mounted: function () {
        this.uploadFileDir=httpUtil.URLS.uploadFileDir;
      },
      methods:{
        handlePreview:function () {
          httpUtil.showlog('preview')
        },
        handleRemove:function () {
          httpUtil.showlog('remove')
        },
        handleExceed:function () {
          httpUtil.showlog('exceed')
        },
        handleSuccess:function (res) {
          httpUtil.showlog(res)
          this.uploadUrl=res.result.path;
          this.submit();
        },
        handleError:function () {
          httpUtil.showlog("error")
          this.$message.error('文件上传出错，请重新上传')
        },
        upload:function () {
          if(this.title){
            this.uploadData.ext=this.title;
          }else{
            this.$message.warning('请输入文章标题')
            return
          }
          if (this.endTime){
            if(!this.getDate()){
              this.$message.warning('不能选择过去的日期')
              return
            }
          }else {
            this.$message.warning('请选择截止日期')
          }
          this.$refs.upload.submit();
        },
        getDate:function () {
          var nowTime=new Date().getTime();
          return this.endTime>nowTime;
        },
        submit:function () {
          this.loading=true;
          var content=this.getFormatCode(this.demand);
          var data={
            title:this.title,
            content,
            endTime:this.endTime,
            fileUrl:this.uploadUrl
          }
          httpUtil.getRequest(httpUtil.URLS.uploadArticle,data,false,(result)=>{
            this.$message.success('文章发布成功');
            this.$router.back(-1);
          },(error)=>{

          },()=>{
            this.loading = false;
          })
        },
        /*
       * 根据Value格式化为带有换行、空格格式的HTML代码
       * @param strValue {String} 需要转换的值
       * @return  {String}转换后的HTML代码
       * @example
       * getFormatCode("测\r\n\s试")  =>  “测<br/> 试”
       */
        getFormatCode: function (strValue) {
          return strValue.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\s/g, ' ');
        },
        back:function () {
          httpUtil.showlog("---------------")
          this.$router.back(-1);
        }
      }
    }
</script>
<style scoped>
  .main {
    max-width: 1000px;
    min-height: 100%;
    margin: 0 auto;
    background: #ffffff;
    box-shadow: 0 1px 8px 0 rgba(0, 0, 0, 0.10);
  }

  .head {
    display: flex;
    border-bottom: 1px solid #dddddd;
  }

  .back {
    margin: 40px 50px;
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #666666;
    cursor:pointer;
  }

  .back img {
    width: 15px;
    height: 15px;
    margin-right: 6px;
  }

  .property {
    display: flex;
    align-items: center;
    margin: 40px 50px 20px 50px;
  }

  .property-key {
    width: 80px;
    font-size: 14px;
    color: #333333;
    flex-shrink: 0;
  }

  .property-value {
    border: 1px solid #dddddd;
    width: 240px;
    height: 34px;
    font-size: 15px;
    padding: 0 8px;
  }

  .demand{
    display: flex;
    margin: 0 50px;
  }

  .demand-key{
    margin-top: 5px;
    width: 80px;
    font-size: 14px;
    color: #333333;
    flex-shrink: 0;
  }

  .demand-value{
    border: 1px solid #dddddd;
    min-width: 350px;
    min-height: 120px;
    padding:5px 8px;
    font-size: 15px;
  }

  .upload-article{
    height: 50px;
  }

  .select{
    background:#dddddd;
    border:1px solid #bababa;
    border-radius:4px;
    font-size:14px;
    color:#929292;
    padding: 3px 8px;
    outline: none;
  }

  .submit {
    width: 80px;
    height: 35px;
    margin: 40px 0 50px 130px;
    background: #353535;
    color: #ffffff;
    font-size: 14px;
    border-radius: 4px;
    border: none;
    outline: none;
  }
</style>
