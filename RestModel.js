/**
 * Created by apple on 2016/11/6.
 * 单独为rest设置模型
 */

class RestModel
{
    constructor(controller=null,success,error=null)
    {

        this.controller=controller;//控制器名称
        this.success=success;//成功处理函数
        this.error=error;//错误处理函数

        this.model=null;//参数
        this.id=null;//id,get与delete方法所用
        this.paramModel=null;//查询条件
        this.paramModelName=null;//自定义的查询参数名称
        this.pageModel=null;//分页条件

        this.async=true;//是否异步
        this.timeout=25000;//超时


    }
}
module .exports=RestModel;