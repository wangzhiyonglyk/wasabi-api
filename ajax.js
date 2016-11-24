/**
 * Created by wangzhiyong on 2016-09-20.
 * 后端接口对接
 * edit by wangzhiyong
 * date:2016-10-04,将ajax直接改用原生xhr
 * date;2016-10-05 将rest独立出来,将格式化参数方法独立出来
 ** date;2016-11-05 修改
 */
var paramFormat=require("./paramFormat.js");

//普通ajax
var ajax=function(settings) {
    if(!XMLHttpRequest)
    {
        throw new Error("您的浏览器不支持ajax请求");
        return false;
    }
    if (!settings || !settings instanceof  Object) {
        throw new Error("ajax配置无效,不能为空,必须为对象");
        return false;
    }
    if(settings.data instanceof  Array)
    {
        throw new Error("ajax的data参数必须是字符,空值,对象,FormData,不可以为数组");
        return false ;
    }
    if (!settings.dataType) {//回传的数据格式,默认为json
        settings.dataType = "json";
    }
    if (!settings.type) {//请求方式
        settings.type = "GET";
    }
    if (!settings.async) {
        settings.async = true;//默认为异步的
    }
    if (settings.url == null || settings.url == undefined || settings.url === "") {
        throw new Error("请求地址不能为空");
        return;
    }
    if(!settings.success) {
        throw new Error("ajax的success[请求成功函数]不能为空");
        return false;
    }
    else if(typeof settings.success !=="function")
    {
        throw new Error("ajax的success[请求成功函数]必须为函数");
        return false;
    }

    if(settings.error&&typeof settings.error !=="function") {
        throw new Error("ajax的error[请求失败函数]必须为函数");
        return false;
    }

    if (!settings.contentType) {//请求的数据格式,默认值
        settings.contentType = "application/x-www-form-urlencoded";
    }



    var xhrRequest = new XMLHttpRequest();
    xhrRequest.upload.addEventListener("progress", progress, false);//上传进度
    xhrRequest.addEventListener("load", load, false);
    xhrRequest.addEventListener("loadend", loadEnd, false);
    xhrRequest.addEventListener("timeout", timeout, false);
    xhrRequest.addEventListener("error", error, false);
    xhrRequest.open(settings.type, settings.url, settings.async);

    xhrRequest.setRequestHeader("Content-Type", settings.contentType);//请求的数据格式,
    xhrRequest.withCredentials=true;//设置允许跨域
    xhrRequest.responseType = settings.dataType;//回传的数据格式

    if (!settings.timeout) { //设置超时时间
        xhrRequest.timeout = settings.timeout;//超时时间
    }

    xhrRequest.send(paramFormat(settings.data));//先格式化参数
    //上传进度事件
    function progress(event) {
        if (event.lengthComputable) {
            var percentComplete = Math.round(event.loaded * 100 / event.total);
            if (typeof  settings.progress === "function") {
                settings.progress(percentComplete);//执行上传进度事件
            }
        }
    }

    //请求成功
    function load(event) {
        var xhr = (event.target);
        if (xhr.readyState == 4 && ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304)) {//请求成功
            if (settings.dataType == "json") {
                //json格式请求
                var result = xhr.response;
                if (result.success != null && result.success != undefined) {//后台传了这个字段
                    if (result.success) {
                        if (settings.success && typeof settings.success === "function") {
                            settings.success(result);//执行成功
                        }
                        else {
                            throw  new Error("您没的设置请求成功后的处理函数-success");
                        }
                    }
                    else {
                        if (!result.message) {//有标准的错误信息
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

                   else{
                        throw  new Error("您没的设置请求成功后的处理函数-success");
                    }

                }
            }
            else if (settings.dataType == "blob" || settings.dataType == "arrayBuffer") {//二进制数据
                settings.success(xhr.response);
            }
            else {//其他格式
                try
                {
                    settings.success(xhr.responseText);
                }
                catch (e)
                {//如果没有responseText对象,不能通过if判断,原因不详
                    settings.success(xhr.response);
                }

            }
        }
        else {//是4xx错误时，并不属于Network error,不会触发error事件

            errorHandler(xhr,xhr.status, xhr.statusText);
        }


    }

    //请求完成
    function loadEnd(event) {
        var xhr = (event.target);
        if (typeof settings.complete === "function") {//设置了完成事件,
            if (xhr.readyState == 4 && ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304)) {//请求成功
                settings.complete(xhr, "success");
            }
            else if (xhr.readyState == 4 && xhr.status == 0) {//超时
                settings.complete(xhr, "timeout");
            }
            else {//错误
                settings.complete(xhr, "error");
            }
        }
    }

    //请求超时
    function timeout(event) {
        var xhr = (event.target);
        errorHandler(xhr,1, "请求超时");
    }

    //请求失败
    function error(event) {
        var xhr = (event.target);
        errorHandler(xhr,xhr.status, xhr.statusText);
    }

    //通用错误处理函数
    function errorHandler(xhr,errCode, message) {
        if (errCode == 404) {
            console.log("404", "请求地址无效");
        }
        else if (errCode == 500) {
            console.log("500", "服务器内部错误");
        }
        else if (errCode ==1||errCode==801) {//请求超时,能用的后台错误
            console.log(errCode, message);
        }

        else {//其他错误处理

            if (typeof settings.error === "function") {//设置了错误事件,
                settings.error(xhr,errCode, message);
            }
        }
    }




}

module.exports=ajax;


