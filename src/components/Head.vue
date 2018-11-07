<template>
  <div class="head-all">
    <img src="static/img/head_logo.png">
    <div class="head-right" v-show="account">
      <div class="user">
        {{account}}
        <img src="static/img/arrows_white_down.png">
        <div class="drop">
          <router-link class="drop-item" :to="{name: 'myUpload'}">我的上传</router-link>
          <div class="drop-item" @click="loginOut()">退 出</div>
          <!--<router-link class="drop-item" :to="{name: 'userInfo'}">我的资料</router-link>-->
        </div>
      </div>
      <div class="message" v-show="account" @click="jumpMessage">
        <!--<router-link class="message-title" :to="{name: 'myMessage'}">消息管理</router-link>-->
        <img class="message-title" src="static/img/header_notice.svg">
        <p class="message-notice" v-show="notice"></p>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import httpUtil from '../assets/js/httpUtils'
  export default {
    name: 'Head',
    data() {
      return {
        account: sessionStorage.getItem('name'),
        notice: false
      }
    },
    mounted(){
      this.requestNotice();
    },
    computed: {
      routerName() {
        return this.$route.name;
      },
    },
    methods: {
      requestNotice:function () {
        httpUtil.getRequest(httpUtil.URLS.unReadMsgNum, null, false, (result) => {
          this.notice = result.count>0;
        }, (error) => {

        }, () => {

        })
      },
      loginOut: function () {
        sessionStorage.clear()
        this.$router.push({name: 'login'})
      },
      jumpMessage:function () {
        this.$router.push({name:'myMessage'})
      }
    }
  }
</script>
<style scoped>
  .head-all {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 60px;
    background: #16212e;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .head-all img {
    width: 110px;
    height: 20px;
    margin-left: 50px;
  }

  .user {
    position: relative;
    height: 100%;
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #ffffff;
    cursor: pointer;
  }

  .user img {
    width: 9px;
    height: 6px;
    margin-left: 5px;
  }

  .head-right {
    min-width: 150px;
    height: 100%;
    margin-right: 30px;
    display: flex;
  }

  .drop {
    position: absolute;
    top: 60px;
    left: 0;
    background: #16212e;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    display: none;
    text-decoration-line: none;
  }

  .drop-item {
    width: 130px;
    color: #fff;
    border-bottom: 1px solid #333333;
    font-size: 14px;
    cursor: pointer;
    padding: 10px 0;
    display: flex;
    justify-content: center;
    text-decoration-line: none;
  }

  .user:hover .drop {
    display: block;
  }

  .message {
    position: relative;
    width: 70px;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .message img{
    width:30px;
    height: 30px;
    margin: 15px;
  }

  .message-title {
    color: #fff;
    font-size: 14px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    text-decoration-line: none;
  }

  .message-notice {
    position: absolute;
    top: 0;
    right: 20px;
    width: 8px;
    height: 8px;
    border-radius: 100%;
    background: #fd483f;
    border: 1px solid #ff7f79;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.20);
  }

</style>
