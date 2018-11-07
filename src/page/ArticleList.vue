<template>
  <div class="main">
    <div class="head">
      <div class="head-title">文章列表</div>
      <div>
        <div class="upload-article" @click="upload()" v-show="admin==1">
          上传文章
        </div>
      </div>
    </div>
    <div class="list-options">
      <div class="item-title" style="color: #929292;font-size: 12px">
        文章标题
      </div>
      <div class="item-time">
        发布时间
      </div>
      <div class="item-time">
        截止时间
      </div>
      <div class="item-down">
        下载次数
      </div>
      <div class="item-status">
        当前状态
      </div>
      <div class="item-delete" v-if="admin==1">
        操作
      </div>
    </div>
    <div class="list" v-loading="loading">
      <div :class="index%2==1?'item select':'item'" v-for="(item,index) of list">
        <div class="item-title" @click="jumpDetail(item.id)">{{item.title}}</div>
        <div class="item-time">{{getDate(item.time)}}</div>
        <div class="item-time">{{getDate(item.endTime)}}</div>
        <!--<img class="item-down-img" src="static/img/download.png"/>-->
        <div class="item-down">{{item.downNums}}</div>
        <div class="item-status">{{item.status==4?'已通过':item.status==3?'正在校对':item.status==2?'待审核':item.status==1?'待上传':'待领取'}}</div>
        <!--<img class="item-delete-img" src="static/img/delete.png" @click="cancel(item.id)" v-show="admin==1"/>-->
        <div class="item-delete" @click="cancel(item.id)" v-show="admin==1">删除</div>
      </div>
      <div class="empty" v-show="list?list.length<=0:true">暂无数据</div>
    </div>
    <div class="page">
      <el-pagination
        layout="prev, pager, next, jumper"
        :total="count"
        :current-page.sync="page"
        @current-change="requestData">
      </el-pagination>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import httpUtil from '../assets/js/httpUtils'
  export default {
    data() {
      return {
        type:-1,
        count:0,
        list: [],
        page:1,
        admin:sessionStorage.getItem('type'),
        loading:true
      }
    },
    mounted:function() {
      var type=this.$route.query.type;
      if (type){
        this.type=type;
      }
      this.requestData();
    },
    watch: {
      '$route': function (route) {
        var type = route.query.type;
        if (type){
          this.type=type;
        }
        this.requestData();
      },
    },
    methods: {
      upload: function () {
        this.$router.push({name: 'uploadArticle'});
      },
      cancel: function (id) {
        this.$confirm('确定删除该文章？, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading=true;
          httpUtil.getRequest(httpUtil.URLS.articleDelete,{articleId:id},false,(result)=>{
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.requestData();
          },(error)=>{

          },()=>{
            this.loading = false;
          })
        }).catch(() => {

        });
      },
      jumpDetail:function (it) {
        this.$router.push({name:'articleDetail', query: {id: it}})
      },
      requestData:function () {
        this.loading=true
        var data={
          status:this.type,
          page:this.page,
          num:10
        }
        httpUtil.getRequest(httpUtil.URLS.articleList,data,false,(result)=>{
          if (result){
            this.count=result.count;
            this.list=result.list;
          }
        },(error)=>{

        },()=>{
          this.loading=false
        })
      },
      getDate:function (time) {
          let date = new Date(time);
          let Y = date.getFullYear();
          let M = date.getMonth();
          let D= date.getDate();
          Y = Y < 10 ? '0' + Y : Y;
          M = M < 9 ? '0' + (1 + M) : 1 + M;
          D = D < 9 ? '0' + D : D;
          return Y.toString() +"/"+ M +"/"+D;
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
    padding-right: 50px;
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

  .upload-article {
    background: #353535;
    border-radius: 2px;
    font-size: 12px;
    color: #ffffff;
    padding: 5px 15px;
    cursor: pointer;
  }

  .list {
    border-bottom: 1px solid #dddddd;
    min-height: 400px;
  }

  .empty{
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
    color: #929292;
    margin: 0px 30px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .item-delete-img {
    width: 12px;
    height: 13px;
    margin-left: 40px;
    cursor: pointer;
  }

  .item-delete {
    margin-left: 30px;
    font-size: 12px;
    color: #929292;
    cursor: pointer;
  }

  .page {
    margin-top: 20px;
    padding-bottom: 100px;
    display: flex;
    justify-content: center;
  }
</style>
