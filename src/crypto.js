
/**
 * @author 王志勇
 * @description 加密 
 * @description date:2020-04-27 
 * 2020-09-22 修复加密bug
 *
 */
import crypto from "crypto-js";


export default function(str,secretType,secretKey){
    if (!crypto[secretType]) {
        throw new Error("加密方式无效[MD5,SHA1,SHA256,AES,HMAC,HmacMD5,HmacSHA1,HmacSHA256]");
    }
    if (secretType != "MD5" && secretType != "SHA1" && secretType != "SHA256" && !secretKey) {
        throw new Error("非MD5,SHA1,SHA256,密钥secretKey不能为空");
    }
    
    let sign = (secretType != "MD5" && secretType != "SHA1" && secretType != "SHA256") ? crypto[secretType](str, secretKey).toString() : crypto[secretType](str).toString();
    return sign;
}
