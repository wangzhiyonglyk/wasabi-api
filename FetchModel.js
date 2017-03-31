/**
 * Created by zhiyongwang
 * date:2016-10-05 将原来pc端框架中fetch查询独立出来
 * desc:fetch 查询时的数据模型
 *
 */

class FetchModel
{
    constructor(url,success,data=null,error=null,type="GET")
    {
        this.url=url;
        this.data=data;
        this.success=success;
        this.error=error;
        this.type=type;//类型
        this.contentType="application/x-www-form-urlencoded";//请求数据格式
        this.credentials=false;//是否带上cookie
        this.promise=false;//是否返回promise对象，如果为true,则fetchapi就可以使用then来处理异步
    }
}
module .exports=FetchModel;