// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
/**定义Date 格式输出 */
Date.prototype.format = function(format) {
  var o = {
    "M+": this.getMonth() + 1,
    "d+": this.getDate(),
    "h+": this.getHours(),
    "m+": this.getMinutes(),
    "s+": this.getSeconds(),
    "q+": Math.floor((this.getMonth() + 3) / 3),
    "S": this.getMilliseconds()
  }
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    }
  }
  return format;
};
// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()


  var t_book_notes = "t_book_notes";

  var resultSet = await db.collection(t_book_notes).where({
    userid: event.userid,
    isbn13: event.isbn13
  }).get();

  if (0 == resultSet.data.length) {
    return {
      result: 0
    };
  }
  var pagenumSet = new Set();
  for (let index in resultSet.data) {
    resultSet.data[index].modifytime = (new Date(resultSet.data[index].modifytime)).format("yyyy-MM-dd hh:mm:ss");
    resultSet.data[index]["editable"]=true;
    pagenumSet.add(resultSet.data[index].pagenum);
  }

  var pagenumArray = Array.from(pagenumSet);
  var resultMap = new Map();
  for (let index in pagenumArray) {
    resultMap.set(pagenumArray[index], new Array());
  }

  for (let index in resultSet.data) {
    resultMap.get(resultSet.data[index].pagenum).push(resultSet.data[index]);
  }
  resultSet = new Array();
  for (let index in pagenumArray) {
    resultSet.push({
      pagenum: pagenumArray[index],
      notes: resultMap.get(pagenumArray[index])
    });

  }
  return resultSet;
}