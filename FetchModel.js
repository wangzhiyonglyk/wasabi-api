/**
 * Created by zhiyongwang
 * date:2016-10-05 将原来pc端框架中fetch查询独立出来
 * desc:fetch 查询时的数据模型
 *
 */

class FetchModel
{
    constructor(url,success,params=null,error=null)
    {
        this.url=url;
        this.params=params;
        this.success=success;
        this.error=error;

    }
}
module .exports=FetchModel;