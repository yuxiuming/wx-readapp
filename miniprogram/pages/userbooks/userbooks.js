// miniprogram/pages/userbooks/userbooks.js
var app = getApp();
var others = require("../utils/others.js");
var clouldFuncHandler = require("../utils/cloudfuncHandler.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    selected: "#4D9EB3",
    notSelected: "grep",
    statusTxt: ["想读", "在读", "读过", "弃读"],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({ currentStatus: 0 });
  },

  getUserBooks: function(status) {
    this.setData({
      userxbooks:[],
      ubbooktips: "正在加载数据......",
      currentStatus: status
    });
    clouldFuncHandler.callCloudFunc("getUserBooks", {
      userid: wx.getStorageSync("openid"),
      readstatus: status
    }, this.onLoadCallBack);
  },

  onLoadCallBack: function(data) {
    //console.log(data);
    var arr = data.result;
    /**排序 */
    if (arr.length > 0) {
      arr.sort(function(a, b) {
        var atime = new Date((a.timestr + "-01").replace(/-/, "/"));
        var btime = new Date((b.timestr + "-01").replace(/-/, "/"));
        return atime < btime;
      });
      /**计算书本总数 */
      var total=0;
      for (let index in arr) {
        total=total+arr[index].books.length
      }
      this.setData({
        ubbooktips: "目前，您有"+total+"本 " + this.data.statusTxt[this.data.currentStatus] + " 的书。",
      });
      this.setData({
        userxbooks: arr
      });

    } else {
      this.setData({
        ubbooktips: "您还没有 " + this.data.statusTxt[this.data.currentStatus] + " 的书本哦...",
      });
    }



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
    this.setStatusTextColor(this.data.currentStatus);
    this.getUserBooks(this.data.currentStatus);
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

  onStatusTap: function(event) {
    //console.log(event);
    var status = event.currentTarget.dataset.status;

    if (this.data.currentStatus != status) {
      this.setStatusTextColor(status);
      this.getUserBooks(status);
    }

  },

  setStatusTextColor: function(status) {
    this.setData({
      colorSt0: this.data.notSelected,
      colorSt1: this.data.notSelected,
      colorSt2: this.data.notSelected,
      colorSt3: this.data.notSelected
    });
    if (0 == status) {
      this.setData({
        colorSt0: this.data.selected
      });
    } else if (1 == status) {
      this.setData({
        colorSt1: this.data.selected
      });
    } else if (2 == status) {
      this.setData({
        colorSt2: this.data.selected
      });
    } else if (3 == status) {
      this.setData({
        colorSt3: this.data.selected
      });
    }
  },
  onShowBookDetail:function(data){
    //console.log(data);
    wx.setStorageSync("editbook", data.currentTarget.dataset.book);
    wx.navigateTo({
      url: '../bookdetail/bookdetail'
    });
  }
})