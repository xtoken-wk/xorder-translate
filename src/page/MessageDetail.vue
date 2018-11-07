<script src="../assets/js/httpUtils.js"></script>
<template>
  <div class="main">
    <div class="head">
      <div class="back" @click="back()">
        <img src="static/img/register_back.png">
        消息列表
      </div>
    </div>
    <div class="content">
      <div class="title">{{message.title}}</div>
    </div>
    <div class="item" v-for="(item,index) of message.list">
      <div class="item-message">{{item.content}}</div>
      <div class="item-info">
        {{item.fromName}}
        <div class="item-time">{{getDate(item.time)}}</div>
        <div class="delete" @click="deleteMessage(index,item.id)" v-show="ownId==item.fromuser">
          <img src="static/img/delete.png">
          删除
        </div>
      </div>
    </div>
    <div class="page">
      <el-pagination
        :page-size="10"
        layout="prev, pager, next, jumper"
        :total="message.count"
        :current-page.sync="page"
        @current-change="requestDetail">
      </el-pagination>
    </div>
    <div class="send-message">
      <textarea class="input-message" v-model="content" maxlength="1000"></textarea>
      <div class="send-num">
        {{content.length}}/1000
        <div class="send" @click="replyMessage()" v-loading.fullscreen.lock="screenloading">发 送</div>
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
        userId: 0,
        message: '',
        content: '',
        page: 1,
        screenloading: false,
        ownId: ''
      }
    },
    mounted: function () {
      this.id = this.$route.query.id;
      this.userId = this.$route.query.userId;
      this.ownId = sessionStorage.getItem("userId")
      this.requestDetail();
    },
    methods: {
      back: function () {
        this.$router.back(-1);
      },
      requestDetail: function () {
        this.screenloading = true;
        var data = {
          aid: this.id,
          userId: this.userId,
          page: this.page,
          num: 10
        }
        httpUtil.getRequest(httpUtil.URLS.messageDetail, data, false, (result) => {
          this.message = result;
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
        let H = date.getHours();
        let Min = date.getMinutes();
        Y = Y < 10 ? '0' + Y : Y;
        M = M < 9 ? '0' + (1 + M) : 1 + M;
        D = D < 9 ? '0' + D : D;
        H = H < 9 ? '0' + H : H;
        Min = Min < 9 ? '0' + Min : Min;
        return Y.toString() + "/" + M + "/" + D + ' ' + H + ":" + Min;
      },
      replyMessage: function () {
        if (this.content) {
          this.screenloading = true;
          var data = {
            aid: this.id,
            pid: this.message.list[0].pid,
            toUser: this.userId,
            msg: this.content
          }
          var time = new Date();
          httpUtil.getRequest(httpUtil.URLS.replyMessage, data, false, (result) => {
            this.$message.success('发送成功');
            this.content = "";
            this.requestDetail();
          }, (error) => {

          }, () => {
            this.screenloading = false;
          })
        }else {
          this.$message.warning('请输入回复内容');
        }
      },
      deleteMessage: function (index,id) {
        this.screenloading = true;
        httpUtil.getRequest(httpUtil.URLS.messageDels, {msgId: id}, false, (result) => {
          this.message.list.splice(index,0);
        }, (error) => {

        }, () => {
          this.screenloading = false;
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
    padding-bottom: 200px;
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
    /*border-bottom: 1px solid #dddddd;*/
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
    margin-left: 20px;
  }

  .demand {
    margin-top: 50px;
    font-size: 14px;
    color: #333333;
  }

  .delete {
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

  .item {
    padding: 20px 50px;
    border-bottom: 1px solid #dddddd;
  }

  .item-message {
    font-size: 14px;
    color: #333333;
  }

  .item-info {
    margin-top: 15px;
    font-size: 14px;
    color: #999999;
    display: flex;
  }

  .item-time {
    margin-left: 20px;
    flex: 1;
  }

  .page {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }

  .send-message {
    background: #fafafa;
    border: 1px solid #dddddd;
    border-radius: 4px;
    padding: 15px;
    margin: 30px 50px;
  }

  .input-message {
    width: 100%;
    height: 150px;
    resize: none;
    border: none;
    outline: none;
    font-size: 14px;
    color: #333333;
    background: #fafafa;
  }

  .send-num {
    margin-top: 15px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    font-size: 14px;
    color: #999999;
  }

  .send {
    background: #353535;
    border-radius: 4px;
    margin-left: 10px;
    padding: 8px 25px;
    font-size: 14px;
    color: #ffffff;
    cursor: pointer;
  }
</style>
