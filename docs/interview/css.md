# CSS
### 1. 盒模型介绍  
CSS3 中的盒模型有以下两种：标准盒模型、IE 盒模型  
两种盒子模型都是由`content + padding + border + margin`构成，其大小都是由`content + padding + border`决定的，但是盒子内容宽/高度（即`width/height`）的计算范围根据盒模型的不同会有所不同：  
- 标准盒模型：只包含`content`
- IE 盒模型：`content + padding + border`  
可以通过`box-sizing`来改变元素的盒模型：
- `box-sizing: content-box`：标准盒模型（默认值）  
- `box-sizing: border-box`：IE 盒模型
![标准盒模型](/css/1.png "标准盒模型")
![IE 盒模型](/css/2.png "IE 盒模型")

### 2. 选择器优先级
选择器：类型选择器、通配选择器、类选择器、ID 选择器、标签属性选择器、伪类选择器、伪元素选择器、后代选择器、子代选择器、相邻兄弟选择器、通用兄弟选择器  
样式的优先级一般为`!important > style > id > class`