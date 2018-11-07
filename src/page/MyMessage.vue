<template>
  <div class="main">
    <div class="head">
      <div class="head-title">消息管理
        <div class="mes-num" v-show="unread>0">{{unread}}</div>
      </div>
      <div>

      </div>
    </div>
    <div style="min-height: 400px;border-bottom: 1px solid #dddddd" v-loading="loading">
      <div :class="index%2==1?'item select':'item'" v-for="(item,index) of artList">
        <div class="item-left" @click="jumpDetail(item.artid)">{{item.title}}</div>
        <div class="item-msg-num" v-show="list[index]>0">{{list[index]}}</div>
      </div>
      <div class="empty" v-show="list?list.length<=0:true">暂无消息</div>
    </div>
    <div class="page">
      <el-pagination
        :page-size="10"
        layout="prev, pager, next, jumper"
        :total="count"
        :current-page.sync="page"
        @current-change="requestList">
      </el-pagination>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import httpUtil from '../assets/js/httpUtils'

  export default {
    data() {
      return {
        list:[1,1,1,1,1,1,1,1,1,1],
        count: 0,
        artList:[],
        page: 1,
        unread: 0,
        loading: false,
        admin:sessionStorage.getItem('type'),
      }
    },
    mounted() {
      this.requestList();
      this.requestUnReadMsg();
    },
    methods: {
      jumpDetail: function (id) {
        this.$router.push({name: 'messageList', query: {id}});
      },
      requestList: function () {
        this.loading = true;
        var data = {
          page: this.page,
          num: 10
        }
        httpUtil.getRequest(httpUtil.URLS.myMessageList, data, false, (result) => {
          this.list = result.list;
          this.count = result.count;
          this.artList=result.msgList;
        }, (error) => {

        }, () => {
          this.loading = false;
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
      requestUnReadMsg: function () {
        httpUtil.getRequest(httpUtil.URLS.unReadMsgNum, null, false, (result) => {
          this.unread = result.count;
        }, (error) => {

        }, () => {

        })
      },
      isRead:function (index) {
        httpUtil.getRequest(httpUtil.URLS.messageMark, {msgId:this.list[index].id}, false, (result) => {
          this.list[index].status=1;
          this.requestUnReadMsg();
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
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #dddddd;
  }

  .head-title {
    margin: 30px 50px;
    font-size: 24px;
    color: #666666;
    display: flex;
    align-items: center;
  }

  .mes-num {
    background: #fd483f;
    border: 1px solid #ff7f79;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.20);
    width: 19px;
    height: 19px;
    border-radius: 100%;
    font-size: 12px;
    color: #ffffff;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 9px;
  }

  .empty {
    width: 100%;
    height: 400px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 15px;
    color: #666666;
  }

  .item {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 15px 50px;
  }

  .select {
    background: #fafafa;
  }

  .item-left {
    cursor: pointer;
    flex: 1;
    margin-right: 30px;
    font-size: 14px;
    color: #333333;
  }

  .item-msg-num {
    background: #fd483f;
    border: 1px solid #ff7f79;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.20);
    width:20px;
    height: 20px;
    border-radius: 100%;
    font-size: 12px;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .page {
    margin-top: 20px;
    padding-bottom: 100px;
    display: flex;
    justify-content: center;
  }
</style>
