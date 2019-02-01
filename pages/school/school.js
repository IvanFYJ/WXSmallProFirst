// pages/school/school.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    schools: [{ sid: 1, sname: '' }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    //发起网络请求 
    wx.request({
      //这是我自己的java服务器的接口，将login（）获得的code发送的服务器换取session_key
      url: app.globalData.oaurl,
      data: {
        shid: "",
        action: 'getschool'
      },
      header: {
        'content-type': 'application/json',
        'api-token': app.globalData.token
      },
      method: 'POST',
      success: function (res) {
        //console.log(res)
        if (res.data.data !== null) {
          _this.data.schools = new Array()
          console.log(res.data.Data)
          for (var i = 0; i < res.data.Data.length; i++) {
            _this.data.schools.push({ sid: res.data.Data[i].ID, sname: res.data.Data[i].Name })
          }
          _this.setData({
            schools: _this.data.schools
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
   * 跳转到年级
   */
  forthgrade: function (e) {
    //console.log('跳转到学生界面')
    var sid = e.currentTarget.dataset.id;
    var sname = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: '/pages/grade/grade?sid=' + sid+'&sname='+sname
    })
  }
})