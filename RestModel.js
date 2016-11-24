/**
 * Created by apple on 2016/11/6.
 * 单独为rest设置模型
 */

class RestModel
{
    constructor(controller,success,error=null)
    {

        this.controller=controller;//控制器名称
        this.success=success;//成功处理函数
        this.error=error;//错误处理函数
        this.model=null;//参数
        this.id=null;//id,get与delete方法所用
        this.paramModel=null;//查询条件
        this.paramModelName="paramModel";//因为查询条件是数组,但回传给后台必须是对象,所以可以自定义的查询参数名称
        this.pageModel=null;//分页条件
        this.async=true;//是否异步
        this.timeout=25000;//超时
        this.corsUrl="/";//超时


    }
}
module .exports=RestModel;

var api=require("wasabi-api");
api.rest.page({
    controller: "User",
    pageModel:{pageIndex:1,pageSize:20,sortName:"id",sortOrder:"asc",paramModel:[{field:"id",val:3,type:"int",whereType:"equal"}]},
    success: function(result){
    },
    error:  function (XMLHttpRequest, status, message) {

    }
});