<template>
  <div class="side-all">
    <el-menu
      default-active="articleList?type=-1"
      class="menu"
      background-color="#16212e"
      text-color="rgba(255,255,255,0.5)"
      active-text-color="#fff"
      router>
      <el-submenu index="1">
        <template slot="title">
          <span class="title">文章列表</span>
        </template>
        <el-menu-item index="articleList?type=-1">全部文章</el-menu-item>
        <el-menu-item index="articleList?type=0">待领取</el-menu-item>
        <el-menu-item index="articleList?type=1">已领取</el-menu-item>
        <el-menu-item index="articleList?type=2">待审核</el-menu-item>
        <el-menu-item index="articleList?type=3">正在校对</el-menu-item>
        <el-menu-item index="articleList?type=4">已通过</el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {}
</script>
<style scoped>
  .side-all {
    position: fixed;
    width:200px;
    min-height:calc(100% - 60px);
    top:60px;
    left:0;
    background:#16212e;
  }

  .menu {
    margin-top: 70px;
    width: 100%;
  }

  .title {
    font-size: 16px;
    color: #ffffff;
  }
</style>
