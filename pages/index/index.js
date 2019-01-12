//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World fanyongjian',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    winWidth: 0,
    winHeight: 0,
    currentTab: 0,
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
        console.log(res.windowHeight)
      }

    });
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
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
  passBtnClick:function(e){
    var _this = this
    wx.request({
      url: 'https://www.fanyongjian.top:8080/Ajax/mechanical_manager.ashx', // 仅为示例，并非真实的接口地址
        data: {
          action: 'student',
          pageIndex: 1,
          pageSize:50,
          mPhone:'15919964021'
        },
        method:'POST',
        header: {
          'content-type': 'application/json',// 默认值
          'api-token':'3fe686907939d07097f6c87f08025422'
        },
        success(res) {
          console.log(res.data)
          _this.setData({
            stunValue:res.data.Data.ClassName
          })
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000
          })
        }
      })
  },
  getData: function () {
    var _this = this;
    if (this.select.isEnd) {
      return
    }
    return;
    var type = this.data.currentTab == 0 ? 'ALL' : this.data.currentTab == 1 ? 'WAIT_DELIVER' : 'DELIVER';
    util.request(`你的接口地址，后面的是参数` + type + `/` + this.select.page + `/` + this.select.size, {}, 'GET', function (res) {
      var content = res.data.data;
      _this.setData({
        sendList: (_this.data.sendList).concat(content)
      })
      if (content.length > 0) {
        _this.select.page++
      } else {
        _this.select.isEnd = true
      }
    })
  },
})
