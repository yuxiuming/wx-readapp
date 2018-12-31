// miniprogram/pages/homepage/homepage.js
var scanHandler = require("../utils/scanHandler.js");
var clouldFuncHandler = require("../utils/cloudfuncHandler.js");
var others = require("../utils/others.js");
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getRecommendBook();
    this.setUserInDB();
    if ("" == wx.getStorageSync("openid") || undefined == wx.getStorageSync("openid")) {
      this.doLogin();
    }
  },

  doLogin: function() {
    clouldFuncHandler.callCloudFunc("login", {}, function(data) {
      wx.setStorageSync("openid", data.result.openid);
    });
  },

  setUserInDB: function() {
    var info = wx.getStorageSync("userinfo");
    var userinfo = {
      _id: wx.getStorageSync("openid"),
      avatarUrl: info.avatarUrl,
      nickName: info.nickName
    };
    clouldFuncHandler.callCloudFunc("setUser", {
      userinfo: userinfo
    }, this.setUserCallBack);
  },
  setUserCallBack: function(data) {
    //console.log(data);
  },
  /**手动更新推荐 */
  onRefreshRecommend: function(data) {
    wx: wx.setStorageSync("lastRecommendDate", "");
    this.getRecommendBook();
  },

  getRecommendBook: function() {

    if ("" != wx.getStorageSync("lastRecommendDate") && "" != wx.getStorageSync("recommendbooks")) {
      /**比较上一次推荐的时间*/
      var lastRTime = wx.getStorageSync("lastRecommendDate");
      var now = new Date();
      if (now.getTime() - lastRTime < 24 * 60 * 60 * 1000) {
        this.setData({
          recombooks: wx.getStorageSync("recommendbooks")
        });
        return;
      }
    }
    wx.showLoading({
      title: '正在更新推荐书本....',
      mask: false
    });
    clouldFuncHandler.callCloudFunc("getRecommend", {}, this.getRecommendCallBack);

  },
  getRecommendCallBack: function(data) {
    //console.log(data.result.books);
    wx.setStorageSync("recommendbooks", data.result.books);
    this.setData({
      recombooks: data.result.books
    });
    wx.setStorageSync("lastRecommendDate", (new Date()).getTime());
    wx.hideLoading();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  onNameSearch: function(event) {
    console.log("-----onNameSearch----");
    wx.navigateTo({
      url: '../bookadd/bookadd?type=title',
    });
  },

  onScanSearch: function(event) {
    console.log("-----onScanSearch----");
    scanHandler.doScan(this.scanSearchCallBack);
  },
  scanSearchCallBack: function(data) {
    console.log("-----scanSearchCallBack----");
    //console.log(data);
    if (10 != (data.result.length) && 13 != (data.result.length)) {
      wx.showToast({
        title: '不是有效的书籍条形码。',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    this.doBookSearchISBN(data.result);

  },
  /*根据ISBN查询书*/
  doBookSearchISBN: function(searchISBN) {
    console.log("------doBookSearchISBN----");
    wx.showLoading({
      title: '书籍搜索中...',
    });
    clouldFuncHandler.callCloudFunc(app.gVar.cloudFuncs.g_searchBookByISBN, {
      isbn: searchISBN,
      userid: wx.getStorageSync("openid")
    }, this.doBookSearchCallBack);
  },
  doBookSearchCallBack: function(data) {
    //console.log(data);
    wx.hideLoading();
    if (undefined == data.result.book) {
      wx.showToast({
        title: '没找到相关书籍',
        icon: 'none',
        duration: 3000
      });
    } else {
      var tbook = data.result.book;
      tbook = others.getDBBookItem(tbook);

      //直接跳转到书本详情
      this.gotoBookDetail(tbook);
    }
  },
  onShowBookDetail: function(event) {
    this.gotoBookDetail(event.currentTarget.dataset.book);
  },
  gotoBookDetail: function(tbook) {
    wx.setStorageSync("editbook", tbook);
    wx.navigateTo({
      url: '../bookdetail/bookdetail'
    });
  },

  onrentBookTap: function(event) {
    wx.showToast({
      title: '功能还没开放...',
      icon: 'none',
      duration: 3000
    });
  }

})