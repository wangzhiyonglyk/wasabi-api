/**
 * Created by wangzhiyong on 16/10/5.
 * edit by wangzhiyong  date:2017-07-17 desc :修改导出方式
 */

//格式化参数
import paramFormat from './paramFormat.js'//格式化参数


//接口
import ajax from './ajax.js';//ajax
import secretAjax from './secretAjax.js';//secretAjax
import fetchApi from './fetchApi';//fetch
import rest from './rest.js';//rest

//数据模型
import AjaxModel from './AjaxModel.js';//ajax的配置模型
import FetchModel  from './FetchModel.js';//fetch的配置模型
import RestModel from './RestModel.js';//rest的配置模型

//导出对象
export { paramFormat,ajax,secretAjax,fetchApi,rest,AjaxModel,FetchModel,RestModel}

//导出默认对象
export default { paramFormat,ajax,secretAjax,fetchApi,rest,AjaxModel,FetchModel,RestModel}