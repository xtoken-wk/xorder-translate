<template>
  <div class="main">
    <div class="head">
      <div class="head-title">我的上传</div>
      <div>

      </div>
    </div>
    <div class="list-options">
      <div class="item-title" style="color: #929292;font-size: 12px">
        文章标题
      </div>
      <div class="item-time">
        上传时间
      </div>
      <div class="item-status" style="color: #929292">
        当前状态
      </div>
    </div>
    <div class="list" v-loading="loading">
      <div :class="index%2==1?'item select':'item'" v-for="(item,index) of list">
        <div class="item-title" @click="jumpDetail(item.articleId)">{{item.articleTitle}}</div>
        <div class="item-time">{{getDate(item.time)}}</div>
        <div
          :class="item.status==5?'item-status fail':item.status==4?'item-status success':item.status==3?'item-status going':'item-status'">
          {{item.status==5?'未通过':item.status==4?'已通过':item.status==3?'正在校对':'正在审核'}}
        </div>
      </div>
      <div class="empty" v-show="list?list.length<=0:true">暂无上传</div>
    </div>
    <div class="page">
      <el-pagination
        :current-page.sync="page"
        @current-change="requestList"
        :page-size="10"
        layout="prev, pager, next, jumper"
        :total="count">
      </el-pagination>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import httpUtil from '../assets/js/httpUtils'

  export default {
    data() {
      return {
        list: [],
        count: 0,
        page: 1,
        loading: false
      }
    },
    mounted() {
      this.requestList();
    },
    methods: {
      requestList: function () {
        this.loading = true;
        var data = {
          page: this.page,
          num: 10
        }
        httpUtil.getRequest(httpUtil.URLS.myUploadList, data, false, (result) => {
          if (result) {
            this.count = result.count;
            this.list = result.list;
          }
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
      jumpDetail: function (id) {
        this.$router.push({name: 'articleDetail', query: {id}})
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
  }

  .list-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #dddddd;
    padding: 15px 20px 15px 50px;
  }

  .sort {
    font-size: 12px;
    color: #929292;
  }

  .list {
    border-bottom: 1px solid #dddddd;
    min-height: 400px;
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
    padding: 15px 20px 15px 50px;
  }

  .select {
    background: #fafafa;
  }

  .item-title {
    flex: 1;
    font-size: 14px;
    color: #333333;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
    margin-right: 30px;
  }

  .item-time {
    font-size: 12px;
    color: #929292;
    margin: 0 30px;
    width: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .item-down-img {
    width: 12px;
    height: 13px;
  }

  .item-down {
    width: 50px;
    font-size: 12px;
    color: #929292;
    margin: 0px 30px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .item-status{
    width: 50px;
    font-size: 12px;
    color: #ffbc00;
    margin: 0px 30px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .going {
    color: #ff5c00;
  }

  .success {
    color: #08af08;
  }

  .fail {
    color: #ff3535;
  }

  .page {
    margin-top: 20px;
    padding-bottom: 100px;
    display: flex;
    justify-content: center;
  }
</style>
