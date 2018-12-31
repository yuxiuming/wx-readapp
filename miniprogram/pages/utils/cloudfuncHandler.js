
function callCloudFunc(funcName,funcData,callBack) {
  console.log("callCloudFunc " + funcName+" begin.....");
  var result=null;
  wx.cloud.init();
  //console.log(funcName);
  console.log(funcData);
  wx.cloud.callFunction({
    // 云函数名称
    name: funcName,
    // 传给云函数的参数
    data: funcData,
    success: function (res) {
      callBack(res);
    },
    fail: function (res) {
      callBack(res);
    }
    //fail: console.error
  });
  console.log("callCloudFunc " + funcName+" end.....");
}

 

module.exports = {
  callCloudFunc: callCloudFunc
}