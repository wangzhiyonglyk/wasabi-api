
/**
 * Created by apple on 16/10/5.
 * 将fetch 方法从框架独立出来
 */

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
                            if (fetchmodel.success && typeof fetchmodel.success === "function") {
                                fetchmodel.success(result);//执行成功
                            }
                            else {
                                throw  new Error("您没的设置请求成功后的处理函数-success");
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
                fetchapi.errorHander(fetchmodel, "500", "服务器内部错误");
            }

        }).catch(function (e) {
            fetchapi.errorHander(fetchmodel, "404", e.message);
        });
    },
    post: function (fetchmodel) {
        fetch(
            fetchmodel.url,
            {
                method: "POST",
                headers: {
                    "Content-Type": fetchmodel.lang == "C#" ? "application/x-www-form-urlencoded" : "application/json;charset=UTF-8"
                },
                body:this.setParams(fetchmodel.lang,fetchmodel.params)
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
    },
    then:function(fetchmodel) {//原生的请求方式,返回promise对象
       fetch(
           fetchmodel.url,
           {
               method: fetchmodel.type?fetchmodel.type:"POST",
               headers: {
                   "Content-Type": "application/x-www-form-urlencoded"
               },
               body:fetchmodel.params? paramFormat.xhrFormat(fetchmodel.params):null,
           }
       ).then(function(res){
           if(fetchmodel.success&& typeof fetchmodel.success === "function")
           {
               return fetchmodel.success(res);
           }
           else
           {
               return res;
           }

       }).catch(function (e) {
           fetchapi.errorHander(fetchmodel, 404, e.message);
       });;

   },
    setParams:function(lang,params) {
        if(lang=="C#") {
            return paramFormat.xhrFormat(params);
        }
        else {
            return params ? JSON.stringify(params) : ""
        }
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