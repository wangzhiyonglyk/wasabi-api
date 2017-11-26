/*
add by wangzhiyong
date:2017-07-12
edit  2017-11-26
 ajax加密请求方法
*/
import crypto from "crypto-js";
import validate from "./validate";
import ajax from "./ajax";
export default function (settings) {
    if (!validate(settings)) {//验证有效性
        return;
    }
    if (!settings.secretType) {//加密方式
        settings.secretType = "HmacSHA1";//默认使用HMAC-SHA1加密方式
    }
    else if (!crypto[settings.secretType]) {
        throw new Error("加密方式无效");
    }
    if (!settings.secretKey && settings.secretType != "MD5") {
        throw new Error("密钥secretKey不能为空");
    }
    try {
        //将所业务参数与签名参数排序
        let keyObj = Object.assign(typeof settings.data === "object" ? settings.data : {}, typeof settings.headers === "object" ? settings.headers : {});//所以有参数
        let keyNameArr = [];//所有参数名
        for (let key in keyObj) {
            keyNameArr.push(key);
        }
        keyNameArr.sort();//将参数名排序
        //拼接参数字符串,并且加密得到签名sign字段
        let sign = crypto[settings.secretType](keyNameArr.map((key, index) => {
            //将参数值格式化
            let value = keyObj[key] ? typeof keyObj[key] === "object" ? JSON.stringify(keyObj[key]) : keyObj[key] : "";
            return key + "=" + value;
        }).join("&"), settings.secretKey).toString(crypto.enc.Base64);
        //如果没有传
        settings.headers = typeof settings.headers === "object" ? settings.headers : {};//处理headers;防止出错
        //将签名加入到请求头部
        settings.headers.sign = sign;
        ajax(settings);//开始请求
    }
    catch (e) {
        throw new Error(e.message);
    }

}

