

/**
 * 验证
 * @param {{}} settings ajax请求的配置参数
 * @returns boolean
 */
 export default function validate(settings) {
    if (!xhrRequest) {
        throw new Error("您的浏览器不支持ajax请求");

    }
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
    if (settings.async !== false) {
        settings.async = true; //默认为异步的
    }
    if (!settings.url) {
        throw new Error("请求地址不能为空");

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
    if (settings.data && settings.data.constructor === FormData) { //如果是FormData不进行处理，相当于jquery ajax中contentType=false,processData=false,不设置Content-Type
        settings.contentType == false;
    } else if (settings.contentType == false) { //为false，是正确值

    } else if (settings.contentType == null || settings.contentType == undefined || settings.contentType == "") { //请求的数据格式,默认值
        //如果为false，是正确值
        settings.contentType = "application/x-www-form-urlencoded"; //默认表单提交
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
        } else if (settings.data && settings.url.indexOf("?") > -1 && settings.url.indexOf("?") < settings.url.length - 1) {
            settings.url += "&" + settings.data;
        }
    }

    return true;
}

