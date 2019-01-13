//index.js

//这个地方一定要注意了，路径一定要写正确，不要用系统提示的会报错，../../才是根路径
//获取应用实例  
const app = getApp()
var AppId = "wx347afc0cbbed78a1";
var AppSecret = '18aeefc8eaf3025db14281f5a44f29f4';
var WXBizDataCrypt = require('../../utils/cryptojs/RdWXBizDataCrypt.js'); 
//var WXBizDataCrypt = require('../../utils/WXBizDataCrypt')

var appId = 'wx4f4bc4dec97d474b'
var sessionKey = 'tiihtNczf5v6AKRyjwEUhQ=='
var regNum = new RegExp('[0-9]', 'g');


Page({
  data: {
    motto: 'Hello World fanyongjian',
    url: 'https://www.fanyongjian.top:8080/Ajax/mechanical_manager.ashx',
    token:'3fe686907939d07097f6c87f08025422',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    winWidth: 0,
    winHeight: 0,
    currentTab: 0,
    userInputMsg:'',//用户留言信息
    userInputSN: '',//用户学号信息
    userInputPW: '',//用户密码信息
    userInputPhone:'',//用户本机号码信息
    unionid:'',
    openId:'',
    encryptedData: '' ,
    oauserInfo:{},
    familyPhones: [{ id: 0, name: '', phone: '' }]
  },
  select: {
    page: 1,
    size: 6,
    isEnd: false
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  //加载数据
  onLoad: function () {
    var that = this
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          console.log('111111')
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    /**
     * 获取系统信息
     */
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }

    });

    //获取unionid
    wx.login({
      success: res => {
        //发起网络请求 
        wx.request({
          //这是我自己的java服务器的接口，将login（）获得的code发送的服务器换取session_key
          url: that.data.url,
          data: {
            js_code: res.code,
            action:'unionid'
          },
          header: {
            'content-type': 'application/json',
            'api-token': that.data.token
          },
          method: 'POST',
          success: function (res) {
            //console.log(res.data.Data)
            //console.log(res.data.Data.session_key)
            //拿到session_key实例化WXBizDataCrypt（）这个函数在下面解密用
            var pc = new WXBizDataCrypt(AppId, res.data.Data.session_key)
            wx.getUserInfo({
              success: function (res) {
                //console.log(res)
                //拿到getUserInfo（）取得的res.encryptedData, res.iv，调用decryptData（）解密
                var data = pc.decryptData(res.encryptedData, res.iv)
                // data.unionId就是咱们要的东西了
                //console.log(data)
                app.globalData.unionid = data.unionId
                app.globalData.openId = data.openId
                console.log('解密后 openId: ', app.globalData.openId)
                //获取OA用户信息
                wx.request({
                  url: that.data.url,
                  data: {
                    openId: app.globalData.openId,
                    action: 'wxgetuser'
                  },
                  header: {
                    'content-type': 'application/json',
                    'api-token': that.data.token
                  },
                  method: 'POST',
                  success: function (res) {
                    if (res.data.Data !== null) {
                      app.globalData.oauserInfo = res.data.Data
                      app.globalData.userInputSN = app.globalData.oauserInfo.stunumber
                      app.globalData.userInputPhone = app.globalData.oauserInfo.wxphone
                      //console.log(app.globalData.oauserInfo)
                      //console.log(app.globalData.userInputSN)
                      if(res.data.Data.contacts !== null){
                        console.log(res.data.Data.contacts)
                        //familyPhones: [{ id: 0, name: '', phone: '' }]
                        app.globalData.familyPhones = new Array()
                        for(var i= 0; i<res.data.Data.contacts.length; i++){
                          app.globalData.familyPhones.push({ id: i, name: res.data.Data.contacts[i].CPhoneName, phone: res.data.Data.contacts[i].Cphone })
                        }
                        that.setData({
                          familyPhones: app.globalData.familyPhones
                        })
                      }
                      that.setData({
                        oauserInfo: app.globalData.oauserInfo
                      })
                    }
                  }
                })
                //获取情亲号
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


  },
  //获取用户信息
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    console.log(this.data.userInfo)
  },
  //设置显示文本
  setTextShow:function(e){
    console.log(e)
    this.setData({
      motto:'1212'
    });
  },

  /**
     * 滑动切换tab
     */
  bindChange: function (e) {

    var that = this;
    that.setData({ currentTab: e.detail.current });
    console.log(e.detail.current)
  },

  /**
   * 点击tab切换
   */
  swichNav: function (e) {

    var that = this;

    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  //1.0获取用户输入的本机电话号码
  userPhoneInput: function (e) {
    var num = regNum.exec(e.detail.value)
    this.setData({
      userInputPhone:e.detail.value
    })
  },
  //1.0获取用户输入的本机电话号码
  userNameInput: function (e) {
    this.setData({
      userInputSN: e.detail.value
    })
  },
  //1.0获取用户输入的密码
  userPassInput:function(e){
    this.setData({
      userInputPW:e.detail.value
    })
  },
  //1.0绑定本机电话号码与学号信息
  passBtnClick:function(e){
    var _this = this
    var username = this.data.userInputSN
    var pwd = this.data.userInputPW
    var uPhone = this.data.userInputPhone
    if(app.globalData.openId == ''){
      wx.showModal({
        title: '提示',
        content: '获取用户信息失败！',
        success: function (res) {
        }
      })
      return
    }
    if (username == '') {
      wx.showModal({
        title: '提示',
        content: '请输入学号',
        success: function (res) {
        }
      })
      return
    }
    if (pwd == '') {
      wx.showModal({
        title: '提示',
        content: '请输入密码',
        success: function (res) {
        }
      })
      return
    }
    if(uPhone == '')
    {
      console.log('提示输入电话号码')
      wx.showModal({
        title: '提示',
        content: '请输本机电话号码',
        success: function (res) {
        }
      })
      return
    }
    wx.request({
      url: _this.data.url, // 仅为示例，并非真实的接口地址
        data: {
          action: 'wxlogin',
          uname: username,
          pwd: pwd,
          phone: uPhone,
          openId: app.globalData.openId
        },
        method:'POST',
        header: {
          'content-type': 'application/json',// 默认值
          'api-token': _this.data.token
        },
        success(res) {
          console.log(res.data)
          var showStr = ''
          if ("1" == res.data.Status) {
            showStr = '绑定成功！'
            _this.setData()
          } else {
            showStr = '绑定失败' + (res.data.Msg == null ? '' : '：' + res.data.Msg)
          }
          wx.showModal({
            title: '提示',
            content: showStr,
            success: function (res) {
              //缓存用户信息
              //用onLoad周期方法重新加载，实现当前页面的刷新
              _this.onLoad()
            }
          })
          _this.setData({
              //stunValue:res.data.Data.ClassName
          }
          )
        }
      })
  },
  //2.0添加亲情号
  phoneBtnClick:function(e){
    var arr = new Array();
    for (var i = 0; i < this.data.familyPhones.length;i++){
      arr.push({ id: this.data.familyPhones[i].id, name: this.data.familyPhones[i].name, phone: this.data.familyPhones[i].phone });   
    }
    arr.push({ id: this.data.familyPhones.length, name: '', phone: '' });
    this.setData({
      familyPhones: arr
    })
  },
  //2.0删除情亲号
  pDelBtnClick:function(e){
    var arr = new Array();
    var delId = e.currentTarget.dataset.id;
    console.log(delId);
    for (var i = 0; i < this.data.familyPhones.length; i++) {
      if (this.data.familyPhones[i].id == delId)
        continue
      arr.push({ id: this.data.familyPhones[i].id, name: this.data.familyPhones[i].name, phone: this.data.familyPhones[i].phone });
    }
    this.setData({
      familyPhones: arr
    })
  },
  //2.0修改情亲号名称
  fPhoneNameInput: function (e) {
    var pid = e.currentTarget.dataset.id;
    for (var i = 0; i < this.data.familyPhones.length; i++) {
      if (this.data.familyPhones[i].id == pid){
        this.data.familyPhones[i].name = e.detail.value
      }
    }
  },
  //2.0修改情亲号电话
  fPhoneNumberInput: function (e) {
    var pid = e.currentTarget.dataset.id;
    for (var i = 0; i < this.data.familyPhones.length; i++) {
      if (this.data.familyPhones[i].id == pid) {
        this.data.familyPhones[i].phone = e.detail.value
      }
    }
  },
  //2.0修改情亲号
  pMBtnClick: function (e) {
    var _this = this
    var snumber = app.globalData.userInputSN
    //console.log(this.data.userInputSN)
    console.log(app.globalData.userInputSN)
    var cphoneStr = '';
    var cnameStr = '';
    for (var i = 0; i < this.data.familyPhones.length; i++) {
        cphoneStr += this.data.familyPhones[i].phone
        cnameStr += this.data.familyPhones[i].name
      if (i <= this.data.familyPhones.length-1){
        cphoneStr += ','
        cnameStr += ','
      }
    }

    var data = { sNumber: snumber, cPhone: cphoneStr, cPhoneName: cnameStr, action: 'setcontact', unionid: '', cPhone2: '', cPhone3: '', cPhone4: '',  }
    console.log(data)
    wx.getUserInfo({
      success: function (res) {
        console.log({ encryptedData: res.encryptedData, iv: res.iv, code: '' })
      }
    })

    wx.request({
      url: _this.data.url, // 仅为示例，并非真实的接口地址
      data: data,
      method: 'POST',
      header: {
        'content-type': 'application/json',// 默认值
        'api-token': _this.data.token
      },
      success(res) {
        console.log(res.data)
        var showStr = ''
        if ("1" == res.data.Status) {
          showStr = '修改成功！'
        } else {
          showStr = '修改失败' + (res.data.Msg == null ? '' : '：' + res.data.Msg)
        }
        wx.showModal({
          title: '提示',
          content: showStr,
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
              //用onLoad周期方法重新加载，实现当前页面的刷新
              _this.onLoad()
            } else {
              console.log('用户点击取消')
            }
          }
        })
      }
    })
  },
  //3.0获取用户输入的信息
  textareaInputMsg: function (e) {
    this.setData({
      userInputMsg: e.detail.value
    })
  },
  //3.0提交用户信息
  addMsgBtn: function (e) {
    //console.log(this.data.userInfo)
    var _this = this
    var msg = this.data.userInputMsg
    var snumber = app.globalData.userInputSN
    if(msg == ''){
      return
    }
    var data = { student: snumber, phonenumber: app.globalData.userInputPhone, message: msg, action: 'setmsg', unionid: '' }
    //console.log(data)
    wx.getUserInfo({
      success: function (res) {
        console.log({ encryptedData: res.encryptedData, iv: res.iv, code: '' })
      }
    })
    wx.request({
      url: _this.data.url, // 仅为示例，并非真实的接口地址
      data: data,
      method: 'POST',
      header: {
        'content-type': 'application/json',// 默认值
        'api-token': _this.data.token
      },
      success(res) {
        console.log(res.data)
        var showStr = ''
        if ("1" == res.data.Status){
          showStr = '留言成功！'
          _this.setData({
            userInputMsg: ''
          })
        } else {
          showStr = '留言失败' + (res.data.Msg == null ? '' :'：'+res.data.Msg)
        }
        wx.showModal({
          title: '提示',
          content: showStr,
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else {
              console.log('用户点击取消')
            }

          }
        })
      }
    })
  },
})
