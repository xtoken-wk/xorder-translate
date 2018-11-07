<template>
  <div style="height: 100%">

    <div class="main">
      <div class="head">
        <div class="back" @click="back()">
          <img src="static/img/register_back.png">
          返回主页
        </div>
      </div>
      <div class="title">注 册</div>
      <div class="property">
        <div class="property-key">姓名：</div>
        <input class="property-value" v-model="name"/>
      </div>
      <div class="property">
        <div class="property-key">邮箱：</div>
        <input class="property-value" v-model="email"/>
      </div>
      <div class="property">
        <div class="property-key">密码：</div>
        <input class="property-value" v-model="password" type="password"/>
      </div>
      <div class="property">
        <div class="property-key">重复密码：</div>
        <input class="property-value" v-model="password2" type="password"/>
      </div>
      <button class="submit" @click="register" v-loading.fullscreen.lock="loading">确 定</button>
    </div>
    <div class="head-all">
      <img src="static/img/head_logo.png">
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import httpUtil from '../assets/js/httpUtils'
  import MD5 from 'js-md5';

  export default {
    data() {
      return {
        name: '',
        email: '',
        password: '',
        password2: '',
        loading: false
      }
    },
    created(){
      sessionStorage.removeItem('name')
    },
    methods: {
      back: function () {
        httpUtil.showlog("---------------")
        this.$router.back(-1);
      },
      register: function () {
        if (!this.name) {
          this.$message.error('请输入姓名');
          return
        }
        if (this.email) {
//          var reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
          var reg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;

          if (!reg.test(this.email)) {
            this.email = "";
            this.$message.error('请输入有效的邮箱');
            return
          }
        } else {
          this.$message.error('请输入邮箱');
          return
        }
        if (!this.password) {
          this.$message.error('请输入密码');
          return
        }
        if (!this.password2) {
          this.$message.error('请再次输入密码');
          return
        }
        if (this.password != this.password2) {
          this.$message.error('2次密码不一致，请重新输入');
          this.password = "";
          this.password2 = "";
          return
        }

        this.loading = true;

        var data = {
          name: this.name,
          email: this.email,
          pwd: MD5(this.password)
        }
        httpUtil.getRequest(httpUtil.URLS.register, data, false, (result) => {
          this.login();
        }, (error) => {
          this.loading = false;
        }, () => {

        })
      },
      login: function () {
        var data = {
          email: this.email,
          pwd: MD5(this.password)
        }
        httpUtil.getRequest(httpUtil.URLS.login, data, false, (result) => {
          if (result) {
            sessionStorage.setItem('token', result.token)
            sessionStorage.setItem('name', result.name);
            sessionStorage.setItem('type', result.type);
            sessionStorage.setItem('userId', result.id);
            this.$router.push({name: 'home'})
          }
        }, (error) => {

        }, () => {
          this.loading = false;
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
    /*height: 100%;*/
    background: #ffffff;
    box-shadow: 0 1px 8px 0 rgba(0, 0, 0, 0.10);
  }

  .head {
    padding-top: 60px;
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

  .title {
    margin: 30px 50px;
    font-size: 30px;
    color: #666666;
  }

  .property {
    display: flex;
    align-items: center;
    margin-left: 50px;
    margin-bottom: 20px;
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

  .error {
    margin-left: 10px;
    font-size: 12px;
    color: #ff4141;
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
</style>
