// 云函数入口文件
const cloud = require('wx-server-sdk');
const rp = require('request-promise');
//https://api.douban.com/v2/book/isbn/:9787111128069
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {

  const wxContext = cloud.getWXContext()

  let opt = {
    method: 'GET',
    url: 'https://api.douban.com/v2/book/isbn/:'+event.isbn,
    qs: {},
    json: true
  };
  var result = await rp(opt);


  return {
    book: result
  };
}