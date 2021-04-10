/**
 * @author 王志勇
 * @description 将参数中的数组转为后台可识别的格式
 * @description date:2016-10-05 将格式化方法独立出来，尤其是处理数组问题
 * @description date:2018-01-05 修正，
 * * @description date:2021-04-10 修正说明
 * @param {*} data 参数
 */
export default (data)=> {
    if(!data)
    {//空直接返回
        return data;
    }
    else if(typeof data ==="string"||typeof data==="number")
    {//直接返回
        return data;
    }
    else if(data.constructor===FormData) {//参数为FormData,直接返回
        return data;

    }
    else if(data instanceof  Array)
    {
        throw new Error("参数必须是字符,空值,对象,FormData,不可以为数组");
       
    }

    data =arrayFormat(data);//将参数模型中数组转换为对象,再格式式参数
    let arr = [];
    for (let name in data) {//url格式化，并且将参数字符转义
        arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
    }
    if(arr.length>0) {
        return arr.join("&");
    }
    else {
        return null;
    }

    /**
     * 将参数模型中某个参数是数组时转换为对象,再格式式化参数，这样子传入后台mvc请求时能自动转为模型
     * @param {*} data 参数
     */
    function arrayFormat(data={}) {
        let MvcParameterAdaptive = {};
        //验证是否为数组
        MvcParameterAdaptive.isArray = Function.isArray || function (o) {
                return typeof o === "object" &&
                    Object.prototype.toString.call(o) === "[object Array]";
            };

        //将数组转换为对象
        MvcParameterAdaptive.convertArrayToObject = function (/*数组名*/arrName, /*待转换的数组*/array, /*转换后存放的对象，不用输入*/saveOjb) {
            let obj = saveOjb || {};

            function func(name, arr) {
                for (let i in arr) {
                    if (!MvcParameterAdaptive.isArray(arr[i]) && typeof arr[i] === "object") {
                        for (let j in arr[i]) {
                            if (MvcParameterAdaptive.isArray(arr[i][j])) {
                                func(name + "[" + i + "]." + j, arr[i][j]);
                            } else if (typeof arr[i][j] === "object") {
                                MvcParameterAdaptive.convertObject(name + "[" + i + "]." + j + ".", arr[i][j], obj);
                            } else {
                                obj[name + "[" + i + "]." + j] = arr[i][j];
                            }
                        }
                    } else {
                        obj[name + "[" + i + "]"] = arr[i];
                    }
                }
            }

            func(arrName, array);

            return obj;
        };

        //转换对象
        MvcParameterAdaptive.convertObject = function (/*对象名*/objName, /*待转换的对象*/turnObj, /*转换后存放的对象，不用输入*/saveOjb) {
            let obj = saveOjb || {};

            function func(name, tobj) {
                for (let i in tobj) {
                    if (MvcParameterAdaptive.isArray(tobj[i])) {
                        MvcParameterAdaptive.convertArrayToObject(i, tobj[i], obj);
                    } else if (typeof tobj[i] === "object") {
                        func(name + i + ".", tobj[i]);
                    } else {
                        obj[name + i] = tobj[i];
                    }
                }
            }

            func(objName, turnObj);
            return obj;
        };


        let arrName = "";//参数名

        if (typeof data !== "object") throw new Error("请传入json对象");
        if (MvcParameterAdaptive.isArray(data) && !arrName) throw new Error("必须是对象,如果是数组请使用对象包裹！");

        if (MvcParameterAdaptive.isArray(data)) {
            return MvcParameterAdaptive.convertArrayToObject(arrName, data);
        }
        return MvcParameterAdaptive.convertObject("", data);
    }
}
