//app.js

var WXBizDataCrypt = require('./utils/cryptojs/RdWXBizDataCrypt.js'); 

App({
  onLaunch: function () {
    var _this = this;
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        //发起网络请求 
        wx.request({
          //这是我自己的java服务器的接口，将login（）获得的code发送的服务器换取session_key
          url: this.globalData.oaurl,
          data: {
            js_code: res.code,
            action: 'unionid'
          },
          header: {
            'content-type': 'application/json',
            'api-token': this.globalData.token
          },
          method: 'POST',
          success: function (res) {
            //console.log(res.data.Data)
            //console.log(res.data.Data.session_key)
            //拿到session_key实例化WXBizDataCrypt（）这个函数在下面解密用
            var pc = new WXBizDataCrypt(_this.globalData.appId, res.data.Data.session_key)
            _this.globalData.encryptedObject = pc
            wx.getUserInfo({
              success: function (res) {
                //console.log(res)
                //拿到getUserInfo（）取得的res.encryptedData, res.iv，调用decryptData（）解密
                var data = pc.decryptData(res.encryptedData, res.iv)
                // data.unionId就是咱们要的东西了
                //console.log(data)
                _this.globalData.unionid = data.unionId
                _this.globalData.openId = data.openId
              },
              fail: function (res) {
                console.log(res)
              }
            })
          },
          fail: function (res) { },
          complete: function (res) { }
        });
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    oaurl:'https://www.fanyongjian.top:8080/Ajax/mechanical_manager.ashx',
    //oaurl: 'http://localhost:2398/Ajax/mechanical_manager.ashx',
    token:'3fe686907939d07097f6c87f08025422',
    appId: 'wx466c0417b7717fcd',
    sessionKey:'7351c79ffa24f6d706b1fd962ababc8d',
    openId:'',
    encryptedObject:{}
  }
})