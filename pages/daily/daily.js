var util = require('../../utils/util')

Page({
  data: {
    bannerPicUrl: null,
    recommendData: [],
    recommendHistoryData: [],
    loadingHidden: false,
    currentTime: ''
  },
  onLoad: function () {
    this.loadGankRecommendHistoryData(results => {
      this.setData({
        recommendHistoryData: results
      })

      var latestDate = new Date(results[0])
      this.loadGankRecommendData(latestDate.getFullYear(), latestDate.getMonth() + 1, latestDate.getDate(), (bannerPicUrl, results) => {
        this.setData({
          bannerPicUrl: bannerPicUrl,
          recommendData: results,
          loadingHidden: true
        })
      })
    })
  },
  // 获取 gank 的推荐历史数据
  loadGankRecommendHistoryData: function (callback) {
    wx.request({
      url: 'http://gank.io/api/day/history',
      header: {
        'Content-Type': 'application/json'
      },
      success: res => callback(res.data.results)
    })
  },
  // 获取 gank 的每日推荐数据
  loadGankRecommendData: function (y, m, d, callback) {
    wx.request({
      url: 'http://gank.io/api/day/' + y + '/' + m + '/' + d,
      header: {
        'Content-Type': 'application/json'
      },
      success: res => {
        this.convertData(res.data.category, res.data.results, callback)
        // 设置推荐数据日期
        this.setData({
          currentTime: '日期：' + y + '/' + m + '/' + d
        })
      }
    })
  },
  // 数据转换
  convertData: function (category, gankRecommendData, callback) {
    category.sort() // 按名称排序
    var categoryInfos = []
    var bannerPicUrl;
    category.map(categoryName => {
      var curCategoryInfoList = gankRecommendData[categoryName]
      if (categoryName === '福利') {
        bannerPicUrl = curCategoryInfoList[0].url
        bannerPicUrl = bannerPicUrl.replace('http://ww', 'http://ws')
      }
      categoryInfos.push({
        categoryName: categoryName,
        list: curCategoryInfoList
      })
    })

    callback(bannerPicUrl, categoryInfos)
  },
  // 选择历史推荐日期监听
  onSelRecommendTimeChange: function (newTime) {
    var curDate = new Date(this.data.recommendHistoryData[newTime.detail.value])
    wx.showNavigationBarLoading()
    this.loadGankRecommendData(curDate.getFullYear(), curDate.getMonth() + 1, curDate.getDate(), (bannerPicUrl, results) => {
      this.setData({
        bannerPicUrl: bannerPicUrl,
        recommendData: results
      })
      wx.hideNavigationBarLoading()
    })
  },
  showToast: function () {
    wx.showToast({
      title: '暂不支持',
      icon: 'warning',
      duration: 1000
    });
  },
})