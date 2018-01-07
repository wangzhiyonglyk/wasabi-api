/**
 * @author 王志勇
 * @description fetch 请求 
 * @description date:2016-10-05 将原来pc端框架中fetch查询独立出来
 * @description date:2018-01-05 修复bug,调整逻辑
 * @description 因为fetch是系统的全局对象，命名不能叫fetch
 */
import paramFormat from "./paramFormat";//格式化参数
import validate from "./fetchValidate";//验证

export  default async (fetchModel) => {
    if (!validate(fetchModel)) {
        return;//参数无效返回
    }
    //格式化参数
    fetchModel.data = paramFormat(fetchModel.data);

    //设置头部信息
    fetchModel.headers = fetchModel.headers ? fetchModel.headers : {};
    fetchModel.contentType ? fetchModel.headers.contentType = fetchModel.contentType : null;
    let fetchBody = {
        method: fetchModel.type,//请求类型
        headers: fetchModel.headers,
        body: fetchModel.data//参数
    };

    //如果是get方式，又有参数，则要将参数转换
    if (fetchModel.type.toLowerCase() == "get") {
        if (fetchModel.data && fetchModel.url.indexOf("?") <= -1) {
            fetchModel.url += "?";
        }
        if (fetchModel.data && fetchModel.url.indexOf("?") > -1 && fetchModel.url.indexOf("?") == fetchModel.url.length - 1) {
            fetchModel.url += fetchModel.data;
        }
        else if (fetchModel.data && fetchModel.url.indexOf("?") > -1 && fetchModel.url.indexOf("?") < fetchModel.url.length - 1) {
            fetchModel.url += "&" + fetchModel.data;
        }
    }
    try {
        //开始请求
        let response= await fetch(
            fetchModel.url,
            fetchBody
        );
        if(response.ok){//处理成功
            return await response.json(); //返回json格式的数据 
        }
        else {
            errorHandler(fetchModel,response.status,response.statusText?response.statusText:response.url+response.status);
        }
        
         
    }
    catch (e) {
       
        errorHandler(fetchModel, "4xx", e.message);
    }


    //错误处理函数
    function errorHandler(fetchModel, errCode, message) {
        if (typeof fetchModel.error === "function") {//设置了错误事件,
            fetchModel.error(errCode, message);
        }
        else {
           throw new Error(message);
        }
    }

}
