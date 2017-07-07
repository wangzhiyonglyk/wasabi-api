/**
 * Created by wangzhiyong on 16/10/5.
 * 将rest独立出来
 *  date;2016-11-05 修改
 * date:2017-07-07 修改bug,完善逻辑与注释，及简化实现方式
 */

var ajax = require("./ajax.js");

/**
 * restful 请求方式
 */
var rest = {
    /**
     * 设置默认参数
     * @param {oject} settings 请求对象
     * @returns {object}
     */
    defaultArgs: function (settings) {
        if (!settings.corsUrl) {//允许为空,则为当前域名
            settings.corsUrl = "/";
        }
        return settings;

    },
    /** 
     * 验证
     * @returns {boolean}
    */
    validate: function (settings, type) {
        if (!settings || !(settings instanceof Object)) {
            throw new Error("ajax配置无效,不能为空,必须为对象");

        }

        if (!settings.controller) {//控制器为空
            throw new Error("ajax的controller[控制器]不能为空");

        }

        if (!settings.corsUrl) {//允许为空,则为当前域名
            settings.corsUrl = "/";
        }
        else if (typeof settings.corsUrl !== "string") {
            throw new Error("corsUrl 必须为字符类型");

        }
        if (!settings.success) {
            throw new Error("ajax的success[请求成功函数]不能为空");

        }
        else if (typeof settings.success !== "function") {
            throw new Error("ajax的success[请求成功函数]必须为函数");

        }

        if (settings.error && typeof settings.error !== "function") {
            throw new Error("ajax的error[请求失败函数]必须为函数");

        }

        if (!type) {
            switch (type) {
                case "get"://获取实例模型
                    if (!settings.id) {
                        throw new Error("id参数不能空");
                    }
                    break;
                case "add"://修改
                case "update"://修改
                    if (!settings.model) {
                        throw new Error("数据模型不能为空");
                    }
                    break;
                case "query"://条件查询
                case "page"://分页查询
                    if (settings.pageModel && settings.pageModel instanceof Object) {
                        //不能为空
                        if (!settings.pageModel.paramModel || (settings.pageModel.paramModel && settings.pageModel.paramModel instanceof Array)) {
                            //是否数组
                        }
                        else {
                            //可以为空
                            throw new Error("pageModel中的paramModel[查询条件]格式不正确,要么为空要么为是数组");
                        }

                    }
                    else {
                        throw new Error("pageModel[分页参数]格式不正确,不能为空必须是对象");
                    }
                    break;
            }
        }
        return true;
    },
    /**
     * 获取表结构
      * @param {oject} settings 请求对象
     * @returns {boolean}
     */
    getModel: function (settings) {
        if (this.validate(settings)) {
            ajax({
                type: settings.type ? settings.type : "GET",
                url: settings.corsUrl + settings.controller,
                async: settings.async,
                contentType: settings.contentType,
                dataType: "json",
                headers: settings.headers,
                timeout: settings.timeout ? settings.timeout : 25000,
                success: settings.success,
                error: settings.error,
            });
        }
    },
    /**
     * 获取实例
     *  @param {oject} settings 请求对象
     * @returns {boolean}
     */
    get: function () {

        if (!settings.corsUrl) {//允许为空,则为当前域名
            settings.corsUrl = "/";
        }
        if (this.validate(settings, "get")) {
            ajax({
                type: settings.type ? settings.type : "GET",
                url: settings.corsUrl + settings.controller + "/" + id,
                async: settings.async,
                contentType: settings.contentType,
                dataType: "json",
                headers: settings.headers,
                timeout: settings.timeout ? settings.timeout : 25000,
                success: settings.success,
                error: settings.error,
            });
        }


    },
    /**
     * 新增实例
     *  @param {oject} settings 请求对象
     * @returns {null}
     */
    add: function (settings) {
      settings=this.defaultArgs(settings);
        var data = {};
        if (this.validate(settings, "add")) {
            if (settings.model instanceof Array) {//如果是数组，则将其转对象
                data = { model: settings.model };
            }
            else {
                data = settings.model;
            }

            ajax({
                type: settings.type ? settings.type : "POST",
                url: settings.corsUrl + settings.controller,
                async: settings.async,
                contentType: settings.contentType,
                dataType: "json",
                headers: settings.headers,
                timeout: settings.timeout ? settings.timeout : 25000,
                data: data,
                success: settings.success,
                error: settings.error,
            });
        }


    },
     /**
     * 更新实例
     *  @param {oject} settings 请求对象
     * @returns {null}
     */
    update: function (settings) {
     settings=this.defaultArgs(settings);
        var data = {};//数据模型
        if (this.validate(settings, "add")) {
            if (settings.model instanceof Array) {//如果是数组，则将其转对象
                data = { model: settings.model };
            }
            else {
                data = settings.model;
            }

            ajax({
                type: settings.type ? settings.type : "PUT",
                url: settings.corsUrl + settings.controller,
                async: settings.async,
                contentType: settings.contentType,
                dataType: "json",
                headers: settings.headers,
                timeout: settings.timeout ? settings.timeout : 25000,
                data: data,
                success: settings.success,
                error: settings.error,
            });
        }

    },
     /**
     * 删除实例
     *  @param {oject} settings 请求对象
     * @returns {null}
     */
    delete: function (settings) {
        settings=this.defaultArgs(settings);
        var type = settings.type ? settings.type : "DELETE";//请求类型
        if (this.validate(settings)) {
            ajax({
                type: type,
                url: settings.corsUrl + settings.controller + "/" + settings.id,
                async: settings.async,
                contentType: settings.contentType,
                dataType: "json",
                headers: settings.headers,
                timeout: settings.timeout ? settings.timeout : 25000,

                success: settings.success,
                error: settings.error
            });
        }
    },
    /**
     * 条件查询
     *  @param {oject} settings 请求对象
     * @returns {null}
     */
    query: function (settings) {
        settings=this.defaultArgs(settings);
        if (this.validate(settings)) {
            var data = {};//因为要转换为后端能解析的数据格式必须是对象

            ajax({
                type: settings.type ? settings.type : "POST",
                url: "/" + settings.controller + "/Query",
                contentType: settings.contentType,
                async: settings.async,

                dataType: "json",
                headers: settings.headers,
                timeout: settings.timeout ? settings.timeout : 25000,
                data: data,
                success: settings.success,
                error: settings.error
            });
        }

    },
    /**
     * 分页条件查询
     *  @param {oject} settings 请求对象
     * @returns {null}
     */
    page: function (settings) {
        settings=this.defaultArgs(settings);
        if (this.validate(settings)) {

            ajax({
                type: settings.type ? settings.type : "POST",
                url: "/" + settings.controller + "/Page",
                async: settings.async,
                contentType: settings.contentType,
                dataType: "json",
                headers: settings.headers,
                timeout: settings.timeout ? settings.timeout : 25000,
                data: settings.pageModel,
                success: settings.success,
                error: settings.error
            })
        }

    },
};

module.exports = rest;