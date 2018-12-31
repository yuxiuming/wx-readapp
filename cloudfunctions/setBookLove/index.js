// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();

// 云函数入口函数
exports.main = async(event, context) => {
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

  if (0 == (resultSet.data).length && event.loveit) {
    resultSet = await db.collection(t_book_love).add({
      data: {
        bookid: event.bookid,
        userid: event.userid,
        createtime:(new Date().getTime())
      }
    });
    if (resultSet.errMsg != "collection.add:ok") {
      return {
        result: "There is something wrong...."
      };
    }
  } else if (1 == (resultSet.data).length && !(event.loveit)) {
    resultSet = await db.collection(t_book_love).where({
      bookid: event.bookid,
      userid: event.userid
    }).remove();
    if (resultSet.errMsg != "collection.remove:ok") {
      return {
        result: "There is something wrong...."
      };
    }
  }

  return {
    result: "OK"
  }
}