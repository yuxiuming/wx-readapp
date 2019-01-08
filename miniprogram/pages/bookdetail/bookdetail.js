// miniprogram/pages/bookdetail/bookdetail.js
var app = getApp();
var others = require("../utils/others.js");
var clouldFuncHandler = require("../utils/cloudfuncHandler.js");
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
    /**先判断目标书本是否在我的书库中 */
    var userid = wx.getStorageSync("openid");
    var ebook = wx.getStorageSync("editbook");
    this.setData({
      editbook: ebook,
      userid: userid
    });

    this.setData({
      isshowtype: false,
      isedittype: false
    });

    var bookSummFold = {
      txt: "内容介绍",
      isopen: false,
      func: "onGetBookDescTap"
    };
    this.setData({
      isBookSummShow: false,
      booksummary: "",
      booksummfold: bookSummFold
    });

    this.loadUserXBook(userid);

    var bookImpressFold = {
      txt: "书本印象",
      isopen: true,
      func: "onBookPressTap"
    };
    this.setData({
      bookimpressfold: bookImpressFold
    });
    this.loadBookNote(userid);
    var myNotesFold = {
      txt: "我的读书小记",
      isopen: true,
      func: "onGetBookNoteTap"
    };
    this.setData({
      mynotesfold: myNotesFold
    });

    this.loadBookNote(userid);
    var otherNotesFold = {
      txt: "其他用户的小记",
      isopen: true,
      func: "onShowOtherNotesTap"
    };
    this.setData({
      othernotesfold: otherNotesFold,
      otherpagenotes: null
    });
    this.loadOtherBookNote(userid);

    this.loadUserBookLove(userid);
  },

  /**书本印象的收起和展开 */
  onBookPressTap: function() {
    if (this.data.isshowtype || this.data.isedittype) {
      this.data.bookimpressfold.isopen = false;
      this.setData({
        bookimpressfold: this.data.bookimpressfold,
        isshowtype: false,
        isedittype: false
      });
    } else {
      this.loadUserXBook(this.data.userid);
      this.data.bookimpressfold.isopen = true;
      this.setData({
        bookimpressfold: this.data.bookimpressfold
      });
    }
  },
  /**我的读书小记的收起和展开 */
  onGetBookNoteTap: function() {
    if (this.data.isNoteShowType || this.data.isNoteEditType) {

      this.data.mynotesfold.isopen = false;
      this.setData({
        mynotesfold: this.data.mynotesfold,
        isNoteShowType: false,
        isNoteEditType: false
      });
    } else {
      this.loadBookNote(this.data.userid);
      this.data.mynotesfold.isopen = true;
      this.setData({
        mynotesfold: this.data.mynotesfold
      });
    }
  },

  /**其他用户小记的收起与展示 */
  onShowOtherNotesTap: function() {
    if (this.data.isOtherNoteShow) {
      this.data.othernotesfold.isopen = false;
      this.setData({
        isOtherNoteShow: false,
        othernotesfold: this.data.othernotesfold
      })
    } else {
      this.data.othernotesfold.isopen = true;
      this.setData({
        isOtherNoteShow: true,
        othernotesfold: this.data.othernotesfold
      });
      this.loadOtherBookNote(wx.getStorageSync("openid"));
    }

  },
  /**加载用户是否喜欢这本书 */
  loadUserBookLove: function(userid) {
    clouldFuncHandler.callCloudFunc("getBookLove", {
      userid: userid,
      bookid: this.data.editbook.isbn13
    }, this.onLoadUserBookLoveCallBack);
  },
  onLoadUserBookLoveCallBack: function(data) {
    //console.log(data);
    if (0 == data.result.data.length) {
      this.data.editbook["loveit"] = false;
    } else if (1 == data.result.data.length) {
      this.data.editbook["loveit"] = true;
    }
    this.setData({
      editbook: this.data.editbook
    });
  },
  onLoveThisBookTap: function(event) {
    //console.log(event);
    var isLove = event.currentTarget.dataset.islove;
    clouldFuncHandler.callCloudFunc("setBookLove", {
      userid: wx.getStorageSync("openid"),
      bookid: this.data.editbook.isbn13,
      loveit: isLove
    }, this.onSetBookLoveCallBack);
  },
  onSetBookLoveCallBack: function(data) {
    //console.log(data);
    this.loadUserBookLove(wx.getStorageSync("openid"));
  },

  loadUserXBook: function(userid) {
    this.setData({
      userinfoTip: "正在加载信息......"
    });
    clouldFuncHandler.callCloudFunc("getUserXBook", {
      _id: userid + "_" + this.data.editbook.isbn13
    }, this.onLoadUserXBookCallBack);
  },

  onLoadUserXBookCallBack: function(data) {
    //console.log(data);
    if (0 < data.result.data.length) {
      //如果用户已经把书添加到自己的书库中
      this.setData({
        dbtags: data.result.data[0].tags
      });
      this.setData({
        readinfo: data.result.data[0].readinfo
      });
      this.showUserBookInfo();
      this.setData({
        isshowtype: true
      });
      this.setData({
        isedittype: false
      });

    } else {
      /**书本还没加入到书库*/
      this.setData({
        isshowtype: false
      });
      this.setData({
        isedittype: true
      });

      this.setData({
        tags: app.gVar.editBook.defaltTags
      });
      this.setData({
        dbtags: []
      });

      this.setData({
        datedesc: "请输入日期"
      });
      this.setData({
        isShowDatePicker: false
      });
      this.setData({
        isShowNumInput: false
      });
    }
    this.setData({
      userinfoTip: ""
    });
  },

  loadBookNote: function(userid) {
    this.setData({
      notetitle: "正在加载读书小记...",
      isNoteShowType: true,
      isNoteEditType: false,
      pagenotes: null
    });
    clouldFuncHandler.callCloudFunc("getBookNotes", {
      userid: userid,
      isbn13: this.data.editbook.isbn13
    }, this.onLoadBookNoteCallBack);
  },

  onLoadBookNoteCallBack: function(data) {
    //console.log(data);
    var pageNotesArr = data.result;
    if (pageNotesArr.length > 0) {
      pageNotesArr.sort(function(a, b) {
        return parseInt(a.pagenum) < parseInt(b.pagenum);
      });
      this.setData({
        notetitle: "",
        pagenotes: pageNotesArr
      });
    } else {
      this.setData({
        notetitle: "还没为这本书写过小记哟。",
        pagenotes: false
      });
    }
  },

  loadOtherBookNote: function(userid) {
    if (null == this.data.otherpagenotes || undefined == this.data.otherpagenotes) {
      this.setData({
        othernotetitle: "正在加载读书小记..."
      });
    }
    this.setData({
      isOtherNoteShow: true,
    });
    clouldFuncHandler.callCloudFunc("getOtherNotes", {
      userid: userid,
      isbn13: this.data.editbook.isbn13
    }, this.onLoadOtherBookNoteCallBack);
  },
  onLoadOtherBookNoteCallBack: function(data) {
    //console.log("onLoadOtherBookNoteCallBack");
    //console.log(data);
    var pageNotesArr = data.result;
    if (pageNotesArr.length > 0) {
      pageNotesArr.sort(function(a, b) {
        return parseInt(a.pagenum) > parseInt(b.pagenum);
      });
      this.setData({
        othernotetitle: "",
        otherpagenotes: pageNotesArr
      });
    } else {
      this.setData({
        othernotetitle: "其他用户还没为这本书写小记呢。",
        otherpagenotes: false
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

  /**函数处理是否展示自定义标签输入框 */
  onCustomTagTap: function(evnet) {
    this.setData({
      isShowCustomTagInput: !(this.data.isShowCustomTagInput)
    });
  },

  /*点击标签时的处理*/
  onTagTap: function(event) {
    console.log("---onTagTap---");
    //console.log(event);
    var dbTagsSet = new Set(this.data.dbtags);
    var targetTag = event.currentTarget.dataset.tag;
    //console.log(targetTag);
    if (!targetTag.isShow && dbTagsSet.size < 10) {
      /**更新界面显示列表 */
      this.updateShowTags(1, targetTag, (!targetTag.isShow));
      /**如果tag被选中且tag的个数没达到上限，则在dbTagsSet添加标签*/
      dbTagsSet.add(targetTag.name);
    } else if (!targetTag.isShow && dbTagsSet.size >= 10) {
      /**如果标签个数已经达到上限 */
      others.showMsg('标签个数已经达到上限。');
      return;
    } else {
      /**更新界面显示列表 */
      this.updateShowTags(1, targetTag, (!targetTag.isShow));
      /**删除在dbTagsSet中标签*/
      dbTagsSet.delete(targetTag.name);
    }

    this.setData({
      dbtags: Array.from(dbTagsSet)
    });
    //console.log(dbTagsSet);
  },

  onAddCustomTag: function(event) {
    //console.log(event.detail.value.length);
    var newTagValue = event.detail.value.trim();
    /**判断标签长度是否合法 */
    if (newTagValue.length > 10 || 0 == newTagValue.length) {
      others.showMsg('标签长度不能为空或大于10个字符。');
      return;
    }
    /**判断已选择标签的个数是否已经达到上限 */
    if (this.data.dbtags.length >= 10) {
      others.showMsg('标签个数已经达到上限。');
      return;
    }
    var targetTag = {
      name: newTagValue,
      isShow: true
    };

    if (this.isAlreadyInShowTags(targetTag.name)) {
      /**如果标签已经在显示列表中，那么把原有标签标记已选择*/
      this.updateShowTags(1, targetTag, true);
    } else {
      /**更新界面显示列表 */
      this.updateShowTags(2, targetTag);
    }

    /**更新书本的标签 */
    var dbTagsSet = new Set(this.data.dbtags);
    dbTagsSet.add(newTagValue);
    this.setData({
      dbtags: Array.from(dbTagsSet)
    });
    this.setData({
      tagname_value: ""
    });
    //console.log(this.data.dbtags);

  },
  /**更新标签界面显示列表 */
  updateShowTags: function(type, targetTag, flag) {
    var tmptags = this.data.tags;
    if (1 == type) {
      for (let index in tmptags) {
        if (tmptags[index].name == targetTag.name) {
          tmptags[index].isShow = flag;
          break;
        }
      }
    } else if (2 == type) {
      tmptags.push(targetTag);
    }

    this.setData({
      tags: tmptags
    });
  },
  /**判断标签是否已经存在于展示列表中 */
  isAlreadyInShowTags: function(newTagValue) {
    var tmptags = this.data.tags;
    for (let index in tmptags) {
      if (tmptags[index].name == newTagValue) {
        return true;
      }
    }
    return false;
  },

  onReadStatusChg: function(event) {
    //console.log(event);
    var status = event.detail.value;
    if (1 == status) {
      this.setData({
        isShowDatePicker: false
      });
      this.setData({
        isShowNumInput: true
      });
    } else if (2 == status) {
      this.setData({
        isShowDatePicker: true
      });
      this.setData({
        isShowNumInput: false
      });
    } else {
      this.setData({
        isShowDatePicker: false
      });
      this.setData({
        isShowNumInput: false
      });
    }

  },

  onDateChange: function(event) {
    //console.log(event);
    this.setData({
      datedesc: event.detail.value
    });


  },

  onBookAddSubmit: function(event) {
    //console.log(event);

    /**标签列表不能为空 */
    if (0 == this.data.dbtags.length) {
      others.showMsg('请至少选择一个标签。');
      return;
    }

    /**判断用户OPENID */
    var openid = wx.getStorageSync("openid")
    /**获取阅读状态 */
    var timeStr = others.getNowMonth();
    var hasReadNum = 0;
    var readStatus = event.detail.value.readStatus;
    if (1 == readStatus) {
      //readStatus==1表示 正在读
      hasReadNum = event.detail.value.hasReadNum;
      //console.log(this.data.editbook.pages + "----" + hasReadNum);
      if (!this.checkPageNum(hasReadNum)) {
        others.showMsg('您输入的页数有误');
        return;
      }
    }
    if (2 == readStatus) {
      //readStatus==1表示 读过
      timeStr = event.detail.value.date;
      if (null == timeStr || others.compareNowMonth(timeStr)) {
        others.showMsg('您输入的日期有误');
        return;
      }

    }
    var readinfo = {
      readstatus: readStatus,
      time: timeStr,
      hasreadnum: hasReadNum
    };
    this.setData({
      readinfo: readinfo
    });

    var userXBook = {
      _id: openid + "_" + this.data.editbook.isbn13,
      userXBook: {
        userid: openid,
        isbn13: this.data.editbook.isbn13,
        tags: this.data.dbtags,
        readinfo: readinfo
      }
    };

    //console.log(userXBook);
    clouldFuncHandler.callCloudFunc("setBookInDB", {
      book: this.data.editbook,
      userxbook: userXBook
    }, this.addBookCallBack);
  },

  addBookCallBack: function(data) {
    //console.log(data);
    if ("OK" == data.result.result) {
      this.showUserBookInfo();
    }
  },
  onCancelBookAddTap: function(event) {
    this.setData({
      isshowtype: false,
      isedittype: false
    });
    this.loadUserXBook(this.data.userid);
  },

  showUserBookInfo: function() {
    this.setData({
      isshowtype: true
    });
    this.setData({
      isedittype: false
    });
    var readinfo = this.data.readinfo;
    var readstatus = "";
    var readotherinfo = "";
    if (0 == readinfo.readstatus) {
      readstatus = "想读";
    } else if (1 == readinfo.readstatus) {
      readstatus = "正在读";
      readotherinfo = " 进度:" + readinfo.hasreadnum + "/" + this.data.editbook.pages
    } else if (2 == readinfo.readstatus) {
      readstatus = "读过";
      readotherinfo = " 时间是:" + readinfo.time
    } else if (3 == readinfo.readstatus) {
      readstatus = "弃读";
    }
    this.setData({
      readstatus: readstatus
    });
    this.setData({
      readotherinfo: readotherinfo
    });
    //readstatusdesc

  },

  onUserRBookInfoEdit: function(event) {
    console.log("-----onUserRBookInfoEdit---");

    var readinfo = this.data.readinfo;
    var tags = this.data.dbtags;

    this.setData({
      readStatus0: false,
      readStatus1: false,
      readStatus2: false,
      readStatus3: false,
      isShowDatePicker: false,
      isShowNumInput: false,
      datedesc: "请输入日期"
    });
    if (0 == readinfo.readstatus) {
      this.setData({
        readStatus0: true
      });
    } else if (3 == readinfo.readstatus) {
      this.setData({
        readStatus3: true
      });
    } else if (1 == readinfo.readstatus) {
      this.setData({
        readStatus1: true
      });
      this.setData({
        isShowNumInput: true
      });
      this.setData({
        hasReadNum_value: readinfo.hasreadnum
      });

    } else if (2 == readinfo.readstatus) {
      this.setData({
        readStatus2: true
      });
      this.setData({
        isShowDatePicker: true
      });
      this.setData({
        date: readinfo.time,
        datedesc: readinfo.time
      });
    }
    var showTags = new Array();
    for (let index in tags) {
      var tag = {
        name: tags[index],
        isShow: true
      };
      showTags.push(tag);
    }

    this.setData({
      tags: showTags
    });

    this.setData({
      isshowtype: false
    });
    this.setData({
      isedittype: true
    });

  },

  onGetBookDescTap: function(event) {
    console.log("------onGetBookDescTap----");
    if (!this.data.isBookSummShow) {
      this.data.booksummfold.isopen = true;
    } else {
      this.data.booksummfold.isopen = false;
    }
    this.setData({
      booksummfold: this.data.booksummfold
    });

    this.setData({
      isBookSummShow: !(this.data.isBookSummShow)
    });
    if ("" == this.data.booksummary) {
      this.setData({
        booksummary: "正在努力加载中......"
      });
      var bookisbn = this.data.editbook.isbn13;
      if ("" == bookisbn || undefined == bookisbn) {
        bookisbn = this.data.editbook.isbn10;
      }
      clouldFuncHandler.callCloudFunc(app.gVar.cloudFuncs.g_searchBookByISBN, {
        isbn: bookisbn
      }, this.doBookSearchCallBack);
    }

  },

  doBookSearchCallBack: function(data) {
    //console.log(data.result);
    /**需要处理没有内容简介的情况 */
    if (undefined != data.result && "" != data.result.book.summary) {
      this.setData({
        booksummary: data.result.book.summary
      });
    } else {
      this.setData({
        booksummary: "抱歉，没找到这书的简介哦。"
      });
    }

  },
  checkNoteParas: function(event) {
    if (undefined == event.detail.value.notecnt || "" == (event.detail.value.notecnt).trim()) {
      others.showMsg('您还没有输入读书小记哟。');
      return false;
    }
    if ((event.detail.value.notecnt).trim().length > 300) {
      others.showMsg('您的读书小记有点太长了。');
      return false;
    }
    if (!this.checkPageNum(event.detail.value.pagenum)) {
      others.showMsg('您的输入的页数有误。');
      return false;
    }
    return true;
  },
  onBookNoteAddSubmit: function(event) {
    //console.log(event);
    //console.log(this.data.editbook);
    if (!this.checkNoteParas(event)) {
      return;
    }
    var booknote = null;
    var nowTime = others.getZoneTime();
    console.log("*****" + nowTime)
    //如果是新增读书小记
    if (null == this.data.currentnote) {
      booknote = {
        userid: wx.getStorageSync("openid"),
        isbn13: this.data.editbook.isbn13,
        notecnt: event.detail.value.notecnt.trim(),
        pagenum: event.detail.value.pagenum,
        createtime: nowTime,
        modifytime: nowTime
      };
    } else {
      //修改读书小记的情况
      booknote = this.data.currentnote;
      delete booknote._id;
      booknote.notecnt = event.detail.value.notecnt.trim();
      booknote.pagenum = event.detail.value.pagenum;
      booknote.modifytime = nowTime;
    }
    this.setBookNote(false, booknote);
  },

  setBookNote: function(isDel, booknote) {
    clouldFuncHandler.callCloudFunc("setBookNote", {
      booknote: booknote,
      isDel: isDel
    }, this.setBookNoteCallBack);
  },

  setBookNoteCallBack: function(data) {
    console.log(data);
    if ("OK" == data.result.result) {
      this.setData({
        currentnote: null
      });
      this.loadBookNote(this.data.userid);
    }
  },

  checkPageNum: function(pagenum) {
    if ("" == pagenum.trim() || parseInt(pagenum) <= 0 || parseInt(pagenum) > parseInt(this.data.editbook.pages)) {
      return false;
    }
    return true;
  },
  //点击新增读书小计按钮
  onAddNewNoteTap: function(event) {
    this.setData({
      currentnote: null
    });
    this.setData({
      pagenum: "",
      notecnt: "",
      isNoteShowType: false,
      isNoteEditType: true,
    });
  },

  onEditNoteCancel: function(event) {
    this.setData({
      currentnote: null
    });
    this.loadBookNote(this.data.userid);
  },

  onEditNoteTap: function(event) {
    //console.log(event);
    var note = event.currentTarget.dataset.note;
    this.setData({
      currentnote: note
    });
    this.setData({
      pagenum: note.pagenum,
      notecnt: note.notecnt,
      isNoteShowType: false,
      isNoteEditType: true
    });
  },

  onDelNoteTap: function(event) {
    //console.log(event);
    var note = event.currentTarget.dataset.note;
    var that = this;
    wx.showModal({
      title: '提示',
      content: '您确定要删除这条读书笔记？',
      success(res) {
        if (res.confirm) {
          console.log('del confirm.......')
          that.setBookNote(true, note);
        } else if (res.cancel) {
          console.log('del cancel.......')
        }
      }
    });
  },
  onLikeNoteTap: function(event) {
    //console.log(event);
    var noteid = event.currentTarget.dataset.note._id;
    var userid = wx.getStorageSync("openid");
    clouldFuncHandler.callCloudFunc("setNoteLike", {
      userid: userid,
      noteid: noteid
    }, this.onSetNoteLikeCallBack);
  },
  onSetNoteLikeCallBack: function(data) {
    //console.log(data);
    if ("OK" == data.result.result) {
      this.loadOtherBookNote(wx.getStorageSync("openid"));
    }

  },

  onPhoto2StrTap: function(event) {
    var fileid = "";
    var that=this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        console.log(res);
        var fsname = res.tempFilePaths[0];
        fsname = fsname.substring(fsname.length - 20, fsname.length);
        console.log(fsname);
        //const tempFilePaths = res.tempFilePaths
        wx.showLoading({
          title: '正在处理...',
        });
        that.uploadPic(fsname, res.tempFilePaths[0],that)
      }
    });
  },
  uploadPic: function (fsname, fpath, that){
    wx.cloud.uploadFile({
      cloudPath: fsname,
      filePath: fpath, // 文件路径
      success: res => {
        // get resource ID
        console.log(res)
        that.setData({ curFileID: res.fileID });
        that.getFileUrl(res.fileID, that);
        
      },
      fail: err => {
        wx.hideLoading();
        console.log(err);
      }
    });
  },

  getFileUrl: function (fileID,that){
    wx.cloud.getTempFileURL({
      fileList: [fileID],
      success: res => {
        console.log(res);
        that.doTxtRec(res.fileList[0].tempFileURL,that);
      },
      fail: err => {
        wx.hideLoading();
        that.delPic(that);
        console.log(err);
        
      }
    });
  },

  doTxtRec: function(url,that) {
    clouldFuncHandler.callCloudFunc("doCharsRec", {
      url: url
    }, function(data) {
      wx.hideLoading();
      var content = "";
      console.log(data.result.words_result);
      
      for (let index in data.result.words_result){
        content = content + data.result.words_result[index].words;
      }
      that.setData({ notecnt: content});
      that.delPic(that);
    });
  },


  delPic: function (that) {
    var fid=this.data.curFileID;
    wx.cloud.deleteFile({
      fileList: [fid],
      success: res => {
        console.log(res);
      },
      fail: err => {
        console.log(err);
      }
    })
  }

})