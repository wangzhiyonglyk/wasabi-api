/**
 * Created by wangzhiyong on 16/10/5.
 */

//格式化参数
exports.paramFormat = require('./paramFormat.js');//格式化参数

//接口
exports.ajax = require('./ajax.js');//ajax
exports.secretAjax = require('./secretAjax.js');//secretAjax
 exports.fetchapi = require('./fetchapi.js');//fetch
  exports.rest = require('./rest.js');//rest

//数据模型
exports.AjaxModel = require('./AjaxModel.js');//ajax的配置模型
exports.FetchModel = require('./FetchModel.js');//fetch的配置模型
exports.RestModel = require('./RestModel.js');//rest的配置模型