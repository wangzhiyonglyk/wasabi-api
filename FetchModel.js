/**
 * Created by zhiyongwang
 * date:2016-10-05 将原来pc端框架中fetch查询独立出来
 * desc:fetch 查询时的数据模型
 *
 */

class FetchModel
{
    constructor(url,success,params=null,error=null,lang="java",type="GET")
    {
        this.url=url;
        this.params=params;
        this.success=success;
        this.error=error;
        this.lang=lang;
        this.type=type;//类型,专门用于then

    }
}
module .exports=FetchModel;