/*
add by wangzhiyong
date:2017-07-12
edit  2017-11-26
 ajax加密请求方法
*/
/**
 * @author 王志勇
 * @description fetch 请求 
 * @description date:2017-07-12 
 * @description edit  2017-11-26 修复bug,调整逻辑
 * @description date 2017-01-05 因为fetch是系统的全局对象，命名不能叫fetch
 * @description date:2018-01-08 修复bug,增加ignore参数，调整加密类型 
 *  * @description date:2018-01-15 修复bug，增加返回headers
 */
import crypto from "crypto-js";
import validate from "./validate";
import fetchValidate from "./fetchValidate";
import ajax from "./ajax";
import _fetch from "./_fetch";
import help from "./help";

/**
 * 加密请求
 *@param {{}} settings  请求参数
 *@param {string} secretKey  密钥
 *@param {string} secretType  加密方式
 *@param {[]} ignore  不参与加密的字段
 *@param {string} type  请求类型，ajax,fetch
 */
export default (settings = {}, secretKey = "", secretType = "HmacSHA256", ignore =[], type = "fetch") => {
    //先验证字符有效性
    if (type == "fetch" ? !fetchValidate(settings) : !validate(settings)) {
        return;
    }
    if (!crypto[secretType]) {
        throw new Error("加密方式无效[MD5,SHA1,SHA256,AES,HMAC,HmacMD5,HmacSHA1,HmacSHA256]");
    }
    if (secretType != "MD5" && secretType != "SHA1" && secretType != "SHA256" && !secretKey) {
        throw new Error("非MD5,SHA1,SHA256,密钥secretKey不能为空");
    }
    if (!ignore) {//如果设置为空值，做兼容处理
        ignore = {};//
    }
    try {
        //将所业务参数与签名参数合并
        if (!help.isEmptyObject(settings.data) && !help.isEmptyObject(settings.headers)) {
            //如果 头部与body参数都不是空，才加密
            //拿到头部与body中的参数
            let keyObj = Object.assign({},  settings.data ,  settings.headers );//所以有参数
            let keyNameArr = [];//所有参数名
            for (let key in keyObj) {
                if (ignore.indexOf(key)<=-1) {//非忽略的参数
                    keyNameArr.push(key);
                }
            }
            keyNameArr.sort();//将参数名排序
            /*
            先拼接参数字符串,然后再按照加密方式加密后转成base64,得到签名sign字段
            */
            let urlstr = keyNameArr.map((key, index) => {
                //将参数值格式化，如果是值为对象则转为字符串
                let value = keyObj[key] ? typeof keyObj[key] === "object" ? JSON.stringify(keyObj[key]) : keyObj[key] : "";
                return  key + "=" + value;//值为空则加密
             
            }).join("&");

            let sign = (secretType != "MD5" && secretType != "SHA1" && secretType != "SHA256") ? crypto[secretType](urlstr, secretKey).toString(crypto.enc.Base64) : crypto[secretType](urlstr).toString(crypto.enc.Base64);

            //如果没有传
            settings.headers = typeof settings.headers === "object" ? settings.headers : {};//处理headers;防止出错
            //将签名加入到请求头部
            settings.headers.sign = sign;

        }
       
        return type == "fetch" ? _fetch(settings) : ajax(settings);//开始请求
    }
    catch (e) {
        throw new Error(e.message);
    }

}

