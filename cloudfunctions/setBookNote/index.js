// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();

// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  var t_book_notes = "t_book_notes";
  //console.log(event.booknote);
  var _id = event.booknote.userid + "_" + event.booknote.isbn13 + "_" + event.booknote.createtime;
  console.log(_id);
  if(true == event.isDel){
    var resultSet = await db.collection(t_book_notes).doc(_id).remove();
    console.log(resultSet);
    if (resultSet.errMsg != "document.remove:ok") {
      return {
        result: "There is something wrong...."
      };
    }

  }else{
    var resultSet = await db.collection(t_book_notes).doc(_id).set({
      data: event.booknote
    });

    if (resultSet.errMsg != "document.set:ok") {
      return {
        result: "There is something wrong...."
      };
    }
  }

  return {
    result: "OK"
  }
}