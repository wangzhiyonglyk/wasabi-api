/**
 * Created by wangzhiyong on 16/10/5.
 * 将rest独立出来
 * ** date;2016-11-05 修改
 */

   var ajax= require("./ajax.js");
//RSST开发模式
var rest={
    validate:function(settings,type) {
        if (!settings || !settings instanceof  Object) {
            throw new Error("ajax配置无效,不能为空,必须为对象");
            return  false;
        }

        if(!settings.controller) {//控制器为空
            throw new Error("ajax的controller[控制器]不能为空");
            return  false;
        }

        if(!settings.corsUrl) {//允许为空,则为当前域名
            settings.corsUrl = "/";
        }
        else if(typeof settings.corsUrl !=="string")
        {
            throw  new Error("corsUrl 必须为字符类型");
            return  false;
        }
        if(!settings.success) {
            throw new Error("ajax的success[请求成功函数]不能为空");
            return  false;
        }
        else if(typeof settings.success !=="function")
        {
            throw new Error("ajax的success[请求成功函数]必须为函数");
            return  false;
        }

        if(settings.error&&typeof settings.error !=="function") {
            throw new Error("ajax的error[请求失败函数]必须为函数");
            return  false;
        }

        if(!type) {
            switch (type)
            {
                case "get"://获取实例模型
                    if(settings.id==null||settings.id==undefined)
                    {
                        throw  new Error("id参数不能空");
                        return  false;
                    }
                    else if(typeof settings.id !=="number")
                    {
                        throw  new Error("id必须为数字");
                        return  false;
                    }
                    break;
                case "add"://新增或者修改
                    if(settings.model ==null||settings.model==undefined)
                    {
                        throw new Error("数据模型不能为空");
                        return  false;
                    }
                    break;
            }
        }
        return  true;
    },
    //获取模型
    getModel:function(settings) {
        /// <summary>
        /// 获取模型
        /// </summary>
        /// <param name="settings" type="object">settings</param>
        if(!settings.corsUrl) {//允许为空,则为当前域名
            settings.corsUrl = "/";
        }
        if(this.validate(settings)) {
            ajax({
                type: "GET",
                url: settings.corsUrl + settings.controller + "/GetModel",
                async:settings.async,
                dataType: "json",
                timeout: settings.timeout?settings.timeout:25000,
                success: settings.success,
                error: settings.error,
            });
        }
    },
    //获取模型实例
    get:function() {
        /// <summary>
        /// 获取模型实例
        /// </summary>
        /// <param name="settings" type="object">settings</param>
        if(!settings.corsUrl) {//允许为空,则为当前域名
            settings.corsUrl = "/";
        }
       if(this.validate(settings,"get"))
       {
           ajax({
               type: "GET",
               url: settings.corsUrl + settings.controller+ "/Get?id="+id,
               async:settings.async,
               dataType: "json",
               timeout: settings.timeout?settings.timeout:25000,
               success: settings.success,
               error: settings.error,
           });
       }


    },
    //新增
    add:function(settings) {
        /// <summary>
        /// 新增
        /// </summary>
        /// <param name="settings" type="object">settings</param>
        if(!settings.corsUrl) {//允许为空,则为当前域名
            settings.corsUrl = "/";
        }
        var data={};
       if( this.validate(settings,"add")) {
           if(settings.model instanceof  Array)
           {//如果是数组，则将其转对象
               data={model:settings.model};
           }
           else
           {
               data=settings.model;
           }

           ajax({
               type: "POST",
               url: settings.corsUrl + settings.controller+ "/Add",
               async:settings.async,
               dataType: "json",
               timeout: settings.timeout?settings.timeout:25000,
               data:data,
               success: settings.success,
               error: settings.error,
           });
       }


    },
    //更新
    update:function(settings) {
        /// <summary>
        /// 更新
        /// </summary>
        /// <param name="settings" type="object">settings</param>
        if(!settings.corsUrl) {//允许为空,则为当前域名
            settings.corsUrl = "/";
        }
        var data={};//数据模型
        if( this.validate(settings,"add")) {
            if(settings.model instanceof  Array)
            {//如果是数组，则将其转对象
                data={model:settings.model};
            }
            else
            {
                data=settings.model;
            }

            ajax({
                type: "POST",
                url: settings.corsUrl + settings.controller+ "/Update",
                async:settings.async,
                dataType: "json",
                timeout: settings.timeout?settings.timeout:25000,
                data:data,
                success: settings.success,
                error: settings.error,
            });
        }

    },
    //删除
    delete:function(settings) {
        /// <summary>
        /// 删除
        /// </summary>
        /// <param name="settings" type="object">settings</param>
        if(!settings.corsUrl) {//允许为空,则为当前域名
            settings.corsUrl = "/";
        }
        var type="POST";//请求类型
       if(this.validate(settings)) {


           var url = settings.corsUrl + settings.controller + "/Delete";
           var data = {};//因为要转换为后端能解析的数据格式必须是对象
           if (settings.paramModel instanceof Array) {
               if (settings.paramModelName != undefined && settings.paramModelName != null && settings.paramModelName !== "") {//自定义,不为空
                   if (typeof  settings.paramModelName === "string") {
                       data[settings.paramModelName] = settings.paramModel;
                   }
                   else {
                       throw  new Error("paramModelName[自定义条件参数名称]必须为字符类型");
                       return false;
                   }
               }
               else {
                   data.paramModel = settings.paramModel;//默认对象名
               }
           }
           else if (typeof  (paramModel * 1) === "number") {//数值型

               type = "GET";
               url = url + "?id=" + paramModel;
               data = null;
           }
           else {
               throw new Error("paramModel要么查询格式的数组,要么为id字段数字");
               return false;
           }

           ajax({
               type: type,
               url: url,
               async:settings.async,
               dataType: "json",
               timeout: settings.timeout ? settings.timeout : 25000,
               data: data,
               success: settings.success,
               error: settings.error
           });
       }
    },
    //条件查询
    query:function( settings) {
        /// <summary>
        /// 条件查询
        /// </summary>
        /// <param name="settings" type="array">settings</param>
        if(!settings.corsUrl) {//允许为空,则为当前域名
            settings.corsUrl = "/";
        }
        if(this.validate(settings)) {
            var data={};//因为要转换为后端能解析的数据格式必须是对象

            if (!settings.paramModel||(settings.paramModel && settings.paramModel instanceof Array)) {

            }
            else {
                throw  new Error("paramModel[查询条件]格式不正确,要么为空要么为是数组");
                return false;
            }

            if (settings.paramModelName != undefined && settings.paramModelName != null && settings.paramModelName !== "") {//自定义,不为空
                if (typeof  settings.paramModelName === "string") {
                    data[settings.paramModelName] = settings.paramModel;
                }
                else {
                    throw  new Error("paramModelName[自定义查询条件参数名称]必须为字符类型");
                    return false;
                }
            }
            else {
                data.paramModel = settings.paramModel;//默认对象名
            }

            ajax({
                type: "POST",
                url: "/" + settings.controller + "/Query",
                async:settings.async,
                dataType: "json",
                timeout: settings.timeout?settings.timeout:25000,
                data:data,
                success: settings.success,
                error:settings. error
            });
        }

    },
    //分页条件查询
    page:function(settings) {
        /// <summary>
        /// 分页条件查询
        /// </summary>
        /// <param name="settings" type="object">settings</param>
        if(!settings.corsUrl) {//允许为空,则为当前域名
            settings.corsUrl = "/";
        }
        if(this.validate(settings)) {
            if (settings.pageModel && settings.pageModel instanceof Object) {

            }
            else {
                throw  new Error("pageModel[分页参数]格式不正确,不能为空必须是对象");
                return false;
            }
            ajax({
                type: "POST",
                url: "/" + settings.controller + "/Page",
                async: settings.async,
                dataType: "json",
                timeout: settings.timeout ? settings.timeout : 25000,
                data: settings.pageModel,
                success: settings.success,
                error: settings.error
            })
        }

    },
};

module .exports=rest;