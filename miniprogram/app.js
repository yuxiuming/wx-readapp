//app.js
App({
  /**小程序初始化 */
  onLaunch(options) {
    // Do something initial when launch.
  },

  /**全局变量 */
  gVar: {

    urls: {
      //https://api.douban.com/v2/book/search?
      //https://douban.uieee.com/v2/book/search
      g_DoubanBookSearchURL: "https://douban.uieee.com/v2/book/search"
      
    },

    cloudFuncs: {
      g_searchBookByName:"searchBookByName",
      g_searchBookByISBN: "searchBookByISBN",
    }
    ,
    editBook:{
      defaltTags: [
        { name: '外国文学', isShow: false },
        { name: '中国文学', isShow: false },
        { name: '小说', isShow: false },
        { name: '畅销书', isShow: false },
        { name: '每次阅读独有新发现', isShow: false },
        { name: '内容深入浅出', isShow: false },
        { name: '高潮迭起', isShow: false }
      ]
    }
  }
})