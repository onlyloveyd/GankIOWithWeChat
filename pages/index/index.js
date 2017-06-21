
var util = require('../../utils/util')
var curPageIndex = [-1, -1, -1]
var tabInitState= [false,false,false]
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置

Page({
  data: {
    gankData: {},
    loadingHidden: false,
    curSelClassifyIndex: 0,

    tabs: ["Android", "iOS", "App"],
    sliderOffset: 0,
    sliderLeft: 0
  },
  onLoad: function() {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.curSelClassifyIndex
        });
      }
    });
    this.checkInitLoadGankData()
  },

  // 检查初始化加载干货数据（根据不同类别）
  checkInitLoadGankData: function () {
    if (tabInitState[this.data.curSelClassifyIndex]) return
    var tmpIndex = this.data.curSelClassifyIndex
    console.log("yidong -- tmpIndex= " + tmpIndex)
    var curClassifyName = this.getClassifyName(tmpIndex)
    console.log("yidong -- name = " + curClassifyName)
    this.loadGankData(1, curClassifyName, results => {
      curPageIndex[tmpIndex]++
      console.log("yidong -- results = " + results)
      this.data.gankData[curClassifyName] = results
      this.setData({
        loadingHidden: true,
        gankData: this.data.gankData
      })
      tabInitState[tmpIndex]= true
    })
  },

  // 加载干货数据
  loadGankData: function(pageNo, type, callback) {
    // 获取干货列表数据
    console.log("yidong -- url = " + 'http://gank.io/api/data/' + type + '/10/' + pageNo)
    wx.request({
      url: 'http://gank.io/api/data/' + type + '/10/' + pageNo,
      header: {
        'Content-Type': 'application/json'
      },
      success: res => {
        // 格式化日期
        res.data.results.map(gankInfo => {
          gankInfo.publishedAt = util.formatSimpleTime(gankInfo.publishedAt)
        })
        console.log("yidong -- res = " + res.data.results)
        callback(res.data.results)
      }
    })
  },
  // 滚动到列表底部监听
  onBindscrolltolower: function(e) {
    console.log("yidong -- onBindscrolltoLower")
    var tempIndex = this.data.curSelClassifyIndex
    var curClassifyName = this.getClassifyName(tempIndex)
    this.loadGankData(curPageIndex[tempIndex], curClassifyName, results => {
      curPageIndex[this.data.curSelClassifyIndex] ++
      this.data.gankData[curClassifyName] = this.data.gankData[curClassifyName].concat(results)
      this.setData({
        gankData: this.data.gankData
      })
    })
  },
  // swiper 滚动改变监听
  onBindchange: function(e) {
    this.checkInitLoadGankData()
    console.log("yidong  = " + e.detail.current)

    this.setData({
      curSelClassifyIndex: e.detail.current,
    })
  },
  /**
   * 获取分类名称
   * @param isApiName 是否是干货api需要的请求 url 名称
   */
  getClassifyName: function(index) {
    console.log("yidong -- index = " + index)
    if(index==0){
      return "Android"
    } else if(index==1) {
      return "iOS"
    } else if(index==2) {
      return "App"
    } else {
      return "Android"
    }
  },  
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      curSelClassifyIndex: e.currentTarget.id
    });
  },
  showToast: function () {
    wx.showToast({
      title: '暂不支持',
      icon: 'warning',
      duration: 1000
    })
  },
})
