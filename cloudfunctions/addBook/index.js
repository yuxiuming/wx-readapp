//添加书籍
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database();
// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext();
  var t_books = "t_books";
  var t_user_x_books = "t_user_x_books";

  try {
    //1.先查询书本在books表中是否存在
    var resultSet = await db.collection(t_books).where({
      isbn13: event.book.isbn13
    }).get();

    //如果不存在，则在books中添加
    if (0 == (resultSet.data).length) {
      resultSet = await db.collection(t_books).add({
        data: event.book
      });
      if (resultSet.errMsg != "collection.add:ok") {
        return {
          result: "There is something wrong...."
        };
      }
    }


    //2.查询书本在t_user_x_books表中是否存在
    var resultSet = await db.collection(t_user_x_books).where({
      isbn13: event.book.isbn13,
      userid: event.userid
    }).get();

    //如果不存在，则在t_user_x_books中添加
    if (0 == (resultSet.data).length) {
      resultSet = await db.collection(t_user_x_books).add({
        data: event.userxbook
      });
      if (resultSet.errMsg != "collection.add:ok") {
        return {
          result: "There is something wrong...."
        };
      }
    }

    return {
      result: "OK"
    };
  } catch (e) {
    console.error(e);
    return {
      result: "There is something wrong...."
    };
  }
}