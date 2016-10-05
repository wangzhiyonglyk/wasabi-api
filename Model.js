/**
 * Created by wangzhiyong on 16/10/5.
 * ajax数据模型
 */
class Model
{
    constructor(type="GET",url,success,data=null,error=null)
    {
        this.type=type;//请求类型
        this.url=url;//请求地址
        this.data=data;//参数
        this.success=success;//成功处理ibov
        this.error=error;//错误处理函数
        this.dataType="json";//返回的数据格式
        this.contentType="application/x-www-form-urlencoded";//请求数据格式
        this.async=true;//是否异步
        this.timeout=null;//超时

    }
}
module .exports=Model;