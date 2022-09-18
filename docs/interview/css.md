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
详细解析：[深入理解 CSS 选择器优先级](https://juejin.cn/post/6844903709772611592 "深入理解 CSS 选择器优先级")

### 3. 图片底部3像素问题
原因：`img`为`inline-block`
- 将图片设置`vertical-align: bottom;`（非`baseline`即可）
- 设置图片`display: block;`
- 父标签添加属性`font-size: 0;`

### 4. border 画三角形
原理：`border`是斜切的，当`width`设为0时，将`border-bottom`设置宽度，`border-left`和`border-right`设置宽度，并且颜色设为透明时，将出现三角形  
![border 画三角形](/css/3.png "border 画三角形") ![border 画三角形](/css/4.png "border 画三角形")
```css
.c3 {
    width: 0px;
    border-bottom: 30px solid red;
    border-left: 15px solid transparent;
    border-right: 15px solid transparent;
}
```

### 5. 重排（reflow）和重绘（repaint）的理解
重排（回流）：无论通过什么方式影响了元素的几何信息(元素在视口内的位置和尺寸大小)，浏览器需要**重新计算**元素在视口内的几何属性，这个过程叫做重排  
重绘：当一个元素的外观发生改变，但没有改变布局，重新把元素外观绘制出来的过程，叫做重绘 
**何时发生回流重排**
- 页面初始渲染，这是开销最大的一次重排
- 添加/删除可见的 DOM 元素
- 改变元素位置
- 改变元素尺寸，比如边距、填充、边框、宽度和高度等
- 改变元素内容，比如文字数量，图片大小等
- 改变元素字体大小
- 改变浏览器窗口尺寸，比如`resize`事件发生时
- 激活 CSS 伪类（例如：:`hover`）
- 设置 style 属性的值，因为通过设置 style 属性改变结点样式的话，每一次设置都会触发一次 reflow
- 查询某些属性或调用某些计算方法：`offsetWidth`、`offsetHeight`等，除此之外，当我们调用`getComputedStyle`方法，或者`IE`里的 `currentStyle`时，也会触发重排，原理是一样的，都为求一个“即时性”和“准确性”

**何时发生回流重绘**  
![引起重绘属性](/css/5.png "引起重绘属性")  
> 重绘不一定会重排，但是重排一定发生重绘，重绘和重排都会耗费浏览器的性能，尽量避免

**减少回流和重绘**
- **最小化重绘和重排**，比如集中改变改变，添加新样式类名`.class`或`cssText`
- **批量修改DOM**，比如读取某元素`offsetWidth`属性存到一个临时变量，再去使用，而不是频繁使用这个计算属性；又比如利用`document.createDocumentFragment()`来添加要被添加的节点，处理完之后再插入到实际`DOM`中
- 使用`absolute`或`fixed`使元素脱离文档流，这在制作复杂的动画时对性能的影响比较明显
- 开启`GPU`加速，利用 CSS 属性`transform`、`will-change`等，比如改变元素位置，我们使用`translate`会比使用绝对定位改变其`left`、`top`等来的高效，因为它不会触发重排或重绘，`transform`使浏览器为元素创建⼀个`GPU`图层，这使得动画元素在一个独立的层中进行渲染。当元素的内容没有发生改变，就没有必要进行重绘  
详细解析：[你真的了解回流和重绘吗](https://juejin.cn/post/6844903779700047885 "你真的了解回流和重绘吗")

### 6. 对 BFC 的理解
BFC 即`块级格式上下文`，根据盒模型可知，每个元素都被定义为一个盒子，然而盒子的布局会受到**尺寸、定位、盒子的子元素或兄弟元素、视口的尺寸**等因素决定，所以这里有一个浏览器计算的过程，计算的规则就是由一个叫做**视觉格式化模型**的东西所定义的，BFC 就是来自这个概念，它是 CSS 视觉渲染的一部分，**用于决定块级盒的布局及浮动相互影响范围的一个区域**  

BFC 的特性：
- 块级元素会在垂直方向一个接一个的排列，和文档流的排列方式一致
- 在 BFC 中上下相邻的两个容器的`margin`会重叠，创建新的 BFC 可以避免外边距重叠
- 计算 BFC 的高度时，需要计算浮动元素的高度
- BFC 区域不会与浮动的容器发生重叠
- BFC 是独立的容器，容器内部元素不会影响外部元素
- 每个元素的左`margin`值和容器的左`border`相接触

如何创建 BFC
- 根元素（`<html>`）
- 浮动元素（`float`不为`none`）
- 绝对定位元素（`position`为`absolute`或`fixed`）
- 表格的标题和单元格（`display`为`table-caption`，`table-cell`）
- 匿名表格单元格元素（`display`为`table`或`inline-table`）
- 行内块元素（`display`为`inline-block`）
- `overflow`的值不为`visible`的元素
- 弹性元素（`display`为`flex`或`inline-flex`的元素的直接子元素）
- 网格元素（`display`为`grid`或`inline-grid`的元素的直接子元素）

BFC 的应用
- 自适应多栏布局
- 防止外边距折叠
- 清除浮动  
详细解析：[可能是最好的 BFC 解析了](https://juejin.cn/post/6960866014384881671 "你可能是最好的 BFC 解析了")

### 7. margin 负值问题
![margin 负值](/css/6.png "margin 负值")

### 8. 水平居中
![水平居中](/css/7.png "水平居中")

### 9. 垂直居中
![垂直居中](/css/8.png "垂直居中")
详细解析：[面试官：你能实现多少种水平垂直居中的布局（定宽高和不定宽高](https://juejin.cn/post/6844903982960214029 "面试官：你能实现多少种水平垂直居中的布局（定宽高和不定宽高")