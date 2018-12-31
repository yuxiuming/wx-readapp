// 云函数入口文件
const cloud = require('wx-server-sdk');
const rp = require('request-promise');
//https://api.douban.com/v2/book/search
//https://douban.uieee.com/v2/book/search

cloud.init();
const db = cloud.database();

// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext();
  var t_user_x_books = "t_user_x_books";
  var result = new Array();

  let opt = {
    method: 'GET',
    url: 'https://api.douban.com/v2/book/search',
    qs: {
      tag: event.title,
      start: 0,
      count: 50
    },
    json: true
  };

  var temResult;
  var flag=true;
  do {
    temResult = await rp(opt);
    if (flag && 0==temResult.total){
      flag=false;
      opt.qs={
        q: event.title,
        start: 0,
        count: 50
      };
      temResult = await rp(opt);
    }
    for (var index in temResult.books) {
      if (temResult.books[index].title == event.title) {
        result.push(temResult.books[index]);
      }
    }
    opt.qs.start += 50;

  } while (opt.qs.start < temResult.total);

  for (let index in result){
    var status=["想读","在读","读过","弃读"];
    var resultSet = await db.collection(t_user_x_books).where({
      _id: event.userid + "_" + result[index].isbn13
    }).get();
    //console.log(resultSet);
    if (0 == resultSet.data.length) {
      result[index]["readstatus"]=false;
    }else{
      result[index]["readstatus"] = status[resultSet.data[0].readinfo.readstatus];
    }
  }

  return {
    books: result
  };


}