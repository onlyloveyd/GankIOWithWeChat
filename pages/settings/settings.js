Page({
  data: {
    userInfo: {}
  },
  onLoad: function () {
    wx.login({
      success: res => {
        wx.getUserInfo({
          success: res => {
            this.setData({
              userInfo: res.userInfo
            })
          }
        })
      }
    })
  },
  onPullDownRefresh: function () {
    console.log('下拉刷新...')
  }
})