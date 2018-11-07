<template>
    <div class="wrap">
      <div class="content">
          <Aside></Aside>
        <div class="info">
          <router-view class="all"/>
        </div>
      </div>
      <Head></Head>
    </div>
</template>

<script type="text/ecmascript-6">
    import Head from '../components/Head.vue'
    import Aside from '../components/Aside.vue'
    export default {
      components: {
        Head,
        Aside
      },
    }
</script>
<style scoped>
  .wrap{
    height:100%;
    display: flex;
    flex-direction: column;
  }
  .content{
    min-height: calc(100% - 60px);
    margin-top: 60px;
    display: flex;
  }
  .side{
    position: fixed;
    width:200px;
    min-height:calc(100% - 60px);
    top:60px;
    left:0;
    background:#16212e;
  }
  .info{
    flex: 1;
    margin-left: 200px;
    min-height: calc(100% - 60px);
  }

  .all{
    min-height: calc(100% - 60px);
  }
</style>
