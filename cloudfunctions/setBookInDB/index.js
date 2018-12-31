//添加书籍
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  var t_books = "t_books";
  var t_user_x_books = "t_user_x_books";
  var t_recommend ="t_recommend";

  try {
    //1.先查询书本在books表中是否存在
    var resultSet = await db.collection(t_books).where({
      isbn13: event.book.isbn13
    }).get();

    //如果不存在，则在books中添加
    //这里不是使用doc.set是因为原则上书本的信息一旦保存就不会改变
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
    //在t_recommend中更新
    if (event.book.rating_average>=8){
      db.collection(t_recommend).doc(event.book.isbn13).set({
      data: { isbn13: event.book.isbn13, score: event.book.rating_average}
      });
    }

    //更新在t_user_x_books中添加
    resultSet = await db.collection(t_user_x_books).doc(event.userxbook._id).set({
      data: event.userxbook.userXBook
      });
    if (resultSet.errMsg != "document.set:ok") {
        return {
          result: "There is something wrong...."
        };
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