// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database();
// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext();
  var t_books = "t_books";
  var t_user_x_books = "t_user_x_books";
  var t_recommend = "t_recommend";
  const RNUM = 5;

  try {
    /**获取所有推荐书目 */
    var resultSet = await db.collection(t_recommend).get();

    var tmpisbns = resultSet.data;
    var total = tmpisbns.length;
    var isbnsset = new Set();
    /**随机找出5本 */
    while (isbnsset.size < RNUM) {
      let random = Math.floor(Math.random() * (total - 1 - 1 + 1) + 1);
      //console.log("***** " + random);
      isbnsset.add(tmpisbns[random]);
    }
    var isbns = Array.from(isbnsset);
    //console.log(isbns);
    /**查询书本详细信息 */
    var bookArray = new Array();

    for (let index in isbns) {
      var book = await db.collection(t_books).where({
        _id: isbns[index].isbn13
      }).get();
      if (0<book.data.length){
        bookArray.push(book.data[0]);
      }
      
    }

    return {
      books: bookArray
    };
  } catch (e) {
    console.error(e);
    return {
      result: "There is something wrong...."
    };
  }
}