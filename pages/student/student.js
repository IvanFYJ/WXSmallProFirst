// pages/student/student.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    students:[],
    gname:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var _this = this;
    var gid = options.gid
    //发起网络请求 
    wx.request({
      //这是我自己的java服务器的接口，将login（）获得的code发送的服务器换取session_key
      url: app.globalData.oaurl,
      data: {
        gid: gid,
        action: 'getstudentbygid'
      },
      header: {
        'content-type': 'application/json',
        'api-token': app.globalData.token
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        if (res.data.data !== null) {
          _this.data.students = new Array()
          console.log(res.data.Data.length)
          _this.data.gname = res.data.Data[0].Gname
          for (var i = 0; i < res.data.Data.length; i++) {
            _this.data.students.push({ sid: res.data.Data[i].Sid, snumber: res.data.Data[i].Snumber, sname: res.data.Data[i].Sname })
          }
          _this.setData({
            students: _this.data.students,
            gname: _this.data.gname
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * 为学生公共电话充值
   */
  payforstudent: function(e){
    var snum = e.currentTarget.dataset.snumber;
    wx.showLoading({
      title: '正在充值中...',
    })

    setTimeout(function () {
      wx.hideLoading()
      wx.showToast({
        title: '充值成功!',
        icon: 'success',
        duration: 2000
      })
    }, 5000)
  }
})