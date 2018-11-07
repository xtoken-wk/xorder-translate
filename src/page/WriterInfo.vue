<template>
  <div class="main">
    <div class="head">
      <div class="back" @click="back()">
        <img src="static/img/register_back.png">
        文章列表
      </div>
    </div>
    <div class="title">Edd Okuneva</div>
    <div class="property">邮箱：asdkajldskfjsaldkfj</div>
    <div class="property">性别：男
      <div style="margin-left: 60px">年龄：12</div>
    </div>
    <div class="property">身份：探险家</div>
    <div class="property">行业：保洁工人</div>
    <div class="property">联系方式：18945535921</div>
    <div class="property">兴趣爱好：探险</div>
    <button class="submit" @click="register">确 定</button>
  </div>
</template>

<script type="text/ecmascript-6">
    export default {}
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
    cursor:pointer;
  }

  .back img {
    width: 15px;
    height: 15px;
    margin-right: 6px;
  }

  .title {
    margin: 30px 50px;
    font-size:24px;
    color:#333333;
  }

  .property {
    display: flex;
    margin-left: 50px;
    margin-bottom: 15px;
    font-size: 14px;
    color: #333333;
  }

  .submit {
    width: 80px;
    height: 35px;
    margin: 40px 0 50px 50px;
    background: #353535;
    color: #ffffff;
    font-size: 14px;
    border-radius: 4px;
    border: none;
    outline: none;
  }
</style>
