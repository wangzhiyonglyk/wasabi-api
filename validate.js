

/**
 * 验证
 * @param {{}} settings ajax请求的配置参数
 * @returns object
 *  * date:2020-02-29 修复contentType为false时，要用===判断，否则与""相等了
  date:2020-09-22 将date
 */

 export default function validate(settings) {
    if (!settings || !(settings instanceof Object)) {
        throw new Error("ajax配置无效,不能为空,必须为对象");

    }
    if (settings.data instanceof Array) {
        throw new Error("ajax的data参数必须是字符,空值,对象,FormData,不可以为数组");

    }
    if (!settings.dataType) { //回传的数据格式,默认为json
        settings.dataType = "json";
    }
   
    if (!settings.type) { //请求方式
        settings.type = "GET";
    }
    if(typeof settings.type!=="string"){
        throw new Error("ajax中的type参数必须是字符");
    }
    if (settings.async !== false) {
        settings.async = true; //默认为异步的
    }
    if (!settings.url) {
        throw new Error("ajax请求地址不能为空");
    }
    if (typeof settings.url!=="string") {
        throw new Error("ajax请求地址必须是字符串");
    }
    if (!settings.success) {
        throw new Error("ajax的success[请求成功函数]不能为空");

    } else if (typeof settings.success !== "function") {
        throw new Error("ajax的success[请求成功函数]必须为函数");

    }
    if (settings.error && typeof settings.error !== "function") {
        throw new Error("ajax的error[请求失败函数]必须为函数");

    }
    if (settings.progress && typeof settings.progress !== "function") {
        throw new Error("ajax的progress[上传进度函数]必须为函数");

    }
    if (settings.contentType === null || settings.contentType === undefined || settings.contentType ==="") { 
        //请求的数据格式,默认值,如果为false，是正确值
        settings.contentType = "application/x-www-form-urlencoded"; //默认表单提交
    }
    if (settings.headers && !(settings.headers instanceof Object)) {
        throw new Error("headers要么为空，要么为对象");

    }

  return true;
}

