// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  var t_user_x_books = "t_user_x_books";
  try { 
    var resultSet = await db.collection(t_user_x_books).where({
      _id: event._id
    }).get();
    return resultSet;
  }catch (e) {
    console.error(e);
    return {
      result: "There is something wrong...."
    };
  }
}