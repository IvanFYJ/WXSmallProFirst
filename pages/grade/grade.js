// pages/grade/grade.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    grades:[{gid:1,gname:''}],
    shoolname:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.sname)
    //console.log(app.globalData.token)
    var _this = this;
    //发起网络请求 
    wx.request({
      //这是我自己的java服务器的接口，将login（）获得的code发送的服务器换取session_key
      url: app.globalData.oaurl,
      data: {
        shid: options.sid,
        action: 'getgrade'
      },
      header: {
        'content-type': 'application/json',
        'api-token': app.globalData.token
      },
      method: 'POST',
      success: function (res){
        //console.log(res)
        if(res.data.data !== null){
          _this.data.grades = new Array()
          //console.log(res.data.Data.length)
          for (var i = 0; i < res.data.Data.length; i++) {
            _this.data.grades.push({ gid: res.data.Data[i].ID, gname: res.data.Data[i].Name })
          }
          _this.setData({
            grades: _this.data.grades,
            shoolname:options.sname
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
   * 跳转到班级
   */
  forthclass:function(e){
    //console.log('跳转到学生界面')
    var gid = e.currentTarget.dataset.id;
    var gname = e.currentTarget.dataset.name 
    console.log(gname)
    wx.navigateTo({
      //url: '/pages/student/student?gid='+gid
      url: '/pages/class/class?gid=' + gid +'&schoolname='+this.data.shoolname + '&gname=' + gname
    })
  }
})