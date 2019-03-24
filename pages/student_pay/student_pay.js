// pages/student_pay/student_pay.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sName:'',
    snumber:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    if (options !== undefined) {
      console.log(options.sname + ':' + options.snumber)
      that.data.sName = options.sname
      that.data.snumber = options.snumber
    }
    //需要检查缴费状态。如果已经缴费，直接跳过。
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
   * 缴费并且回到学生主页面
   */
  payClick: function(){
    var _this = this;
    wx.showLoading({
      title: '缴费中...',
    })

    setTimeout(function () {
      wx.hideLoading();
      wx.navigateTo({
        url: '/pages/index/index?snumber=' + _this.data.snumber + '&sname=' + _this.data.sName +'&studentPayStatus=1'
      })
    }, 5000)
  }
})