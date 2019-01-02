//获取当前时间，格式YYYY-MM
function getNowMonth() {
  var date = new Date();
  var seperator1 = "-";
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  var currentdate = year + seperator1 + month 
  return currentdate;
}

function compareNowMonth(timeStr) {
  var temp = timeStr.split("-");
  if (0 == temp[1].indexOf("0")) {
    temp[1] = temp[1].substr(1);
  }
  var date = new Date();
  var nowyear = date.getFullYear();
  var nowmonth = date.getMonth() + 1;
  if (parseInt(temp[0]) > nowyear) {
    return true;
  } else if (parseInt(temp[1]) > nowmonth) {
    return true;
  } else { return false; }

}

function getDBBookItem(originBook) {
  if ("" == originBook.isbn13 || undefined == originBook.isbn13 || null == originBook.isbn13){
    originBook.isbn13 = originBook.isbn10;
  }
  return {
    _id: originBook.isbn13,
    title: originBook.title,
    dburl: originBook.alt,
    dbinfourl: originBook.url,
    origin_title: originBook.origin_title,
    subtitle: originBook.subtitle,
    translator: originBook.translator,
    pubdate: originBook.pubdate,
    publisher: originBook.publisher,
    author: originBook.author,
    image: originBook.image,
    isbn10: originBook.isbn10,
    isbn13: originBook.isbn13,
    pages: originBook.pages,
    rating_average: originBook.rating.average,
    readstatus: originBook.readstatus
  };
}


function showMsg(cnt){
  wx.showToast({
    title: cnt,
    icon: 'none',
    duration: 2000
  });
}

function getZoneTime(){
  var offset = new Date().getTimezoneOffset();
  return ((new Date().getTime()) - offset*60*1000);
}


module.exports = {
  getNowMonth: getNowMonth,
  compareNowMonth: compareNowMonth,
  getDBBookItem: getDBBookItem,
  showMsg: showMsg,
  getZoneTime:getZoneTime
}