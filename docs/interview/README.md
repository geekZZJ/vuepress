# HTML
### 1. 如何理解 HTML 语义化
增加代码可读性  
让搜索引擎更容易读懂，有助于爬虫抓取更多的有效信息，爬虫依赖于标签来确定上下文和各个关键字的权重（SEO）  
在没有 CSS 样式的情况下，页面也能呈现出很好的内容结构

### 2. script 标签中 defer 和 async 的异同
相同：只适用于外部脚本，都会告诉浏览器立即开始下载，获取脚本的网络请求都是异步的，不会阻塞浏览器解析 HTML  
区别：脚本中有 defer 属性时，脚本会被延迟到整个页面都解析完毕后再运行。脚本中有 async 属性时，如果脚本的网络请求回来之后，此时 HTML 还没解析完，浏览器会暂停解析，先让 JS 引擎执行代码，执行完毕后再进行解析。 
![script](/html/1.png "script")  
![defer script](/html/2.png "defer script")  
![async script](/html/3.png "async script")  
详细解析：[图解 script 标签中的 async 和 defer 属性](https://juejin.cn/post/6894629999215640583 "图解 script 标签中的 async 和 defer 属性")