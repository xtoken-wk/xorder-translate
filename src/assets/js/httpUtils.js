const isTest = false;//是否测试环境
let ip = null;
if (isTest) { // 线下
              ip = "http://192.168.1.127:11110"
  // ip = 'http://1o746k7976.51mypc.cn:11110'
} else { // 线上
  ip = "http://trans.xorder.ai:11110"
}
const showLog = false;//显示log

const TIME_OUT = 10000;

import {Message} from 'element-ui';

/**网络链接 */
const URLS = {
  /**上传文件目录 */
  uploadFileDir: ip + "/trans/upload/file",
  /**图片拼接地址 */
  imgDir: "http://jsrelease-img.yunmaster.cn/store/img/",
  /**文章下载地址*/
  downloadDir: "http://jsrelease-file.yunmaster.cn/store/doc/",

  /** 注册*/
  register: '/trans/user/register',
  /** 登录*/
  login: '/trans/user/login',
  /** 管理员上传文章*/
  uploadArticle: '/trans/article/admin/upload',
  /** 文章列表*/
  articleList: '/trans/article/list',
  /** 删除文章*/
  articleDelete: '/trans/article/admin/file/del',
  /** 文章详情*/
  articleDetail: '/trans/article/details',
  /** 翻译文章列表 1 待审核 2 待校对 3 已通过*/
  translateList: '/trans/article/admin/file/list',
  /** 管理员处理翻译文章 1 待审核 2 待校对 3 已通过*/
  updateArticleStatus: '/trans/notify/sendMsg',
  /** 普通用户上传翻译文章*/
  updateTranslate: '/trans/article/user/upload',
  /** 普通用户下载文章次数*/
  downloadNum: '/trans/article/cal',
  /** 验证下载权限*/
  downloadPermission: '/trans/article/verify',
  /** 我的上传列表*/
  myUploadList: '/trans/article/user/list',
  /** 我的消息文章列表*/
  myMessageList: '/trans/notify/article/list',
  /** 文章所属的用户列表*/
  myMessageUserList: '/trans/notify/user/list',
  /** 文章所属的用户消息列表*/
  messageDetail: '/trans/notify/msg/list',
  /** 未读消息数*/
  unReadMsgNum: '/trans/notify/counts',
  /** 回复消息*/
  replyMessage: '/trans/notify/replyMsg',
  /** 删除消息*/
  messageDels: '/trans/notify/dels',
  /** 标记消息已读*/
  messageMark: '/trans/notify/mark',
  /** 普通用户领取文章**/
  getArticlePower:'/trans/article/gen/receive',
  /** 普通用户放弃文章**/
  discardArticle:'/trans/article/gen/discard'

}

function getRequest(url, data, isPost, success, failed, complete) {
  let type = isPost ? 'POST' : 'GET';
  showlog(data)
  $.ajax({
    // 数据传送方式
    type: type,
    contentType: "application/json; charset=utf-8",
    // 数据处理文件
    url: ip + url,
    // JSON格式数据
    data: isPost ? JSON.stringify(data) : data,
    beforeSend: function (XMLHttpRequest) {
      XMLHttpRequest.setRequestHeader("token", sessionStorage.getItem('token'));
      XMLHttpRequest.setRequestHeader("source", 'web');
      // XMLHttpRequest.setRequestHeader("tm", tm);
      // XMLHttpRequest.setRequestHeader("sn", sn);
    },
    timeout: TIME_OUT,
    dataType: 'json',
    // @msg: 数据返回值
    success: function (msg, status) {
      showlog(msg);
      if (msg.errorCode == 0) {
        success(msg.result);
      } else {
        failed(msg);
        Message.error(msg.errorMsg)
        if (msg.errorCode == 5101) {
          window.location.href = '/login'
        }
      }
    },
    error: function (xhr, desc, err) {
      failed();
      Message.error('请求失败，请检查您的网络')
    },
    complete: function (xhr, ts) {
      complete();
    }
  });
}

//打印信息
function showlog(mess) {
  if (showLog) {
    console.log(mess);
  }
}


export default {
  URLS,
  getRequest,
  showlog,
}
