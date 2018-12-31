// miniprogram/pages/bookadd/bookadd.js

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

    console.log("---on page:bookadd --");
    /**进入界面时展示的是书本项目，但不展示搜索结果，清空搜索结果*/
    this.setData({
      isShowSearchResult: false,
      iscleariconshow: false
    });
    this.setData({
      books: null
    });
    this.setData({ currentSearchTitle: "" });
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
    if ("" !== this.data.currentSearchTitle){
      this.doBookSearchByTitle(this.data.currentSearchTitle);
    }
    
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



  /**调用云函数查询书籍 */
  onBookSearchSubmit: function(event) {
    console.log("------onBookSearchSubmit----");
    //console.log(event.detail.value);
    var searchTitle = event.detail.value;
    this.setData({ currentSearchTitle: searchTitle});
    this.doBookSearchByTitle(searchTitle);
  },
  /*根据标题查询书*/
  doBookSearchByTitle: function(searchTitle) {
    console.log("------doBookSearchByTitle----");
    this.setData({
      isShowSearchResult: false
    });
    this.setData({
      resultTip: "正在搜索 " + searchTitle + " ，请稍后..."
    });
    clouldFuncHandler.callCloudFunc(app.gVar.cloudFuncs.g_searchBookByName, {
      title: searchTitle,userid:wx.getStorageSync("openid")
    }, this.doBookSearchCallBack);
  },


  doBookSearchCallBack: function(data) {
    console.log("------doBookSearchCallBack----");
    //console.log(data);

    var targetBooks = new Array();

    var books = data.result.books;
    //console.log(books.length); 
    for (var index in books) {
      var targetBook = others.getDBBookItem(books[index]);
      //console.log(targetBook);
      targetBooks.push(targetBook);
    }

    this.setData({
      resultTip: "共找到了 " + targetBooks.length + " 本书。"
    });
    this.setData({
      books: targetBooks
    });
    this.setData({
      isShowSearchResult: true
    });

  },


  //点击添加到我的书库
  onShowBookDetail: function(event) {
    //console.log(event);
    var tbook = event.currentTarget.dataset.book;

    //console.log(tbook);

    wx.setStorageSync("editbook", tbook);
    wx.navigateTo({
      url: '../bookdetail/bookdetail'
    });


  },

  /**设置清空ICON是否显示 */
  onInputChange: function(event) {
    //console.log(event);
    if (event.detail.value == "") {
      this.setData({
        iscleariconshow: false
      });
    } else {
      this.setData({
        iscleariconshow: true
      });
    }
  },
  /**清空搜索输入框*/
  onClearTap: function(event) {
    this.setData({
      bookname_value: "",
      iscleariconshow: false
    });
  }


})