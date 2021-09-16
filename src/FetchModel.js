
/**
 * @author 王志勇
 * @description date:2016-10-05 将原来pc端框架中fetch查询独立出来
 * @description date:2018-01-05 调整参数顺序，去掉不必要的参数
 *
 */

export default class FetchModel
{
    /**
     * fetch 请求的参数模型
     * @param {string} url  请求参数
     * @param {object,FormData,string} data 请求的参数
     * @param {string} type 请求类型
     * @param {string} contentType 请求的数据格式
     * @param {function} headers 请求的头部信息
     */
    constructor(url,data=null,type="GET",contentType="application/x-www-form-urlencoded",headers=null)
    {
        this.url=url;
        this.data=data;
        this.type=type;//类型
        this.contentType=contentType;
        this.headers=headers;      
    }
}
