/**
 * @author 王志勇
 * @description fetch 请求
 * @description date:2017-07-12
 * @description edit  2017-11-26 修复bug,调整逻辑
 * @description date 2017-01-05 因为fetch是系统的全局对象，命名不能叫fetch
 * @description date:2018-01-08 修复bug,增加ignore参数，调整加密类型
 * @description date:2018-01-15 修复bug，增加返回headers
 * @description date:2018-01-21 修复bug，header与body都为空才不加密，其他情况都要加密
 * @description 2020-09-22 修复加密bug
 * @description 2022-09-22 修复加密bug,加上设计说明
 * 
 * 利用JWT技术在前端加密
 * 1.先把header与body中的字段拿出来，然后将参数按ASCII顺序先拼接URL式的字符串,然后再按照加密方式加密后转成Base64url,得到签名sign字段,放到头部
 * 2.如果参数值为对象，则要将值JSON.stringify
 */

import crypto from "crypto-js";
import validate from "./validate";
import fetchValidate from "./fetchValidate";
import ajax from "./ajax";
import fetch from "./fetch";
import help from "./help";

/**
 * 加密请求
 *@param {{}} settings  请求参数
 *@param {string} secretKey  密钥
 *@param {string} secretType  加密方式
 *@param {[]} ignore  不参与加密的字段
 *@param {string} type  请求类型，ajax,fetch
 */
export default (
  settings = {},
  secretKey = "",
  secretType = "HmacSHA256",
  ignore = {},
  type = "ajax"
) => {
  //先验证字符有效性
  if (type == "fetch" ? !fetchValidate(settings) : !validate(settings)) {
    return;
  }
  if (!crypto[secretType]) {
    throw new Error(
      "加密方式无效[MD5,SHA1,SHA256,SHA512,AES,HmacMD5,HmacSHA1,HmacSHA256,HmacSHA512]"
    );
  }
  if (
    secretType != "MD5" &&
    secretType != "SHA1" &&
    secretType != "SHA256" &&
    secretType!="SHA512"&&
    !secretKey
  ) {
    throw new Error("非MD5,SHA1,SHA256,密钥secretKey不能为空");
  }
  ignore = ignore || {}; //如果没有设置，设置为空对象
  try {
    //将所业务参数与签名参数合并
    let keyObj = Object.assign({}, settings.data, settings.headers); //所以有参数
    if (!help.isEmptyObject(keyObj)) {
      //如果 头部与body参数都是空才不加密
      //拿到头部与body中的参数
      let keyNameArr = []; //所有参数名
      for (let key in keyObj) {
        if (ignore.indexOf(key) <= -1) {
          //非忽略的参数
          keyNameArr.push(key);
        }
      }
      keyNameArr.sort(); //将参数名排序
      /*
            先拼接参数字符串,然后再按照加密方式加密后转成Base64url,得到签名sign字段,放到头部
            */
      let urlstr = keyNameArr
        .map((key, index) => {
          //将参数值格式化，如果是值为对象则转为字符串
          let value = keyObj[key]
            ? typeof keyObj[key] === "object"
              ? JSON.stringify(keyObj[key])
              : keyObj[key]
            : "";
          return key + "=" + value; //值为空则加密
        })
        .join("&");

      let sign =
        secretType != "MD5" && secretType != "SHA1" && secretType != "SHA256"
          ? crypto[secretType](urlstr, secretKey).toString(crypto.enc.Base64url)
          : crypto[secretType](urlstr).toString(crypto.enc.Base64url);

      //如果没有传
      settings.headers =
        typeof settings.headers === "object" ? settings.headers : {}; //处理headers;防止出错
      //将签名加入到请求头部
      settings.headers.sign = sign;
    }
return type == "fetch" ? fetch(settings) : ajax(settings); //开始请求
 
  } catch (e) {
    throw new Error(e.message);
  }
};
