
/**
 * Created by apple on 16/10/5.
 * 将fetch 方法从
 */
require("whatwg-fetch");//safari兼容
var paramFormat=require("./paramFormat.js");
var fetchapi = {
    get: function (fetchmodel) {
        fetch(
            fetchmodel.url,
            {
                method: "GET"
            }
        ).then(function (res) {
            if (res.ok) {
                res.json().then(function (result) {
                    if (result.success != null && result.success != undefined) {//后台传了这个字段
                        if (result.success) {
                            if (!fetchmodel.success && typeof fetchmodel.success === "function") {
                                fetchmodel.success(result);//执行成功
                            }

                        }
                        else {
                            if (!result.message) {//有标准的错误信息
                                this.errorHandler(result, result.errCode, result.message);
                            }
                            else {
                                this.errorHandler(result, 801, "服务器正常响应，后台业务代码的逻辑报错");

                            }
                        }
                    }
                    else {//后台没有传这个字段
                        fetchmodel.success(result);//直接认为是成功的

                    }

                });
            }
            else {
                this.errorHander(fetchmodel, "500", "服务器内部错误");
            }

        }).catch(function (e) {
            this.errorHander(fetchmodel, "404", e.message);
        });
    },
    post: function (fetchmodel) {
        fetch(
            fetchmodel.url,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body:fetchmodel.params? paramFormat.xhrFormat(fetchmodel.params):null,
            }
        ).then(function (res) {
            if (res.ok) {
                res.json().then(function (result) {
                    if (result.success != null && result.success != undefined) {//后台传了这个字段
                        if (result.success) {
                            if (!fetchmodel.success && typeof fetchmodel.success === "function") {
                                fetchmodel.success(result);//执行成功
                            }

                        }
                        else {
                            if (!result.message) {//有标准的错误信息
                                this.errorHandler(result, result.errCode, result.message);
                            }
                            else {
                                this.errorHandler(result, 801, "服务器正常响应，后台业务代码的逻辑报错");

                            }
                        }
                    }
                    else {//后台没有传这个字段
                        fetchmodel.success(result);//直接认为是成功的

                    }

                });
            }
            else {
                this.errorHander(fetchmodel, 500, "服务器内部错误");
            }

        }).catch(function (e) {
            this.errorHander(fetchmodel, 404, e.message);
        });
    },
    errorHander: function (fetchmodel, errCode, message) {
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

}
module .exports=fetchapi;