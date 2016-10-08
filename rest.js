/**
 * Created by wangzhiyong on 16/10/5.
 * 将rest独立出来
 *
 */

   var ajax= require("./ajax.js");
//RSST开发模式
var rest={
    //获取模型
    getModel:function(controllerName,success,error,baseURl) {
        if(!baseURl)
        {
            baseURl="";
        }
        else if(typeof baseURl !=="string")
        {
            throw  new Error("baseURL 必须为字符类型");
            return ;
        }

        ajax({
            type: "GET",
            url:  baseURl + controllerName + "/GetModel",
            dataType: "json",
            timeout: 25000,
            success: success,
            error: error,
        });
    },
    //获取模型实例
    get:function(controllerName,id,success,error,baseURl) {
        if(!baseURl)
        {
            baseURl="";
        }
        else if(typeof baseURl !="string")
        {
            throw  new Error("baseURL 必须为字符类型");
            return ;
        }

        ajax({
            type: "GET",
            url:  baseURl + controllerName + "/Get?id="+id,
            dataType: "json",
            timeout: 25000,
            success: success,
            error: error
        });
    },
    //新增
    add:function(controllerName,model,success,error,baseURl) {
        var data={};
        if(!baseURl)
        {
            baseURl="";
        }
        else if(typeof baseURl !="string")
        {
            throw  new Error("baseURL 必须为字符类型");
            return ;
        }

        if(model instanceof  Array)
        {//如果是数组，则将其转对象
            data={model:model};
        }
        else
        {
            data=model;
        }
        ajax({
            type: "POST",
            url:  baseURl+ controllerName + "/Add",
            dataType: "json",
            timeout: 25000,
            data:data,
            success: success,
            error: error
        });
    },
    //更新
    update:function(controllerName,model,success,error,baseURl) {
        if(!baseURl)
        {
            baseURl="";
        }
        else if(typeof baseURl !="string")
        {
            throw  new Error("baseURL 必须为字符类型");
            return ;
        }

        if(model instanceof  Array)
        {//如果是数组，则将其转对象
            data={model:model};
        }
        else
        {
            data=model;
        }
        ajax({
            type: "POST",
            url: baseURl+ controllerName + "/Update",
            dataType: "json",
            timeout: 25000,
            data:data,
            success: success,
            error: error
        });
    },
    //删除
    delete:function(controllerName,paramModel,success,error,baseURl,paramModelName) {
        var type="POST";
        if(!baseURl)
        {
            baseURl="";
        }
        else if(typeof baseURl !="string")
        {
            throw  new Error("baseURL 必须为字符类型");
            return ;
        }

        var url= baseURl+ controllerName + "/Delete";
        var data={};//因为要转换为后端能解析的数据格式必须是对象
        if(paramModel instanceof  Array)
        {
            if(paramModelName!=undefined&&paramModelName!=null&&paramModelName!=="")
            {
                if(typeof  paramModelName ==="string") {
                    data[paramModelName] = paramModel;
                }
                else
                {
                    throw  new Error("paramModelName 必须为字符类型");
                    return ;
                }
            }
            else {
                data.paramModel=paramModel;//默认对象名
            }
        }
        else if(typeof  (paramModel*1) ==="number" ){//数值型

            type="GET";
            url=url+"?id="+paramModel;
            data=null;
        }
        else{
            throw new Error("paramModel 要么查询格式的数组,要么为id字段数字");
            return ;
        }

        ajax({
            type: type,
            url: url,
            dataType: "json",
            timeout: 25000,
            data:data,
            success: success,
            error: error
        });
    },
    //条件查询
    postList:function( controllerName,paramModel,success,error,baseURl,paramModelName) {
        if(!baseURl)
        {
            baseURl="";
        }
        else if(typeof baseURl !="string")
        {
            throw  new Error("baseURL 必须为字符类型");
            return ;
        }

        var data={};//因为要转换为后端能解析的数据格式必须是对象
        if(paramModelName!=undefined&&paramModelName!=null&&paramModelName!=="")
        {
            data[paramModelName]=paramModel;
        }
        else {
            data.paramModel=paramModel;//默认对象名
        }
        ajax({
            type: "POST",
            url: "/" + controllerName + "/PostList",
            dataType: "json",
            timeout: 25000,
            data:data,
            success: success,
            error: error
        });
    },
    //分页条件查询
    postListPage:function(controllerName,pageModel,success,error,baseURl) {
        if(!baseURl)
        {
            baseURl="";
        }
        else if(typeof baseURl !="string")
        {
            throw  new Error("baseURL 必须为字符类型");
            return ;
        }

        if(pageModel instanceof  Object)
        {

        }
        else
        {
            throw  new Error("pageModel-条件参数格式不正确,必须是对象");
            return ;
        }
        ajax({
            type: "POST",
            url: "/" + controllerName + "/PostList",
            dataType: "json",
            timeout: 25000,
            data:pageModel,
            success: success,
            error: error
        });
    },
};

module .exports=rest;