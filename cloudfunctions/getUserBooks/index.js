// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();

// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext();
  var t_books = "t_books";
  var t_user_x_books = "t_user_x_books";
  var t_book_love = "t_book_love";
  try {
    var resultSet = await db.collection(t_user_x_books).where({
      userid: event.userid
    }).get();

    if (0 == resultSet.data.length) {
      return {
        result: 0
      };
    }

    var tmpuserxbooks = resultSet.data;
    var userxbooks = new Array();
    for (let index in tmpuserxbooks) {
      if(tmpuserxbooks[index].readinfo.readstatus==event.readstatus){
        userxbooks.push(tmpuserxbooks[index]);
      };
    }

    var timeStrSet=new Set();
    for (let index in userxbooks) {
      timeStrSet.add(userxbooks[index].readinfo.time);
    }
    var timeStrArr = Array.from(timeStrSet);
    var resultMap=new Map();
    for (let index in timeStrArr) {
      resultMap.set(timeStrArr[index],new Array());
    }

    for (let index in userxbooks) {
      resultSet = await db.collection(t_books).where({
        isbn13: userxbooks[index].isbn13
      }).get();

      if (0==resultSet.data.length) {
        continue;
      }
      var bookLoveSet = await db.collection(t_book_love).where({
        bookid: userxbooks[index].isbn13, userid: event.userid
      }).get();
      if (0 == bookLoveSet.data.length) {
        resultSet.data[0]["islove"]=false;
      }else{
        resultSet.data[0]["islove"] = true;
      }
      (resultMap.get(userxbooks[index].readinfo.time)).push(resultSet.data[0]);

    }

    var timexbooks=new Array();
    for (let index in timeStrArr) {
      var tmp = { timestr: timeStrArr[index], books: resultMap.get(timeStrArr[index])};
      timexbooks.push(tmp);
    }

    return timexbooks;
  } catch (e) {
    console.error(e);
    return {
      result: "There is something wrong...."
    };
  }
}