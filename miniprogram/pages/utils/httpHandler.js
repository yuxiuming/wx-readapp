
function doHttpGet(url, data,callBack) { 
  console.log("doHttpGet:url=" + url);
  console.log(data);

  wx.request({
    url: url,
    //data: {tag:"教养的迷思"},
    data:data,
    header: {'Content-Type': 'application/xml'},
    method: "GET",

    success: function (res) {
      console.log("doHttpGet:succes");

      callBack(res.data);
    },
    fail: function (res) { 
      console.log("doHttpGet:fail");
      console.log(res);
    },
    complete: function (res) { },
  });

}

module.exports = {
  doHttpGet: doHttpGet
}