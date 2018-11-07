<template>
  <div class="main">
    <div class="head">
      <div class="back">
        <img src="static/img/register_back.png">
        返回主页
      </div>
    </div>
    <div class="title">注 册</div>
    <div class="property">
      <div class="property-key">昵称：</div>
      <input class="property-value" v-model="name"/>
    </div>
    <div class="property">
      <div class="property-key">手机号：</div>
      <input class="property-value" v-model="phone"/>
      <div class="error">*请填写正确的手机号</div>
    </div>
    <div class="property">
      <div class="property-key">邮箱：</div>
      <input class="property-value" v-model="email"/>
    </div>
    <div class="property">
      <div class="property-key">性别：</div>
      <el-radio v-model="sex" label="1">男</el-radio>
      <el-radio v-model="sex" label="0">女</el-radio>
    </div>
    <div class="property">
      <div class="property-key">年龄：</div>
      <input class="property-value" style="width: 90px;" v-model="age"/>
    </div>
    <div class="property">
      <div class="property-key">身份：</div>
      <input class="property-value" v-model="identity"/>
    </div>
    <div class="property">
      <div class="property-key">行业：</div>
      <input class="property-value" v-model="profession"/>
    </div>
    <div class="property" style="align-items: flex-start;">
      <div class="property-key" style="margin-top: 5px">兴趣爱好：</div>
      <textarea class="property-value" style="min-width: 350px;min-height: 120px;padding:5px 8px;" v-model="hobbies"/>
    </div>
    <button class="submit" @click="register" v-loading.fullscreen.lock="loading">确 定</button>
  </div>
</template>

<script type="text/ecmascript-6">
  import httpUtil from '../assets/js/httpUtils'
  export default {
    data() {
      return {
        name: '',
        phone: '',
        email: '',
        sex: -1,
        age: '',
        identity: '',
        profession: '',
        hobbies: '',
        loading:false
      }
    },
    methods: {
      back:function () {
        this.$router.back(-1);
      },
      register: function () {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
        }, 2000);
        var data={

        }
        httpUtil.getRequest(httpUtil.URLS.register,data,true,(result)=>{

        },(error)=>{

        },()=>{

        })
      }
    }
  }
</script>
<style scoped>
  .main {
    max-width: 1000px;
    margin: 0 auto;
    height: 100%;
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
    cursor:pointer;
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
</style>
