// miniprogram/pages/auth/auth.js
var others = require("../utils/others.js");
var clouldFuncHandler = require("../utils/cloudfuncHandler.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad() {
    
    // 查看是否授权
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success(res) {
              //console.log(res.userInfo)
              wx.setStorageSync("userinfo", res.userInfo);
              wx.switchTab({
                url: '/pages/homepage/homepage'
              });

            },
            fail(res) {
              others.showMsg("请先授权登录。");
              return;
            }
          });
        }
      }
    })
  },
  bindGetUserInfo(e) {
    //console.log(e.detail.userInfo)
    wx.setStorageSync("userinfo", e.detail.userInfo);
    wx.switchTab({
      url: '/pages/homepage/homepage'
    });

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

  }
})