/**
 * Created by wangzhiyong on 2016-09-20.
 * 后端接口对接
 * edit by wangzhiyong
 * date:2016-10-04,将ajax直接改用原生xhr
 * date;2016-10-05 将rest独立出来,将格式化参数方法独立出来
 ** date;2016-11-05 验证可行性修改
 ** date;2017-01-14 验证可行性再次修改
 * date:207-04-18 修改在IE8，与360中的bug
 * date:207-06-16 修改asnyc参数的配置
 * 使用方法
 *     ajax({
       url:"http://localhost:7499/Admin/Add",
        type:"post",
        data:{name:"test",password:"1111",nickname:"dddd"},
        success:function (result) {
        console.log(result);
        },
    })
 */
var paramFormat = require("./paramFormat.js");
var httpCode = require("./httpCode.js");
var func = require("../libs/func");

/**
 * ajax请求
 */
var ajax = function (settings) {
  var xhrRequest = createXHR();
  if (!validate()) {//验证不通过
    return;
  }
  if (xhrParamsSet()) {//设置参数

    //开始发送数据
    if (settings.data) {//有参数
      if (settings.type.toLowerCase() == "get") {//如果是get
        xhrRequest.send();
      }
      else {//post/put等
        xhrRequest.send(settings.data);
      }
    }
    else {
      xhrRequest.send();
    }
  }
  else {

  }


  /**
   * 创建xhr对象
   * @returns {*}
   */
  function createXHR() {
    var xhr;
    if (window.XMLHttpRequest) {
      xhr = new XMLHttpRequest();
    } else {
      xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }
    return xhr;

  }

  /**
   * 验证
   * @returns {boolean}
   */
  function validate() {
    if (!xhrRequest) {
      throw new Error("您的浏览器不支持ajax请求");

    }
    if (!settings || !(settings instanceof Object)) {
      throw new Error("ajax配置无效,不能为空,必须为对象");

    }
    if (settings.data instanceof Array) {
      throw new Error("ajax的data参数必须是字符,空值,对象,FormData,不可以为数组");

    }
    if (!settings.dataType) {//回传的数据格式,默认为json
      settings.dataType = "json";
    }
    if (!settings.type) {//请求方式
      settings.type = "GET";
    }
    if (settings.async !== false) {
      settings.async = true;//默认为异步的
    }
    if (settings.url == null || settings.url == undefined || settings.url === "") {
      throw new Error("请求地址不能为空");

    }
    if (!settings.success) {
      throw new Error("ajax的success[请求成功函数]不能为空");

    }
    else if (typeof settings.success !== "function") {
      throw new Error("ajax的success[请求成功函数]必须为函数");

    }

    if (settings.error && typeof settings.error !== "function") {
      throw new Error("ajax的error[请求失败函数]必须为函数");

    }
    if (settings.progress && typeof settings.progress !== "function") {
      throw new Error("ajax的progress[上传进度函数]必须为函数");

    }
    if (settings.data && settings.data.constructor === FormData) {//如果是FormData不进行处理，相当于jquery ajax中contentType=false,processData=false,不设置Content-Type
      settings.contentType == false;
    }
    else if (settings.contentType == false) {//为false，是正确值

    }
    else if (settings.contentType == null || settings.contentType == undefined || settings.contentType == "") {//请求的数据格式,默认值
      //如果为false，是正确值
      settings.contentType = "application/x-www-form-urlencoded";//默认表单提交
    }
    if (settings.headers && !(settings.headers instanceof Object)) {
      throw new Error("headers要么为空，要么为对象");

    }

    //格式化中已经处理了FormData的情况
    settings.data = paramFormat(settings.data);

    //get方式时如果有data参数，则将参数追加到url中
    if (settings.type.toLowerCase() == "get") {
      if (settings.data && settings.url.indexOf("?") <= -1) {
        settings.url += "?";
      }
      if (settings.data && settings.url.indexOf("?") > -1 && settings.url.indexOf("?") == settings.url.length - 1) {
        settings.url += settings.data;
      }
      else if (settings.data && settings.url.indexOf("?") > -1 && settings.url.indexOf("?") < settings.url.length - 1) {
        settings.url += "&" + settings.data;
      }
    }

    return true;
  }

  /**
   * xhr参数设置
   */
  function xhrParamsSet() {
    try {
      xhrRequest.open(settings.type, settings.url, settings.async);
    }
    catch (e) {//说明不支持跨域
      errorHandler(xhrRequest, 803, "[IE,360]自动阻止了跨域:" + e.message);
    }

    //设置请求格式
    if (settings.contentType == false) {//为false,不设置Content-Type
    }
    else {
      xhrRequest.setRequestHeader("Content-Type", settings.contentType);//请求的数据格式,
    }
    //设置返回格式
    try {
      xhrRequest.responseType = settings.dataType;//回传的数据格式
    }
    catch (e) {
      console.log("该浏览器[IE，360]不支持responseType的设置，跳过");
    }
    try {
      xhrRequest.withCredentials = settings.cors ? true : false;//表明在进行跨站(cross-site)的访问控制(Access-Control)请求时，是否使用认证信息(例如cookie或授权的header)。 默认为 false。
    }
    catch (e) {
      console.log("该浏览器[IE，360]不支持withCredentials的设置，跳过");
    }
    if (!settings.timeout) { //设置超时时间
      xhrRequest.timeout = settings.timeout;//超时时间
    }
    //设置headers
    if (settings.headers instanceof Object) {
      try {
        for (var prop in settings.headers) {

          xhrRequest.setRequestHeader(prop, settings.headers[prop]);
        }
      }
      catch (e) {
        throw new Error(e.message);
      }

    }


    try {
      //支持xhr2.0
      xhrRequest.addEventListener("load", load, false);///执行成功事件
      xhrRequest.addEventListener("loadend", loadEnd, false);//执行完成事件
      xhrRequest.addEventListener("timeout", timeout, false);//超时事件
      xhrRequest.addEventListener("error", error, false);//执行错误事件
      if (typeof settings.progress === "function") {//没有设置时不要处理
        xhrRequest.upload.addEventListener("progress", progress, false);//上传进度
      }
      else {

      }
    }
    catch (e) {//说明不支持xhr2.0
      console.log("浏览器不支持xhr2.0，已经转为1.0");
      xhrRequest.onreadystatechange = function () {
        if (xhrRequest.readyState == 4) {
          var e = {};
          e.target = xhrRequest;
          load(e);//调用加载成功事件
        }
      }
    }
    return true;

  }

  /**
   * 上传进度事件
   * @param event
   */
  function progress(event) {
    if (event.lengthComputable) {
      var percentComplete = Math.round(event.loaded * 100 / event.total);
      if (typeof settings.progress === "function") {
        settings.progress(percentComplete);//执行上传进度事件
      }
    }
  }

  /**
   * 请求成功
   * @param event
   */
  function load(event) {
    var xhr = (event.target);
    if (xhr.readyState == 4 && ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304)) {//请求成功
      if (settings.dataType == "json") {
        //json格式请求
        var result = xhr.response ? xhr.response : xhr.responseText;//1.0
        if (result) {
          if (typeof result == "string") {//IE8.360 中没有对结果进行JSON化
            result = JSON.parse(result);
          }
          if (result.success != null && result.success != undefined) {//后台传了这个字段
            if (result.success) {
              if (settings.success && typeof settings.success === "function") {
                settings.success(result);//执行成功
              }
              else {
                throw new Error("您没的设置请求成功后的处理函数-success");
              }
            }
            else {
              if (result.message) {//有标准的错误信息
                errorHandler(result, result.errCode, result.message);
              }
              else {
                errorHandler(result, 801, "服务器正常响应，后台业务代码的逻辑报错");

              }
            }
          }
          else {//后台没有传这个字段
            if (settings.success && typeof settings.success === "function") {
              settings.success(result);//直接认为是成功的
            }

            else {
              throw new Error("您没的设置请求成功后的处理函数-success");
            }

          }
        }
        else {
          errorHandler(xhr, 802, "服务器返回的数据格式不正确");
        }
      }
      else if (settings.dataType == "blob" || settings.dataType == "arrayBuffer") {//二进制数据
        settings.success(xhr.response);
      }
      else {//其他格式
        try {
          settings.success(xhr.responseText);
        }
        catch (e) {//如果没有responseText对象,不能通过if判断,原因不详
          settings.success(xhr.response);
        }

      }
    }
    else {//是4xx错误时属于客户端的错误，并不属于Network error,不会触发error事件

      errorHandler(xhr, xhr.status, xhr.statusText);
    }


  }

  /**
   * 请求完成
   * @param event
   */
  //
  function loadEnd(event) {
    var xhr = (event.target);
    if (typeof settings.complete === "function") {//设置了完成事件,
      if (xhr.readyState == 4 && ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304)) {//请求成功
        //304客户端已经执行了GET，但文件未变化,认为也是成功的
        settings.complete(xhr, "success");
      }
      else if (xhr.readyState == 4 && xhr.status == 0) {//本地响应成功，TODO 暂时不知道如何处理

      }
      else {//错误
        settings.complete(xhr, "error");
      }
    }
  }

  /**
   * 请求超时
   * @param event
   */
  function timeout(event) {
    var xhr = (event.target);
    errorHandler(xhr, 802, "请求超时");
  }

  /**
   * 请求失败
   * @param event
   */
  function error(event) {
    var xhr = (event.target);
    errorHandler(xhr, xhr.status, xhr.statusText);
  }

  /**
   * 通用错误处理函数
   * @param xhr
   * @param errCode
   * @param message
   */
  function errorHandler(xhr, errCode, message) {

    if (errCode >= 300 && errCode < 600) {

      console.log(errCode, httpCode[errCode.toString()]);//直接处理http错误代码
      if (typeof settings.error === "function") {//设置了错误事件,
        settings.error(xhr, errCode, httpCode[errCode.toString()]);
      }
    }
    else {
      console.log(errCode, message);
      if (typeof settings.error === "function") {//设置了错误事件,
        settings.error(xhr, errCode, message);
      }
    }


  }
}

module.exports = ajax;


