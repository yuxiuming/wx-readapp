function doScan(callback){
  console.log("-----utils doScan----");
  wx.scanCode({
    success: callback
  });
}

module.exports = {
  doScan: doScan
}