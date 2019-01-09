// 云函数入口文件
const cloud = require('wx-server-sdk');
const AipOcrClient = require("baidu-aip-sdk").ocr;
const HttpClient = require("baidu-aip-sdk").HttpClient;
// 设置APPID/AK/SK
var APP_ID = "15370858";
var API_KEY = "Y1QwWfkK2LMcNH3k14pC3F5x";
var SECRET_KEY = "FDY2VgifYYWqoXGnBIEBOz4q2iy4hVcO";
cloud.init();



// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  // 新建一个对象，建议只保存一个对象调用服务接口
  var client = new AipOcrClient(APP_ID, API_KEY, SECRET_KEY);
  HttpClient.setRequestOptions({
    timeout: 5000
  });
  console.log(client);
  // 带参数调用通用文字识别, 图片参数为远程url图片
  // 如果有可选参数
  var url = event.url;
  console.log("url:" + url);
  var options = {};
  options["language_type"] = "CHN_ENG";
  options["detect_direction"] = "true";
  options["detect_language"] = "true";
  options["probability"] = "true";
  var r_result = "";

  var temp = await client.generalBasicUrl(url, options).then(function(result) {
    console.log(result);
    r_result = result;

  }).catch(function(err) {
    // 如果发生网络错误
    console.log(err);
    r_result = err;

  });
  return r_result;
}