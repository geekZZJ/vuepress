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

### 3. 图片底部 3 像素问题

原因：`img`为`inline-block`

- 将图片设置`vertical-align: bottom;`（非`baseline`即可）
- 设置图片`display: block;`
- 父标签添加属性`font-size: 0;`

### 4. border 画三角形

原理：`border`是斜切的，当`width`设为 0 时，将`border-bottom`设置宽度，`border-left`和`border-right`设置宽度，并且颜色设为透明时，将出现三角形  
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
- **批量修改 DOM**，比如读取某元素`offsetWidth`属性存到一个临时变量，再去使用，而不是频繁使用这个计算属性；又比如利用`document.createDocumentFragment()`来添加要被添加的节点，处理完之后再插入到实际`DOM`中
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
详细解析：[面试官：你能实现多少种水平垂直居中的布局（定宽高和不定宽高）](https://juejin.cn/post/6844903982960214029 "面试官：你能实现多少种水平垂直居中的布局（定宽高和不定宽高）")

### 10. 实现两栏布局（左侧固定+右侧自适应）

```html
<div class="outer">
  <div class="left">左侧</div>
  <div class="right">右侧</div>
</div>
```

- 利用浮动，左边元素宽度固定，设置向左浮动。将右边元素的`margin-left`设为固定宽度

```css
.left {
  width: 200px;
  background-color: red;
  float: left;
}
.right {
  margin-left: 200px;
  background-color: green;
}
```

- 利用浮动，左边元素宽度固定，设置向左浮动。右侧元素设置`overflow: auto;`，这样右边就触发了`BFC`，`BFC`的区域不会与浮动元素发生重叠，所以两侧就不会发生重叠

```css
.left {
  width: 200px;
  background-color: red;
  float: left;
}
.right {
  overflow: auto;
  background-color: green;
}
```

- 利用`flex`布局，左边元素固定宽度，右边的元素设置`flex: 1`

```css
.outer {
  display: flex;
}
.left {
  width: 200px;
  background-color: red;
}
.right {
  flex: 1;
  background-color: green;
}
```

- 利用绝对定位，父级元素设为相对定位。左边元素`absolute`定位，宽度固定。右边元素的`margin-left`的值设为左边元素的宽度值

```css
.outer {
  position: relative;
}
.left {
  position: absolute;
  width: 200px;
  background-color: red;
}
.right {
  margin-left: 200px;
  background-color: green;
}
```

- 利用绝对定位，父级元素设为相对定位。左边元素宽度固定，右边元素`absolute`定位，`left`为宽度大小，其余方向定位为`0`

```css
.outer {
  position: relative;
}
.left {
  width: 200px;
  background-color: red;
}
.right {
  position: absolute;
  left: 200px;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: green;
}
```

### 11. 实现圣杯布局和双飞翼布局（经典三分栏布局）

- 三栏布局，中间一栏最先加载和渲染（**内容最重要，这就是为什么还需要了解这种布局的原因**）
- 两侧内容固定，中间内容随着宽度自适应
- 一般用于 PC 网页

![三栏布局](/css/9.png "三栏布局")

**圣杯布局**：

```html
<div id="container">
  <div class="center">我是中间</div>
  <div class="left">我是左边</div>
  <div class="right">我是右边</div>
</div>
```

```css
#container {
  padding-left: 200px;
  padding-right: 150px;
}
#container div {
  float: left;
}
.center {
  width: 100%;
  background-color: red;
}
.left {
  width: 200px;
  position: relative;
  left: -200px;
  margin-left: -100%;
  background-color: blue;
}
.right {
  width: 150px;
  margin-right: -150px;
  background-color: green;
}
```

**双飞翼布局**：

```html
<div class="main">
  <div class="main-wrap">main</div>
</div>
<div class="left">left</div>
<div class="right">right</div>
```

```css
.main {
  width: 100%;
  background-color: pink;
  float: left;
}
.main-wrap {
  margin: 0 190px;
}
.left {
  width: 190px;
  background-color: green;
  margin-left: -100%;
  float: left;
}
.right {
  width: 190px;
  background-color: blue;
  margin-left: -190px;
  float: left;
}
```

tips：上述代码中`margin-left: -100%`相对的是父元素的`content`宽度，即不包含`paddig`、`border`的宽度

### 12. clip-path 属性

#### `basic-shape`

1. `circle`  
   用于定义一个圆

```
circle( [<shape-radius>]? [at <position>]? )
```

其中`shape-radius`为圆形的半径，`position`为圆心的位置  
如果`shape-radius`为百分比，则 100%相当于：`sqrt(width^2+height^2)/sqrt(2)`,`width`、`height`分别为被剪裁元素的宽高

2. inset  
   用于定义一个矩形

```
inset( <shape-arg>{1,4} [round <border-radius>]? )
```

其中`shape-arg`分别为矩形的上右下左顶点到被剪裁元素边缘的距离（和`margin`、`padding`参数类似），`border-radius`为可选参数，用于定义`border`的圆角

3. ellipse  
   用于定义一个椭圆

```
ellipse( [<shape-radius>{2}]? [at <position>]? )
```

其中`shape-radius`为椭圆 x、y 轴的半径，`position`为椭圆中心的位置

4. polygon  
   用于定义一个多边形

```
polygon( [<fill-rule>,]? [<shape-arg> <shape-arg>]# )
```

其中`fill-rule`为填充规则，即通过一系列点去定义多边形的边界

#### clip-source

即通过引用一个`svg`的`clipPath`元素来作为剪裁路径。比如，使用在`<clipPath>`中定义一个圆：

```html
<svg class="svg">
  <defs>
    <clipPath id="svgCircle">
      <circle cx="150" cy="150" r="150" />
    </clipPath>
  </defs>
</svg>

<img
  class="img svg-circle"
  src="https://qpic.y.qq.com/music_cover/xiabfMZAmQ0PYUzgCvOicArIoGLzqL3n6q3fDiawWkhTTVWgGNM52HBNA/300?n=1"
/>
```

```css
.img {
  width: 300px;
  height: 300px;
}
.svg {
  position: absolute;
}
.svg-circle {
  clip-path: url("#svgCircle");
}
```

### 13. position:absolute/fixed 有什么区别

- `absolute`实质上是相对于`static`定位以外的第一个父元素进行定位的
- `fixed`相对于屏幕（`viewport`）进行定位

### 14. 如何清除浮动，为什么要清除浮动

- 原因：浮动元素可能会超出父元素（不受父元素约束），从而对其他元素造成影响
- 清除浮动方法
  1. 父元素设置`overflow: hidden`
  2. 末尾增加空元素设置`clear`
  ```html
  <div class="box">
    <div class="left"></div>
    <div class="right"></div>
    <div class="bottomDiv"></div>
  </div>
  .bottomDiv { clear: both; }
  <!-- bottomDiv设置成clear: both，代表了它左右都不能有浮动元素，迫使往下移动，进而撑开了父级盒子的高度 -->
  ```
  3. 给父级添加伪元素进行`clear`（原理同上）

### 15. CSS 单位

CSS 单位分为相对长度单位、绝对长度单位

- `px（绝对长度单位）`
- `em（相对长度单位）`  
  浏览器的默认字体都是 16px，那么 1em=16px，以此类推计算 12px=0.75em，10px=0.625em，2em=32px；  
  为了简化`font-size`的换算，我们在`body`中写入一下代码

```css
body {
  font-size: 62.5%;
} /*  公式16px*62.5%=10px  */
```

> 缺点：  
> `em`的值并不是固定的  
> `em`会继承父级元素的字体大小（参考物是父元素的`font-size`）  
> `em`中所有的字体都是相对于父元素的大小决定的

```html
<div class="big">
  我是大字体
  <div class="small">我是小字体</div>
</div>

<style>
  body {
    font-size: 62.5%;
  } /*  公式:16px*62.5%=10px  */
  .big {
    font-size: 1.2em;
  }
  .small {
    font-size: 1.2em;
  }
</style>

// 运行结果small的字体大小为：1.2em*1.2em=1.44em
```

- `rem（相对长度单位）`  
  浏览器的默认字体都是 16px，那么 1rem=16px，以此类推计算 12px=0.75rem，10px=0.625rem，2rem=32px；
  为了简化 font-size 的换算，我们在根元素 html 中加入 font-size: 62.5%

```css
html {
  font-size: 62.5%;
} /*  公式16px*62.5%=10px  */
```

> 特点：
> `rem`单位可谓集相对大小和绝对大小的优点于一身  
> 和`em`不同的是，`rem`总是相对于根元素(如:root{})，而不像`em`一样使用级联的方式来计算尺寸  
> `rem`支持`IE9`及以上，意思是相对于根元素`html（网页）`，不会像`em`那样，依赖于父元素的字体大小，而造成混乱

### 16. flex 布局

这一块内容看 [Flex 布局教程](https://www.ruanyifeng.com/blog/2015/07/flex-grammar.html "Flex 布局教程") 就够了  
`flex: 1` ，它具体包含了以下的意思：

- `flex-grow: 1`：该属性默认为`0`，如果存在剩余空间，元素也不放大。设置为`1`代表会放大
- `flex-shrink: 1`：该属性默认为`1`，如果空间不足，元素缩小
- `flex-basis: 0%`：定义了在分配多余空间之前，项目占据的主轴空间（main size）。浏览器根据这个属性，计算主轴是否有多余空间。它的默认值为`auto`，即项目的本来大小。它可以设为跟`width`或`height`属性一样的值（比如 350px），则项目将占据固定空间

### 17. line-height 如何继承

- 父元素的`line-height`写了具体数值，比如 30px，则子元素`line-height`继承该值。
- 父元素的`line-height`写了比例，比如 1.5 或 2，则子元素`line-height`也是继承该比例。
- 父元素的`line-height`写了百分比，比如 200%，则子元素`line-height`继承的是父元素 font-size \* 200% 计算出来的值
