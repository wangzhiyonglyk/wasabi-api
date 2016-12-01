
/**
 * Created by wangzhiyong on 16/10/5.
 * 将fetch 方法从框架独立出来
 *
 */

var paramFormat=require("./paramFormat.js");
var fetchapi=function(fetchmodel) {
    if (!fetchmodel || !fetchmodel instanceof  Object) {
        throw new Error("fetchmodel配置无效,不能为空,必须为对象");
        return false;
    }
    if(!fetchmodel.success) {
        throw new Error("fetchmodel的success[请求成功函数]不能为空");
        return false;
    }
    else if(typeof fetchmodel.success !=="function")
    {
        throw new Error("fetchmodel的success[请求成功函数]必须为函数");
        return false;
    }

    if(fetchmodel.error&&typeof fetchmodel.error !=="function") {
        throw new Error("fetchmodel的error[请求失败函数]必须为函数");
        return false;
    }

    if(fetchmodel.params instanceof  Array)
    {
        throw new Error("fetchmodel的params参数必须是字符,空值,对象,FormData,不可以为数组");
        return false ;
    }
    if (!fetchmodel.contentType) {//请求的数据格式,默认值
        fetchmodel.contentType = "application/x-www-form-urlencoded";
    }

    //错误处理函数
    function errorHander (fetchmodel, errCode, message) {
        if (errCode == 404) {
            console.log("404", "请求地址无效");
        }
        else if (errCode == 500) {
            console.log("500", "服务器内部错误");
        }
        else if (errCode == 1 || errCode == 801) {//请求超时,能用的后台错误
            console.log(errCode, message);
        }

        else {//其他错误处理

            if (typeof settings.error === "function") {//设置了错误事件,
                fetchmodel.error(errCode, message);
            }
        }
    }


    fetch(
        fetchmodel.url,
        {
            method:   fetchmodel.type,
            headers: {
                "Content-Type":  fetchmodel.contentType
            },
            body:fetchmodel.params? paramFormat(fetchmodel.params):null,
        }
    ).then(function (res) {
        if (res.ok) {
            res.json().then(function (result) {
                if (result.success != null && result.success != undefined) {//后台传了这个字段
                    if (result.success) {
                        if (fetchmodel.success && typeof fetchmodel.success === "function") {
                            fetchmodel.success(result);//执行成功
                        }
                        else {
                            throw  new Error("您没的设置请求成功后的处理函数-success");
                        }

                    }
                    else {
                        if (!result.message) {//有标准的错误信息
                            fetchapi.errorHandler(result, result.errCode, result.message);
                        }
                        else {
                            fetchapi.errorHandler(result, 801, "服务器正常响应，后台业务代码的逻辑报错");

                        }
                    }
                }
                else {//后台没有传这个字段
                    if (fetchmodel.success && typeof fetchmodel.success === "function") {
                        fetchmodel.success(result);//直接认为是成功的,执行成功
                    }
                    else {
                        throw  new Error("您没的设置请求成功后的处理函数-success");
                    }
                }

            });
        }
        else {
            fetchapi.errorHander(fetchmodel, 500, "服务器内部错误");
        }

    }).catch(function (e) {
        fetchapi.errorHander(fetchmodel, 404, e.message);
    });
};

module .exports=fetchapi;

