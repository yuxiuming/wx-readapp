// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  var t_book_love = "t_book_love";

  var resultSet = await db.collection(t_book_love).where({
    bookid: event.bookid,
    userid: event.userid
  }).get();

  if (resultSet.errMsg != "collection.get:ok") {
    return {
      result: "There is something wrong...."
    };
  }

  return  resultSet;
  
}