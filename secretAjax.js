/*
add by wangzhiyong
date:2017-07-12
 ajax加密请求方法
*/
import crypto from "crypto-js";
import paramFormat from "./paramFormat";
import validate from "./validate";
import ajax from "./ajax";
let secretAjax = function (settings) {
    if (!validate()) {
        return;
    }
    if (!settings.secretType) {//加密方式
        settings.secretType = "HmacSHA1";//默认使用HMAC-SHA1加密方式
    }
    else if (!crypto[settings.secretType]) {
        throw new Error("加密方式无效");
    }
    try {
        //将所业务参数与签名参数排序
        let keyArr = [...paramFormat(typeof settings.data === "object" ? settings.data : {}).keys, ...(typeof settings.headers === "object" ? settings.headers : {}).keys];
        let keyObj = Object.assign(typeof settings.data === "object" ? settings.data : {}, typeof settings.headers === "object" ? settings.headers : {});
        keyArr.sort();//排序
        //拼接参数字符串,并且加密得到签名sign字段
        let sign = crypto[settings.secretType](keyArr.map((item, index) => {
            return item + "=" + keyObj[item];
        }).join("&"), settings.secretKey);
        settings.headers = typeof settings.headers === "object" ? settings.headers : {};//处理headers;防止出错
        //将签名加入到请求头部
        settings.headers.sign = crypto.enc.Base64.stringify(sign);
        ajax(settings);//开始请求
    }
    catch (e) {
        throw new Error(e.message);
    }

}
module.exports = secretAjax;