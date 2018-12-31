// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();

// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  var t_userinfo = "t_userinfo";

  var resultSet = await db.collection(t_userinfo).doc(event.userinfo._id).set({
    data: {
      avatarUrl: event.userinfo.avatarUrl,
      nickName: event.userinfo.nickName
    }
  });

  if (resultSet.errMsg != "document.set:ok") {
    return {
      result: "There is something wrong...."
    };
  }
  return {
    result: "OK"
  }
}