// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  var t_note_like = "t_note_like";
  

  var resultSet = await db.collection(t_note_like).where({
    noteid: event.noteid,
    userid: event.userid
  }).get();

  if (resultSet.errMsg != "collection.get:ok") {
    return {
      result: "There is something wrong...."
    };
  }

  if (0 == (resultSet.data).length) {
    resultSet = await db.collection(t_note_like).add({
      data: { noteid: event.noteid, userid: event.userid}
    });
    if (resultSet.errMsg != "collection.add:ok") {
      return {
        result: "There is something wrong...."
      };
    }
  }
 
  return {
    result: "OK"
  }
}