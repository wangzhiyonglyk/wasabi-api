/**
 * @author 王志勇
 * @description fetch 请求 
 * @description date:2016-10-05 将原来pc端框架中fetch查询独立出来
 * @description date:2018-01-05 修复bug,调整逻辑
 * @description 因为fetch是系统的全局对象，命名不能叫fetch
 * @description date:2018-01-08 修复bug,contentType字段写错了
 *  @description date:2018-01-15 修复bug，增加返回headers
 *  @description date:2018-01-16 输出日志，增加请求格式日志
 * 2021-04-10
 * 目前只支持json数据查询
 */
import paramFormat from "./paramFormat";//格式化参数
import validate from "./fetchValidate";//验证
import help from "./help";
export default async (fetchModel) => {
    if (!validate(fetchModel)) {
        return;//参数无效返回
    }
    //格式化参数
    fetchModel.data = paramFormat(fetchModel.data);

    //设置头部信息
    fetchModel.headers = fetchModel.headers ? fetchModel.headers : {};
    if(fetchModel.headers instanceof Object){
        for(let prop in fetchModel.headers){
            fetchModel.headers[prop]=encodeURI(fetchModel.headers[prop]);//防止无法传输中文
        }
    }
    //如何设置传输类型
    fetchModel.contentType ? fetchModel.headers["Content-Type"] = fetchModel.contentType : null;
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
        console.log("fetch请求开始，地址:",fetchModel.url);
        console.log("fetch请求开始，参数体:",fetchBody);
        //开始请求
        let response = await fetch(
            fetchModel.url,
            fetchBody
        );
        
        if (response.ok) {//处理成功
            let result= await response.json();
            if(!help.isEmptyObject(result)&&!help.isEmptyObject(response.headers))
            {//不为空对象，拿到返回的头部信息
                result.headers=response.headers;
            }
          return  Promise.resolve( result); //返回json格式的数据 
        }
        else {
            return Promise.reject( "请求错误："+(response.statusText?response.statusText:"") + response.status);
        }


    }
    catch (e) {

        return Promise.reject( "请求错误："+e.message);
    }

}
