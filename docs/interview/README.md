# HTML

## 如何理解 HTML 语义化

增加代码可读性  
让搜索引擎更容易读懂，有助于爬虫抓取更多的有效信息，爬虫依赖于标签来确定上下文和各个关键字的权重（SEO）  
在没有 CSS 样式的情况下，页面也能呈现出很好的内容结构

## script 标签中 defer 和 async 的异同

相同：只适用于外部脚本，都会告诉浏览器立即开始下载，获取脚本的网络请求都是异步的，不会阻塞浏览器解析 HTML  
区别：脚本中有 defer 属性时，脚本会被延迟到整个页面都解析完毕后再运行。脚本中有 async 属性时，如果脚本的网络请求回来之后，此时 HTML 还没解析完，浏览器会暂停解析，先让 JS 引擎执行代码，执行完毕后再进行解析。
![script](/html/1.png "script")  
![defer script](/html/2.png "defer script")  
![async script](/html/3.png "async script")

注意点：

- defer：HTML5 规范要求脚本按照它们出现的先后顺序执行，因此第一个延迟脚本会先于第二个延迟脚本执行，而这两个脚本会先于`DOMContentLoaded`事件执行。**在现实当中，延迟脚本并不一定会按照顺序执行，也不一定会在`DOMContentLoaded`事件触发前执行，因此最好只包含一个延迟脚本**
- async：可能由于`1.js`下载时间比较长，由于两个`<script>`标签都是异步执行，互不干扰，因此`2.js`可能就会先于`1.js`执行。因此，确保两者之间互不依赖非常重要。指定`async`属性的目的是不让页面等待两个脚本下载和执行，从而异步加载页面其他内容。为此，建议异步脚本不要在加载期间修改`DOM`

详细解析：[图解 script 标签中的 async 和 defer 属性](https://juejin.cn/post/6894629999215640583 "图解 script 标签中的 async 和 defer 属性")

## HTML5 新特性

语义化标签，如`<header>`、`<nav>`、`<article>`、`<section>`等  
表单增强，表单中添加了很多输入型控件，比如：number、url、email、range、color、date 等，通过 input 的 type 属性使用  
新的 API，如离线存储、音视频、绘图、实时通讯、设备能力等

## 哪些元素可以自闭合

表单元素 input、图片 img、br、hr、meta、link

## 块级元素与行内元素

行内元素：i、a、img、span、button、input、label、select、textarea  
块级元素：aside、article、div、form、ul、ol、p、table  
区别：  
块级元素独占一行，元素的宽高、内外边距都可设置，元素宽度在不设置的情况下，是父容器的 100%  
行内元素不会自动进行换行，元素的高度不可设置，内边距可以设置，外边距水平方向有效，垂直方向无效，元素宽度在不设置的情况下，随内容变化
