/**
 * Created by wangzhiyong on 2016-09-20.
 * 后端接口对接
 * edit by wangzhiyong
 * date:2016-10-04,将ajax直接改用原生xhr
 * date;2016-10-05 将rest独立出来,将格式化参数方法独立出来
 ** date;2016-11-05 验证可行性修改
 ** date;2017-01-14 验证可行性再次修改
 * date:2017-04-18 修改在IE8，与360中的bug
 * date:2017-06-16 修改asnyc参数的配置
 * date:2017-07-01？增加headers参数 
 * date:2017-07-07  完善一些注释，完善一些逻辑
 * date 2017-07-11 去掉一个错误的引用
 * date:2017-07-13 完善语法
 * * @description date:2018-01-15 修复bug，增加返回headers
 * 使用方法
 *     ajax({
       url:"http://localhost:7499/Admin/Add",
        type:"post",
        data:{name:"test",password:"1111",nickname:"dddd"},
        success:function (result) {
        console.log(result);
        },
    })
 */

import httpCode from "./httpCode.js";
import paramFormat from "./paramFormat.js";
import validate from "./validate";
/**
 * ajax请求
 */

export default function (settings) {

	let xhrRequest = createXHR();//创建xhr对象
	if (!validate(settings)) {//验证有效性
		return;
	}
	if (xhrParamsSet()) { //设置参数

		//开始发送数据
		if (settings.data) { //有参数
			if (settings.type.toLowerCase() == "get") { //如果是get
				xhrRequest.send();
			} else { //post/put等
				xhrRequest.send(settings.data);
			}
		} else {
			xhrRequest.send();
		}
	} else {

	}


	/**
	 * 创建xhr对象
	 * @returns {oject}
	 */

	function createXHR() {
		let xhr;
		if (window.XMLHttpRequest) {
			xhr = new XMLHttpRequest();
		} else {
			xhr = new ActiveXObject('Microsoft.XMLHTTP');
		}
		return xhr;

	}


	/**
	 * xhr参数设置
	 */

	function xhrParamsSet() {
		//格式化参数
		settings.data = paramFormat(settings.data);
		//get方式时如果有data参数，则将参数追加到url中
		if (settings.type.toLowerCase() == "get") {
			if (settings.data && settings.url.indexOf("?") <= -1) {
				settings.url += "?";
			}
			if (settings.data && settings.url.indexOf("?") > -1 && settings.url.indexOf("?") == settings.url.length - 1) {
				settings.url += settings.data;
			} else if (settings.data && settings.url.indexOf("?") > -1 && settings.url.indexOf("?") < settings.url.length - 1) {
				settings.url += "&" + settings.data;
			}
		}


		try {
			xhrRequest.open(settings.type, settings.url, settings.async);
		} catch (e) { //说明不支持跨域
			errorHandler(xhrRequest, 803, "[IE,360]自动阻止了跨域:" + e.message);
		}

		//设置请求格式
		if (settings.contentType == false) { //为false,不设置Content-Type
		} else {
			xhrRequest.setRequestHeader("Content-Type", settings.contentType); //请求的数据格式,
		}
		//设置返回格式
		try {
			xhrRequest.responseType = settings.dataType; //回传的数据格式
		} catch (e) {
			console.log("该浏览器[IE，360]不支持responseType的设置，跳过");
		}
		try {
			xhrRequest.withCredentials = settings.cors ? true : false; //表明在进行跨站(cross-site)的访问控制(Access-Control)请求时，是否使用认证信息(例如cookie或授权的header)。 默认为 false。
		} catch (e) {
			console.log("该浏览器[IE，360]不支持withCredentials的设置，跳过");
		}
		if (!settings.timeout) { //设置超时时间
			xhrRequest.timeout = settings.timeout; //超时时间
		}
		//设置headers
		if (settings.headers instanceof Object) {
			try {
				for (let prop in settings.headers) {

					xhrRequest.setRequestHeader(prop, settings.headers[prop]);
				}
			} catch (e) {
				throw new Error(e.message);
			}

		}
		try {
			//支持xhr2.0
			xhrRequest.addEventListener("load", load, false); ///执行成功事件
			xhrRequest.addEventListener("loadend", loadEnd, false); //执行完成事件
			xhrRequest.addEventListener("timeout", timeout, false); //超时事件
			xhrRequest.addEventListener("error", error, false); //执行错误事件
			xhrRequest.upload.addEventListener("progress", progress, false); //上传进度

		} catch (e) { //说明不支持xhr2.0
			console.log("浏览器不支持xhr2.0，已经转为1.0");
			xhrRequest.onreadystatechange = function () {
				if (xhrRequest.readyState == 4) {
					let e = {};
					e.target = xhrRequest;
					load(e); //调用加载成功事件
				}
			}
		}
		return true;

	}

	/**
	 * 上传进度事件
	 * @param event
	 */

	function progress(event) {
		if (event.lengthComputable) {
			let percentComplete = Math.round(event.loaded * 100 / event.total);
			if (typeof settings.progress === "function") {
				settings.progress(percentComplete); //执行上传进度事件
			}
			else {

			}
		}
	}

	/**
	 * 请求成功
	 * @param event
	 */

	function load(event) {
		let xhr = (event.target);
		if (xhr.readyState == 4 && ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304)) { //请求成功
		let headers=	xhrRequest.getAllResponseHeaders();//后台的头部信息
			if (settings.dataType == "json") {
				//json格式请求
				let result = xhr.response ? xhr.response : xhr.responseText; //1.0
				if (result) {
					if (typeof result == "string") { //IE8.360 中没有对结果进行JSON化
						result = JSON.parse(result);
					}
					if (result.success != null && result.success != undefined) { //后台传了这个字段
						if (result.success) {
								settings.success(result,headers); //执行成功
							
						} else {
							if (result.message) { //有标准的错误信息
								errorHandler(result, result.errCode ? result.errCode : "801", result.message);
							} else {
								errorHandler(result, "801", "服务器正常响应，后台业务代码的逻辑报错");

							}
						}
					} else { //后台没有传这个字段
							settings.success(result,headers); //直接认为是成功的
					}
				} else {
					errorHandler(xhr, "802", "服务器返回的数据格式不正确");
				}
			} else if (settings.dataType == "blob" || settings.dataType == "arrayBuffer") { //二进制数据
				settings.success(xhr.response);
			} else { //其他格式
				try {
					settings.success(xhr.responseText);
				} catch (e) { //如果没有responseText对象,不能通过if判断,原因不详
					settings.success(xhr.response);
				}

			}
		} else {
			//是4xx错误时属于客户端的错误，并不属于Network error,不会触发error事件
			errorHandler(xhr, xhr.status, xhr.statusText);
		}


	}

	/**
	 * 请求完成
	 * @param {*} event 
	 */
	function loadEnd(event) {
		let xhr = (event.target);
		if (typeof settings.complete === "function") { //设置了完成事件,
			if (xhr.readyState == 4 && ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304)) { //请求成功
				//304客户端已经执行了GET，但文件未变化,认为也是成功的
				settings.complete(xhr, "success");
			} else if (xhr.readyState == 4 && xhr.status == 0) { //本地响应成功，TODO 暂时不知道如何处理
				settings.complete(xhr, "error");
			} else { //错误
				settings.complete(xhr, "error");
			}
		}
	}

	/**
	 * 请求超时
	 * @param event
	 */

	function timeout(event) {
		console.log("请求超时");
	}

	/**
	 * 请求失败
	 * @param event
	 */

	function error(event) {
		let xhr = (event.target);
		//暂时通过这种方式来判断404错误
		let status = xhr.readyState == 4 && xhr.status == 0 && xhr.statusText == "" ? 404 : xhr.status;
		let message = httpCode[status.toString()];
		errorHandler(xhr, status, xhr.statusText ? xhr.statusText : message);
	}

	/**
	 * 通用错误处理函数
	 * @param {{}}xhr xhr对象
	 * @param errCode  错误代码
	 * @param message 信息提示
	 */

	function errorHandler(xhr, errCode, message) {
		if (errCode >= 300 && errCode < 600) {
			//是http错误		
			//设置了错误事件
			typeof settings.error === "function" ? settings.error(xhr, errCode, httpCode[errCode.toString()]) : null;
		} else {
			//设置了错误事件,
			typeof settings.error === "function" ? settings.error(xhr, errCode, message) : null;
		}

	}
}

