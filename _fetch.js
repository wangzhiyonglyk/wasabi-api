/**
 * @author 王志勇
 * @description fetch 请求 
 * @description date:2016-10-05 将原来pc端框架中fetch查询独立出来
 * @description date:2018-01-05 修复bug,调整逻辑
 * @description 因为fetch是系统的全局对象，命名不能叫fetch
 * @description date:2018-01-08 修复bug,contentType字段写错了
 *  @description date:2018-01-15 修复bug，增加返回headers
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
