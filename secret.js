/*
add by wangzhiyong
date:2017-07-12
edit  2017-11-26
 ajax加密请求方法
*/
import crypto from "crypto-js";
import validate from "./validate";
import fetchValidate from "./fetchValidate";
import ajax from "./ajax";
import fetchApi from "./fetchApi";

export default  (settings,type="fetch",secretType="HmacSHA1",secretKey="") =>{
    //先验证字符有效性
     if(type=="fetch"&&!fetchValidate(settings)){
       return ;
     }
     else if(!validate(settings)){
         return  ;
     }

    if (!crypto[secretType]) {
        throw new Error("加密方式无效[MD5,SHA-1,SHA-256,AES,RabbitMARC4,HMAC,HMAC-MD5,HMAC-SHA1,HMAC-SHA256,PBKDF2]");
    }
    if (secretType != "MD5"&&!secretKey) {
        throw new Error("非MD5,密钥secretKey不能为空");
    }
    try {
        //将所业务参数与签名参数合并
        let keyObj = Object.assign(typeof settings.data === "object" ? settings.data : {}, typeof settings.headers === "object" ? settings.headers : {});//所以有参数
        let keyNameArr = [];//所有参数名
        for (let key in keyObj) {
            keyNameArr.push(key);
        }
        keyNameArr.sort();//将参数名排序
        /*
        先拼接参数字符串,然后再按照加密方式加密后转成base64,得到签名sign字段
        */
        let sign = crypto[secretType](keyNameArr.map((key, index) => {
            //将参数值格式化
            let value = keyObj[key] ? typeof keyObj[key] === "object" ? JSON.stringify(keyObj[key]) : keyObj[key] : "";
            return key + "=" + value;
        }).join("&"), secretKey).toString(crypto.enc.Base64);
        //如果没有传
        settings.headers = typeof settings.headers === "object" ? settings.headers : {};//处理headers;防止出错
        //将签名加入到请求头部
        settings.headers.sign = sign;
        return type=="fetch"?fetchApi(settings):ajax(settings);//开始请求
    }
    catch (e) {
        throw new Error(e.message);
    }

}

