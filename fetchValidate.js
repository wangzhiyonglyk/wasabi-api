

/**
 * 验证
 * @param {{}} fetchModel fetch 请求的配置参数
 * @returns bool
 */
export default  (fetchModel) =>{
    if (!fetchModel || !(fetchModel instanceof Object)) {
        throw new Error("fetchModel配置无效,不能为空,必须为对象");

    }
    if (fetchModel.data instanceof Array) {
        throw new Error("fetchModel的data参数必须是字符,空值,对象,FormData,不可以为数组");
    }
    if(typeof fetchModel.type!=="string"){
        throw new Error("fetchModel中的type参数必须是字符");
    }
    if (!fetchModel.type) { //请求方式
        fetchModel.type = "GET";
    }
    if (!fetchModel.url) {
        throw new Error("请求地址不能为空");
    }
    if(typeof fetchModel.url!=="string"){
        throw new Error("fetchModel中的url参数必须是字符");
    }
    if (fetchModel.error && typeof fetchModel.error !== "function") {
        throw new Error("fetchModel的error[请求失败函数]必须为函数");

    }
    if (fetchModel.contentType == null || fetchModel.contentType == undefined || fetchModel.contentType == "") { //请求的数据格式,默认值
        //如果为false，是正确值
        fetchModel.contentType = "application/x-www-form-urlencoded"; //默认表单提交
    }
    if (fetchModel.headers && !(fetchModel.headers instanceof Object)) {
        throw new Error("fetchModel中的headers要么为空，要么为对象");

    }

  return true;
}