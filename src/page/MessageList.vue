<template>
  <div class="main">
    <div class="head">
      <div class="back" @click="back()">
        <img src="static/img/register_back.png">
        消息管理
      </div>
    </div>
    <div style="min-height: 400px;border-bottom: 1px solid #dddddd" v-loading="loading">
      <div :class="index%2==1?'item select':'item'" v-for="(item,index) of list">
        <div class="item-left" @click="jumpDetail(item.userId)">{{item.name}}</div>
        <div class="item-right">
          <div class="item-options">
            <div class="item-show-num">
              <div class="item-msg-num" v-show="item.count>0">{{item.count}}</div>
            </div>
            <div class="item-show-read" @click="isRead(index)">
              <div class="item-read">标记已读</div>
            </div>
          </div>
        </div>
      </div>
      <div class="empty" v-show="list?list.length<=0:true">暂无消息</div>
    </div>
    <!--<div class="page">-->
      <!--<el-pagination-->
        <!--:page-size="10"-->
        <!--layout="prev, pager, next, jumper"-->
        <!--:total="count"-->
        <!--:current-page.sync="page"-->
        <!--@current-change="requestList">-->
      <!--</el-pagination>-->
    <!--</div>-->
  </div>
</template>

<script type="text/ecmascript-6">
  import httpUtil from '../assets/js/httpUtils'

  export default {
    data() {
      return {
        id:0,
        list: [1,1,1,1,1,1,1,1,1,1,1],
        count: 0,
        loading: false,
        admin: sessionStorage.getItem('type'),
      }
    },
    mounted() {
      this.id = this.$route.query.id;
      this.requestList();
    },
    methods: {
      back:function () {
        this.$router.back(-1);
      },
      jumpDetail: function (userId) {
        this.$router.push({name: 'messageDetail', query: {userId,id:this.id}});
      },
      requestList: function () {
        this.loading = true;
        var data = {
          aid:this.id
        }
        httpUtil.getRequest(httpUtil.URLS.myMessageUserList, data, false, (result) => {
          this.list = result;
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
      isRead: function (index) {
        httpUtil.getRequest(httpUtil.URLS.messageMark, {msgId: this.list[index].id}, false, (result) => {
          this.list[index].status = 1;
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

  .item-right {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    width: 60px;
    height: 100%;
  }

  .item-time {
    font-size: 12px;
    color: #999999;
  }

  .item-options {
    position: relative;
    height: 20px;
    display: flex;
    flex-direction: column;
  }

  .item-show-num {
    display: block;
  }

  .item-msg-num {
    position: absolute;
    top: 0;
    right: 0;
    background: #fd483f;
    border: 1px solid #ff7f79;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.20);
    width: 20px;
    height: 100%;
    border-radius: 100%;
    font-size: 12px;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .item-show-read {
    display: none;
  }

  .item-read {
    position: absolute;
    top: 0;
    right: 0;
    font-size: 14px;
    color: #166aa9;
    cursor: pointer;
  }

  .item-options:hover .item-show-num {
    display: none;
  }

  .item-options:hover .item-show-read {
    display: block;
  }

  .page {
    margin-top: 20px;
    padding-bottom: 100px;
    display: flex;
    justify-content: center;
  }
</style>
