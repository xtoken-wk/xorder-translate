import Vue from 'vue'
import Router from 'vue-router'
import App from '../App'

/* 登录注册*/
import login from '../page/Login.vue'
import home from '../page/Home.vue'
import register from '../page/Register.vue'
import articleList from '../page/ArticleList.vue'
import uploadArticle from '../page/UploadArticle.vue'
import articleDetail from '../page/ArticleDetail.vue'
import writerInfo from '../page/WriterInfo.vue'
import myUpload from '../page/MyUpload.vue'
import myMessage from '../page/MyMessage.vue'
import messageList from '../page/MessageList.vue'
import messageDetail from '../page/MessageDetail.vue'
import userInfo from '../page/UserInfo.vue'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: 'login',
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/register',
      name: 'register',
      component: register
    },
    {
      path: '/index',
      name: 'home',
      component: home,
      redirect:'/index/articleList',
      children:[
        {
          path: 'articleList',
          name: 'articleList',
          component: articleList
        },
        {
          path: 'uploadArticle',
          name: 'uploadArticle',
          component: uploadArticle
        },
        {
          path: 'articleDetail',
          name: 'articleDetail',
          component: articleDetail
        },
        {
          path: 'writerInfo',
          name: 'writerInfo',
          component: writerInfo
        },
        {
          path: 'myUpload',
          name: 'myUpload',
          component: myUpload
        },
        {
          path: 'myMessage',
          name: 'myMessage',
          component: myMessage
        },
        {
          path: 'messageList',
          name: 'messageList',
          component: messageList
        },
        {
          path: 'messageDetail',
          name: 'messageDetail',
          component: messageDetail
        },
        {
          path: 'userInfo',
          name: 'userInfo',
          component: userInfo
        }
      ]
    }
  ]
})
