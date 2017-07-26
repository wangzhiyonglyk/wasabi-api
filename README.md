[[toc]]
# 前端开发简要规范
## 参考文献
[Web前端开发规范文档](http://www.jianshu.com/p/c361ced48e14)

[JSDoc](http://www.css88.com/doc/jsdoc/index.html)

## 文件书写规范
   
### 文件后缀规则
1. 包括jsx语法的文件后缀为.jsx
2. vue文件文件后缀为.vue
3. sass样式文件后缀为.sass
4. 普通脚本，样式，页面分别使用.js,  .css, .html为后缀

### 文件命名规则
1. React,Vue组件采用大驼峰法——每个单词首字母大写
2. 类文件采用大驼峰法——每个单词首字母大写
3. 普通文件采用小驼峰法——第一个单词首字母小写，后面单词首字母大写

### 取名方式
1. 通常以英文作为命名方式，取易理解的单词。比如订单管理- ==order==就可以了，待审订单-==wait==，如无必要无需写几个单词。
2. 一个功能如分为多个子功能，比如订单管理——订单列表，订单新增，订单详情，退单...则新建文件夹-order,然后分别新增： ==list, add, detail,   return==等文件。如果订单列表是默认功能，可以将list改为index,便可知这是默认页面。
>    ![image](http://doc.bluehy.com/public/folder.png)
3. 一个功能件(**首字母小写**)或者一个组件(**首字母大写**)比较大，则可以拆分分三个部分 ==view,hander,model== 甚至四部分加 ==extend==
> ![image](http://doc.bluehy.com/public/datagrid.png)

## 文件注释规范
1. 文件头必须写明创建日期，创建人，文件描述，重大修改说明
    

```
  /**
     * @file 后端接口对接 
     * @author wangzhiyong
     * @date  2016-09-20.
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
```

    
2. 较难理解的代码提供必要提示
    
```
  componentWillReceiveProps (nextProps) {
    
    	/****
    	 url与params而url可能是通过reload方法传进来的,并没有作为状态值绑定
    	 headers可能是后期才传了,见Page组件可知
    	 所以此处需要详细判断
    	 另外 pageSize组件
    	 */
    	if (nextProps.url) {
    	
    	}
    	else {
    
    	}
    }
```

    
3. 复杂的逻辑处必须写明思路
    

```
   try {
    	xhrRequest.open(settings.type, settings.url, settings.async);
    	}
    	catch (e) { //说明不支持跨域
    	errorHandler(xhrRequest, 803, "[IE,360]自动阻止了跨域:" e.message);
    		}
```


## html书写规范
1. 每个HTML页面的第一行添加标准模式（standard
mode）的声明，确保在每个浏览器中拥有一致的展现。


```
<!DOCTYPE html>
<html>
</html>
```

2. 文档类型声明统一为HTML5声明类型，编码统一为UTF-8。

```
<meta charset="UTF-8">
```
3. <HEAD>中的常用信息说明
```
<!-- 收藏图标 -->
<link rel="Shortcut Icon" href="favicon.ico">

<!-- 字体编码 -->
<meta charset="utf-8" />


<meta name="keywords" content="" />

<!-- 说明 -->
<meta name="description" content="" />

<!-- 作者 -->
<meta name="author" content="" />

<!-- 设置文档宽度、是否缩放 -->
<meta name="viewport" content="width=device-width,initial-scale=1.0,user-scalable=no" />

<!-- 优先使用IE最新版本或chrome -->
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />

<!-- 360读取到这个标签立即钱换到极速模式 -->
<meta name="renderer" content="webkit" />

<!-- 禁止百度转码 -->
<meta http-equiv="Cache-Control" content="no-siteapp" />

<!-- UC强制竖屏 -->
<meta name="screen-orientation" content="portrait" />

<!-- QQ强制竖屏 -->
<meta name="x5-orientation" content="portrait" />

<!-- UC强制全屏 -->
<meta name="full-scerrn" content="yes" />

<!-- QQ强制全屏 -->
<meta name="x5-fullscreen" content="ture" />

<!-- QQ应用模式 -->
<meta name="x5-page-mode" content="app" />

<!-- UC应用模式 -->
<meta name="browsermode" content="application">

<!-- window phone 点亮无高光 -->
<meta name="msapplication-tap-highlight" content="no" />

<!-- 安卓设备不自动识别邮件地址 -->
<meta name="format-detection" name="email=no" />

<!-- iOS设备 -->

<!-- 添加到主屏幕的标题 -->
<meta name="apple-mobile-web-app-title" content="标题" />

<!-- 是否启用webApp全屏 -->
<meta name="apple-mobile-web-app-capable" content="yes" />

<!-- 设置状态栏的背景颜色，启用webapp模式时生效 -->
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent/black/default" />
<!-- 半透明/黑色/默认白色 -->

<!-- 禁止数字识别为电话号码 -->
<meta name="format-detection" content="telephone=no" />

<!-- 智能添加广告条 -->
<meta name="apple-itunes-app" content="app-id=myappstoreID,affiliate-data=myaffiliatedata,app-argument=myurl" />

<!-- 用来防止别人在框架里调用你的页面 -->
<meta http-equiv="Window-target" content="_top">
```


4. IE支持通过特定<meta>标签来确定绘制当前页面所应该采用的IE版本。除非有强烈的特殊需求，否则最好是设置为edge
mode ，从而通知IE采用其所支持的最新的模式。

```
<meta http-equiv="X-UA-Compatible" content="IE=Edge">
```


5. 非特殊情况下CSS样式文件外链至HEAD之间，JAVASCRIPT文件外链至页面底部。

```
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="css/main.css">
</head>
<body>
    <!-- 逻辑代码 -->
    <!-- 逻辑代码底部 -->
    <script src="lib/jquery/jquery-2.1.1.min.js"></script>
</body>
</html>
```
6. HTML属性应当按照以下给出的顺序依次排列，来确保代码的易读性。

```
class
id 、 name
data-*
src、for、 type、 href
title、alt
aria-*、 role
```

7. 编码均遵循XHTML标准,
标签、属性、属性命名由小写英文、数字和-组成，且所有标签必须闭合，
属性值必须用双引号"",
8. 需要自定义HTML标签属性时，可使用须以“data-”为前缀来添加自定义属性
尽可能减少<DIV>嵌套。
书写链接地址时避免重定向。


## css书写规范
1. 为了欺骗W3C的验证工具,可将代码分为两个文件，一个是针对所有浏览器,一个只针对IE。即将所有符合W3C的代码写到一个文件中,而一些IE中必须而又不能通过W3C验证的代码（如:
cursor:hand;）放到另一个文件中，再用下面的方法导入

```
<!-- 放置所有浏览器样式-->
<link rel="stylesheet" type="text/css" href="">
<!-- 只放置IE必须，而不能通过w3c的-->
<!--[if IE]
    <link rel="stylesheet" href="">
<![endif]-->

```
2. CSS样式新建或修改尽量遵循以下原则

    - 根据新建样式的适用范围分为三级：全站级、产品级、页面级。
    - 尽量通过继承和层叠重用已有样式。
    - 不要轻易改动全站级CSS。改动后，要经过全面测试。

3. 使用z-index属性尽量z-index的值不要超过150，不要随意写
4. 尽量避免使用CSS Hack。

```
property:value; /* 所有浏览器 */
+property:value; /* IE7 */
_property:value; /* IE6 */
*property:value; /* IE6/7 */
property:value\9; /* IE6/7/8/9，即所有IE浏览器 */

```
5. 浏览器前缀请使用autoprefixer，或者webpack中配置

## javaScript书写规范
### 命名规范
1. 全部大写并单词间用下划线分隔 ，如：CSS_BTN_CLOSE、TXT_LOADING
2. 对象的属性或方法名-驼峰式（little camel-case）
3. 类名（构造器）-->驼峰式但首字母大写-->如：Current、DefaultConfig
4. 函数名     -->小驼峰式   -->如：current()、defaultConfig()
5. 变量名    -->小驼峰式-->如：current、defaultConfig
6. 私有变量名 -->小驼峰式但需要用_开头-->如：_current、_defaultConfig

### 注释规则
#### 参数 @praram
@param标签提供了对某个函数的参数的各项说明，包括参数名、参数数据类型、描述等。
1. 名称, 类型, 和说明，你可以在变量说明前加个连字符，使之更加容易阅读

```
  /**
     * @param {string} somebody  - Somebody's name.
     */
    function sayHello(somebody) {
        alert('Hello ' + somebody);
    }
```

    
2. 如果参数是一个对象，有特定的属性，您可以通过@param标签提供额外的属性。例如，假如employee参数有name和department属性，您可以按以下方式描述。
    
 
```
 /**
     * Assign the project to an employee.
     * @param {Object} employee - The employee who is responsible for the project.
     * @param {string} employee.name - The name of the employee.
     * @param {string} employee.department - The employee's department.
     */
    Project.prototype.assign = function(employee) {
        // ...
    };
```

3. 可选参数和默认值，使用中括号表示可选

```
  /**
     * @param {string} [somebody=John Doe] - Somebody's name.
     */
    function sayHello(somebody="John Doe") {
        alert('Hello ' + somebody);
    }
```

4. 一个参数可以接受多种类型

```
/**
     * @param {string|string[]} [somebody=John Doe] - Somebody's name.
     */
    function sayHello(somebody="John Doe") {
        alert('Hello ' + somebody);
    }
```

    
5. 由于在vscode编辑器里 注明object与array会被提示为any ，应该加双引号
    任意类型用*

```
 /**
     * @param {string|string[]} [somebody=[]] - Somebody's name.
     */
    function sayHello(somebody=[]) {
        alert('Hello ' + somebody);
    }
    
    /**
     * @param {*} [somebody=John Doe] - Somebody's name.
     */
    function sayHello(somebody="John Doe") {
        alert('Hello ' + somebody);
    }
```


#### 返回值
@returns 标签描述一个函数的返回值。语法和@param类似。多类型用|

```
/**
 * Returns the sum of a and b
 * @param {Number} a
 * @param {Number} b
 * @returns {Number|string}
 */
function sum(a, b) {
    return a + b;
}
```
#### 类注释
当使用 extends关键字来扩展一个现有的类的时候，可以使用 @extends标签。

```
/**
 * Class representing a dot.
 * @extends Point
 */
class Dot extends Point {
    /**
     * Create a dot.
     * @param {number} x - The x value.
     * @param {number} y - The y value.
     * @param {number} width - The width of the dot, in pixels.
     */
    constructor(x, y, width) {
        // ...
    }

    /**
     * Get the dot's width.
     * @return {number} The dot's width, in pixels.
     */
    getWidth() {
        // ...
    }
}
```

