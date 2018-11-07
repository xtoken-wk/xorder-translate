<template>
  <div class="body">
    <div class="content" v-if="!isLogin">
      <div style="display: flex;">
        <img src="static/img/login_logo.png" style="width: 330px;height: 60px;">
        <div class="title">翻译站</div>
      </div>
      <div style="display: flex;margin-top: 70px;justify-content: center">
        <button class="register" @click="register()">注 册</button>
        <button class="login" @click="login()">登 录</button>
      </div>
    </div>
    <div class="login-content" v-else>
      <div class="input-row">
        <img src="static/img/login_account.png">
        <input class="input" v-model="account">
      </div>
      <div class="input-row">
        <img src="static/img/login_password.png">
        <input class="input" v-model="password" type="password">
      </div>
      <div style="margin-top: 10px;display: flex;justify-content: space-between;">
        <div class="remember" @click="remember()">
          <img :src="isRemember?'static/img/login_remember_account.png':'static/img/login_remember_account_select.png'">
          <div class="forget">记住账号</div>
        </div>
        <!--<div class="forget" @click="forgetPassword()">忘记密码？</div>-->
      </div>
      <button class="submit" @click="submit" v-loading.fullscreen.lock="loading">登 录</button>
      <img class="close" src="static/img/close.png" @click="close()">
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import httpUtil from '../assets/js/httpUtils'
  import MD5 from 'js-md5';
  export default {
    data(){
      return{
        isLogin:false,
        account:'',
        password:'',
        isRemember:false,
        loading:false
      }
    },
    created(){
      sessionStorage.removeItem('name')
    },
    mounted(){
      var account=localStorage.getItem("xorderAccount");
      if (account){
        this.account=account;
        this.isRemember=true;
      }
    },
    methods: {
      register: function () {
        this.$router.push({name: "register"})
      },
      login: function () {
        this.isLogin=true;
      },
      remember:function () {
        this.isRemember=!this.isRemember
      },
      rememberAccount:function () {
        if(this.isRemember){
          localStorage.setItem("xorderAccount",this.account)
        }else {
          localStorage.removeItem("xorderAccount")
        }
      },
      forgetPassword:function () {

      },
      close:function () {
        this.isLogin=false;
      },
      submit:function () {
        if(!this.account){
          this.$message.error('请输入邮箱');
          return
        }
        if(!this.password){
          this.$message.error('请输入密码');
          return
        }

        this.rememberAccount();

        this.loading = true;

        var data={
          email:this.account,
          pwd:MD5(this.password)
        }
        httpUtil.getRequest(httpUtil.URLS.login,data,false,(result)=>{
          if (result){
            sessionStorage.setItem('token',result.token)
            sessionStorage.setItem('name',result.name);
            sessionStorage.setItem('type',result.type);
            sessionStorage.setItem('userId',result.id);
            this.$router.push({name:'home'})
          }
        },(error)=>{

        },()=>{
          this.loading = false;
        })
      }
    }
  }
</script>
<style scoped>
  .body {
    height: 100%;
    background: url('../../static/img/login_bg.png') no-repeat center center;
    background-size: cover;
    background-attachment: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .content {
    display: flex;
    flex-direction: column;
  }

  .title {
    margin-left: 10px;
    font-size: 20px;
    color: #333333;
    font-weight: bold;
  }

  .register {
    border: 1px solid #353535;
    border-radius: 4px;
    width: 120px;
    height: 50px;
    background: none;
    font-size: 18px;
    color: #353535;
    margin-right: 30px;
    cursor: pointer;
  }

  .login {
    background: #353535;
    border-radius: 4px;
    border: none;
    width: 120px;
    height: 50px;
    font-size: 18px;
    color: #ffffff;
    margin-left: 30px;
    cursor: pointer;
  }

  .login-content {
    position: relative;
    background: #ababaa;
    box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.10);
    border-radius: 10px;
    padding: 50px;
  }

  .input-row{
    margin-top: 20px;
    display: flex;
    align-items: center;
    border:1px solid rgba(255,255,255,0.5);
    border-radius:4px;
    width:300px;
    height:40px;
  }

  .input-row img{
    margin:0 10px;
    width:20px;
    height:20px;
  }

  .input{
    flex: 1;
    height:35px;
    background: none;
    border: none;
    outline: none;
    color: #ffffff;
    font-size: 15px;
    padding-right: 5px;
  }

  .remember{
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  .remember img{
    width:12px;
    height:12px;
  }

  .forget{
    margin-left: 3px;
    font-size:12px;
    color:#ffffff;
  }

  .submit{
    margin-top: 50px;
    width: 100%;
    background: none;
    border:1px solid #ffffff;
    border-radius:4px;
    font-size:18px;
    color:#ffffff;
    padding: 10px 0;
    outline: none;
  }

  .close{
    position: absolute;
    top:20px;
    right: 20px;
    width:15px;
    height:15px;
  }
</style>
