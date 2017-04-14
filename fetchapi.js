
/**
 * Created by wangzhiyong on 16/10/5.
 * 将fetch 方法从框架独立出来
 * 2017-01-15进行修改，完善
 * 使用方法
 *
 * 1.使用promise
 *
 fetchapi({
        url: "http://localhost:7499/Admin/Add",
        type: "post",
        data: {name: "test", password: "1111", nickname: "dddd"},
        promise:true,
    }).then(function (result) {
        console.log(result);

    })

 *2.使用回调
 *
 fetchapi({
        url: "http://localhost:7499/Admin/Add",
        type: "post",
        data: {name: "test", password: "1111", nickname: "dddd"},
        success: function (result) {
            console.log(result);
        },
        error: function (errCode,message) {
            console.log(errCode,message);
        }
    })；
 */

var paramFormat=require("./paramFormat.js");
var httpCode=require("./httpCode.js");
var fetchapi=function(fetchmodel) {
    this.then=null;
    if (!fetchmodel || !fetchmodel instanceof  Object) {
        throw new Error("fetchmodel配置无效,不能为空,必须为对象");
        return false;
    }
    if(!fetchmodel.success&&!fetchmodel.promise) {
        throw new Error("promise属性设置false的时候,fetchmodel的success[请求成功函数]不能为空");
        return false;
    }
    else if(!fetchmodel.promise&&typeof fetchmodel.success !=="function") {
        throw new Error("fetchmodel的success[请求成功函数]必须为函数");
        return false;
    }

    if(fetchmodel.error&&typeof fetchmodel.error !=="function") {
        throw new Error("fetchmodel的error[请求失败函数]必须为函数");
        return false;
    }

    if(fetchmodel.data instanceof  Array) {
        throw new Error("fetchmodel的data参数必须是字符,空值,对象,FormData,不可以为数组");
        return false ;
    }
    if(fetchmodel.data.constructor===FormData)
    {//如果是FormData不进行处理，相当于jquery ajax中contentType=false,processData=false
        fetchmodel.contentType=false;//也设置为false
    }
    else if(fetchmodel.contentType==false)
    {//为false，也不处理

    }
    else if (fetchmodel.contentType==null||fetchmodel.contentType==undefined||fetchmodel.contentType=="") {//请求的数据格式,默认值

            //如果为false，是正确值
            fetchmodel.contentType = "application/x-www-form-urlencoded";

    }
  
    //如果是get方式，又有参数，则要将参数转换
  if (fetchmodel.type.toLowerCase() == "get") {
    //TODO 这里的代码要优化
    fetchmodel.data = paramFormat(fetchmodel.data);
    if (fetchmodel.data&&fetchmodel.url.indexOf("?") <= -1) {
      fetchmodel.url += "?";
    }
    if (fetchmodel.data&&fetchmodel.url.indexOf("?")>-1&&fetchmodel.url.indexOf("?") == fetchmodel.url.length - 1) {
      fetchmodel.url += fetchmodel.data;
    }
   else if (fetchmodel.data&& fetchmodel.url.indexOf("?")>-1&&fetchmodel.url.indexOf("?") < fetchmodel.url.length - 1) {
      fetchmodel.url += "&" + fetchmodel.data;
    }
  }

    //错误处理函数
    function errorHandler (fetchmodel, errCode, message) {
        console.log(errCode, message);
        if (typeof fetchmodel.error === "function") {//设置了错误事件,
            fetchmodel.error(errCode, message);
        }
    }


    if(fetchmodel.promise)
    {//直接返回promise对象
       return fetch(
            fetchmodel.url,
            {
                credentials: fetchmodel.credentials?'include':null,//附带cookies之类的凭证信息
                method:   fetchmodel.type,
                headers:fetchmodel.contentType? {
                    "Content-Type": fetchmodel.contentType
                }:{},
                body:fetchmodel.data? paramFormat(fetchmodel.data):null,
            }
        ) ;
    }
    else
    {
        fetch(
            fetchmodel.url,
            {
                credentials: fetchmodel.credentials?'include':null,//附带cookies之类的凭证信息
                method:   fetchmodel.type,
                headers:fetchmodel.contentType? {
                    "Content-Type": fetchmodel.contentType
                }:{},
                body:fetchmodel.data? paramFormat(fetchmodel.data):null,
            }
        ).then(function(res){
            if (res.ok) {

                   try
                   {
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
                           if (result.message) {//有标准的错误信息
                             errorHandler(result, result.errCode, result.message);
                           }
                           else {
                             errorHandler(result, 801, "服务器正常响应，后台业务代码的逻辑报错");
          
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
                    catch (e)
                    {
                      errorHandler(fetchmodel,802,e.message);
                    }


            }
            else {
                errorHandler(fetchmodel, res.status,httpCode[res.status] );
            }

        }).catch(function (e) {
            errorHandler(fetchmodel, "4xx", e.message);
        });
    }

};
module .exports=fetchapi;

