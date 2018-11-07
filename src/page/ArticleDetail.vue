<template>
  <div style="height: 100%">
    <div class="main">
      <div class="head">
        <div class="back" @click="back()">
          <img src="static/img/register_back.png">
          返回上一页
        </div>
      </div>
      <div class="content">
        <div class="title">{{info.title}}</div>
        <div class="info">
          截止日期：{{getDate(info.endTime)}}
          <div class="download-num">下载人数：{{info.downNums}}人</div>
          当前状态：{{info.status==4?'已通过':info.status==3?'正在校对':info.status==2?'待审核':info.status==1?'待上传':'待领取'}}
          <div class="download-num" v-if="info.status>0">领取人：{{info.receiveName}}</div>
        </div>
        <div class="demand" v-html="info.content"></div>
        <div style="display: flex;">
          <div class="download" download="x-order" @click="download(info.fileUrl,true)">附件：{{filename}}（点击下载）</div>
        </div>
        <div class="article-options" v-if="info.status!=4">
          <div class="upload-button" style="padding: 6px 15px" v-if="info.status==0" @click="getArticlePower()"
               v-loading.fullscreen.lock="screenloading">领取
          </div>
          <el-upload v-if="info.receiveid == userId&&info.status<2"
                     ref="upload"
                     :action="uploadFileDir"
                     :auto-upload="true"
                     :multiple="false"
                     :on-preview="handlePreview"
                     :on-remove="handleRemove"
                     :on-success="handleSuccess"
                     :on-error="handleError"
                     :limit="1"
                     :headers="uploadHeader"
                     :data="uploadData"
                     :on-exceed="handleExceed"
                     :show-file-list="false"
                     :file-list="fileList"
                     v-loading.fullscreen.lock="screenloading">
            <div class="upload-button">
              <img src="static/img/upload.png">
              上传文章
            </div>
          </el-upload>
          <div class="upload-button" style="padding: 6px 15px;margin-top: 10px" v-if="info.receiveid == userId&&info.status==1" @click="discardArticle()"
               v-loading.fullscreen.lock="screenloading">放弃
          </div>
          <div class="delete" @click="deleteArticle()" v-loading.fullscreen.lock="screenloading" v-show="admin==1">
            <img src="static/img/delete.png">
            删除
          </div>
        </div>
        <img class="success" src="static/img/article_detail_success.png" v-if="info.status==4">
      </div>
      <div class="upload-status">
        <p class="status">已上传文件：</p>
        <!--<div :class="select==index?'status select':'status'" v-for="(item,index) of statusList"-->
             <!--@click="stateChange(index)">-->
          <!--{{item}}-->
          <!--<div class="line" v-if="select==index"></div>-->
        <!--</div>-->
      </div>
      <div class="upload-list" v-loading="loading">
        <div class="item" v-for="(item,index) of list">
          <div class="item-info">
            <div class="name">{{item.userName}}</div>
            {{getDate(item.time)}}
          </div>
          <div class="download-article" @click="requestPermission(item.id,item.fileUrl)">
            <img src="static/img/download.png">
            下载
          </div>
          <div class="manage" @click="setManage(index)">
            <img src="static/img/operate.png">
            处理
          </div>
        </div>
        <div class="empty" v-show="list?list.length<=0:true">暂无翻译文件</div>
      </div>
    </div>
    <div class="check" v-if="manage">
      <div class="check-content">
        <div class="check-title">翻译核审</div>
        <div class="check-writer">
          <div class="key">翻译人：</div>
          <div class="writer">{{list[index].userName}}</div>
        </div>
        <div class="check-writer">
          <div class="key">审核结果：</div>
          <!--<el-radio v-model="status" label="2">校对</el-radio>-->
          <el-radio v-model="status" label="4">通过</el-radio>
          <el-radio v-model="status" label="5">不通过</el-radio>
        </div>
        <div class="check-writer" style="align-items: flex-start">
          <div class="key" style="margin-top: 5px">审核回复：</div>
          <textarea class="reason" v-model="reason"></textarea>
        </div>
        <div class="check-select">
          <div class="cancel" @click="cancel()">取 消</div>
          <div class="sure" @click="sure()" v-loading.fullscreen.lock="screenloading">确 定</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import httpUtil from '../assets/js/httpUtils'

  export default {
    data() {
      return {
        id: 0,
        info: '',
        select: 0,
        statusList: ['待审核', '待校对', '已通过'],
        list: [],
        index: -1,
        status: 0,
        reason: '',
        manage: false,
        uploadHeader: {token: sessionStorage.getItem('token'), source: 'web'},
        uploadData: {textType: 'flow', fileType: 'file'},
        admin: sessionStorage.getItem('type'),
        fileList: [],
        screenloading: false,
        loading: false,
        uploadFileDir: '',
        filename: '',
        showUpload: false,
        userId:''
      }
    },
    mounted: function () {
      this.userId=sessionStorage.getItem('userId');
      this.uploadFileDir = httpUtil.URLS.uploadFileDir;
      this.id = this.$route.query.id;
      this.uploadData.ext = this.id;
      this.requestDetail();
      this.requestList();
    },
    methods: {
      back: function () {
        this.$router.back(-1);
      },
      deleteArticle: function () {
        this.$confirm('确定删除该文章？, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.screenloading = true;
          httpUtil.getRequest(httpUtil.URLS.articleDelete, {articleId: this.id}, false, (result) => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.$router.back(-1)
          }, (error) => {

          }, () => {
            this.screenloading = false;
          })
        }).catch(() => {

        });
      },
      stateChange: function (index) {
        if (this.select == index) {
          return
        }
        this.select = index;

        this.requestList();
      },
      setManage: function (index) {
        if (this.info.status==4){
          return
        }
        if (this.admin == 1) {
          this.manage = true;
          this.index = index;
          this.status = this.list[index].status
        } else {
          this.$message.warning('您不是管理员,不能进行此操作')
        }
      },
      cancel: function () {
        this.status = 0
        this.reason = ''
        this.manage = false
      },
      sure: function () {
        this.screenloading = true;
        var data = {
          id: this.list[this.index].id,
          status: this.status,
          toUser: this.list[this.index].userId,
          msg: this.reason
        }
        httpUtil.getRequest(httpUtil.URLS.updateArticleStatus, data, false, (result) => {
          this.manage = false;
          this.info.status=this.status;
          if (this.status == 5){
            this.info.status=2;
            this.list.splice(this.index, 1);
          }
        }, (error) => {

        }, () => {
          this.screenloading = false;
        })
      },
      download: function (url, isRecord) {
        var $eleForm = $("<form method='get'></form>");
        $eleForm.attr("action", httpUtil.URLS.downloadDir + url);
        $(document.body).append($eleForm);
        //提交表单，实现下载
        $eleForm.submit();
        if (isRecord)
          this.downloadNum();
      },
      requestDetail: function () {
        httpUtil.getRequest(httpUtil.URLS.articleDetail, {articleId: this.id}, false, (result) => {
          this.info = result;
          this.filename = result.fileUrl.substring(result.fileUrl.indexOf('/') + 1)
        }, (error) => {

        }, () => {

        })
      },
      requestList: function () {
        this.loading = true;
        var data = {
          articleId: this.id,
        }
        httpUtil.getRequest(httpUtil.URLS.translateList, data, false, (result) => {
          this.list = result;
        }, (error) => {

        }, () => {
          this.loading = false;
        })
      },

      getArticlePower: function () {
        this.screenloading = true;
        var data = {
          aid: this.id,
        }
        httpUtil.getRequest(httpUtil.URLS.getArticlePower, data, false, (result) => {
          this.info.status=1;
          this.info.receiveid=this.userId;
          this.$set(this.info,'receiveName',sessionStorage.getItem('name'))
        }, (error) => {

        }, () => {
          this.screenloading = false;
        })
      },

      discardArticle:function () {
        this.screenloading = true;
        var data = {
          aid: this.id,
        }
        httpUtil.getRequest(httpUtil.URLS.discardArticle, data, false, (result) => {
          this.info.status=0;
          this.info.receiveid=0;
        }, (error) => {

        }, () => {
          this.screenloading = false;
        })
      },

      getDate: function (time) {
        let date = new Date(time);
        let Y = date.getFullYear();
        let M = date.getMonth();
        let D = date.getDate();
        Y = Y < 10 ? '0' + Y : Y;
        M = M < 9 ? '0' + (1 + M) : 1 + M;
        D = D < 9 ? '0' + D : D;
        return Y.toString() + "/" + M + "/" + D;
      },

      requestPermission: function (pid, url) {
        this.screenloading = true;
        var data = {
          pid
        }
        httpUtil.getRequest(httpUtil.URLS.downloadPermission, data, false, (result) => {
          if (result.isDown) {
            this.download(url, false)
          }
        }, (error) => {

        }, () => {
          this.screenloading = false;
        })
      },

      handlePreview: function () {
        httpUtil.showlog('preview')
      },
      handleRemove: function () {
        httpUtil.showlog('remove')
      },
      handleExceed: function () {
        httpUtil.showlog('exceed')
      },
      handleSuccess: function (res) {
        httpUtil.showlog(res)
        httpUtil.showlog("success===============")
        this.fileList.splice(0, this.fileList.length)
        this.submit(res.result.path);
      },
      handleError: function () {
        httpUtil.showlog("error")
        this.$message.error('文件上传出错，请重新上传')
      },
      submit: function (fileUrl) {
        this.screenloading = true;
        var data = {
          articleId: this.id,
          fileUrl
        }
        httpUtil.getRequest(httpUtil.URLS.updateTranslate, data, false, (result) => {
          httpUtil.showlog("upload--------------")
          this.$message.success('文章上传成功');
          this.info.status=2;
          this.requestList();
        }, (error) => {

        }, () => {
          this.screenloading = false;
        })
      },
      downloadNum: function () {
        var data = {
          articleId: this.id,
        }
        httpUtil.getRequest(httpUtil.URLS.downloadNum, data, false, (result) => {

        }, (error) => {

        }, () => {

        })
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
    cursor: pointer;
  }

  .back img {
    width: 15px;
    height: 15px;
    margin-right: 6px;
  }

  .content {
    position: relative;
    padding: 40px 50px;
    border-bottom: 1px solid #dddddd;
  }

  .title {
    font-size: 26px;
    color: #333333;
    margin-right: 120px;
  }

  .info {
    display: flex;
    font-size: 12px;
    color: #999999;
    margin-top: 10px;
  }

  .download-num {
    margin: 0 20px;
  }

  .demand {
    margin: 50px 0;
    font-size: 14px;
    color: #333333;
  }

  .download {
    font-size: 14px;
    color: #166aa9;
    cursor: pointer;
    display: flex;
  }

  .article-options {
    position: absolute;
    top: 45px;
    right: 50px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
  }

  .delete {
    margin-top: 10px;
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #929292;
    cursor: pointer;
  }

  .delete img {
    width: 12px;
    height: 14px;
    margin-right: 3px;
  }

  .upload-button {
    background: #333333;
    border: 1px solid #666666;
    border-radius: 2px;
    padding: 6px 8px;
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #ffffff;
    cursor: pointer;
  }

  .upload-button img {
    width: 14px;
    height: 14px;
    margin-right: 6px;
  }

  .upload-status {
    display: flex;
    align-items: flex-start;
    margin: 40px 50px;
  }

  .status {
    font-size: 18px;
    color: #333333;
    opacity: 0.5;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-right: 60px;
    cursor: pointer;
  }

  .select {
    opacity: 1;
  }

  .line {
    height: 1px;
    background: #333333;
    margin: 4px 10px;
  }

  .upload-list {
    padding: 0 50px;
    display: flex;
    flex-wrap: wrap;
    min-height: 100px;
  }

  .item {
    margin: 0 30px 30px 0;
    background: #fafafa;
    border: 1px solid #dddddd;
    border-radius: 2px;
    display: flex;
    padding: 10px;
  }

  .item-info {
    width: 110px;
    font-size: 12px;
    color: #929292;
    margin-right: 45px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .name {
    font-size: 14px;
    color: #333333;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .download-article {
    display: flex;
    height: 100%;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    margin: 0 15px;
    font-size: 12px;
    color: #666666;
  }

  .download-article img {
    width: 14px;
    height: 14px;
    margin-bottom: 3px;
  }

  .empty {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 15px;
    color: #666666;
  }

  .manage {
    display: flex;
    height: 100%;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    margin-left: 15px;
    font-size: 12px;
    color: #666666;
  }

  .manage img {
    margin-bottom: 3px;
    width: 14px;
    height: 14px;
  }

  .check {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.6);

  }

  .check-content {
    padding: 30px;
    background: #ffffff;
    border-radius: 4px;
  }

  .check-title {
    font-size: 20px;
    color: #333333;
    margin-bottom: 30px;
  }

  .check-writer {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }

  .key {
    width: 85px;
    font-size: 14px;
    color: #666666;
    flex-shrink: 0;
  }

  .writer {
    font-size: 14px;
    color: #333333;
  }

  .reason {
    background: #fafafa;
    border: 1px solid #dddddd;
    border-radius: 2px;
    width: 350px;
    height: 140px;
    resize: none;
    outline: none;
    padding: 5px 10px;
    font-size: 14px;
    color: #333333;
  }

  .check-select {
    margin-top: 10px;
    display: flex;
    justify-content: flex-end;
  }

  .sure {
    background: #353535;
    border-radius: 4px;
    padding: 8px 20px;
    font-size: 14px;
    color: #ffffff;
    cursor: pointer;
  }

  .cancel {
    border: 1px solid #353535;
    border-radius: 4px;
    padding: 8px 20px;
    font-size: 14px;
    color: #353535;
    margin-right: 40px;
    cursor: pointer;
  }

  .success{
    position: absolute;
    top:20px;
    right: 30px;
    max-width: 200px;
    max-height: 200px;
  }
</style>
