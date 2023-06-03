# 浏览器

## 重绘与回流，以及如何优化

### 重绘

由于节点的几何属性发生改变或者由于样式发生改变而不会影响布局的，称为重绘，例如`outline`、`visibility`、`color`、`background-color`等，重绘的代价是高昂的，因为浏览器必须验证 DOM 树上其他节点元素的可见性

### 回流

回流是布局或者几何属性需要改变就称为回流。回流是影响浏览器性能的关键因素，因为其变化涉及到部分页面（或是整个页面）的布局更新。一个元素的回流可能会导致了其所有子元素以及 DOM 中紧随其后的节点、祖先节点元素的随后的回流

**回流必定会发生重绘，重绘不一定会引发回流**

### 浏览器优化

现代浏览器大多都是通过队列机制来批量更新布局，浏览器会把修改操作放在队列中，至少一个浏览器刷新（即 16.6ms）才会清空队列，但当你**获取布局信息的时候，队列中可能有会影响这些属性或方法返回值的操作，即使没有，浏览器也会强制清空队列，触发回流与重绘来确保返回正确的值**
主要包括以下属性或方法：

- offsetTop、offsetLeft、offsetWidth、offsetHeight
- scrollTop、scrollLeft、scrollWidth、scrollHeight
- clientTop、clientLeft、clientWidth、clientHeight
- width、height
- getComputedStyle()
- getBoundingClientRect()

所以，我们应该避免频繁的使用上述的属性，他们都会强制渲染刷新队列

### 减少重绘与回流

1. CSS 方面

- 使用 transform 替代 top
- 使用 visibility 替换 display: none ，因为前者只会引起重绘，后者会引发回流
- 避免使用 table 布局，可能很小的一个小改动会造成整个`table`的重新布局
- 尽可能在 DOM 树的最末端改变 class，回流是不可避免的，但可以减少其影响。尽可能在 DOM 树的最末端改变 class，可以限制了回流的范围，使其影响尽可能少的节点
- 避免设置多层内联样式，CSS 选择符从右往左匹配查找，避免节点层级过多

```html
<div>
  <a> <span></span> </a>
</div>
<style>
  span {
    color: red;
  }
  div > a > span {
    color: red;
  }
</style>
```

对于第一种设置样式的方式来说，浏览器只需要找到页面中所有的 span 标签然后设置颜色，但是对于第二种设置样式的方式来说，浏览器首先需要找到所有的 span 标签，然后找到 span 标签上的 a 标签，最后再去找到 div 标签，然后给符合这种条件的 span 标签设置颜色，这样的递归过程就很复杂。所以我们应该尽可能的避免写过于具体的 CSS 选择器，然后对于 HTML 来说也尽量少的添加无意义标签，保证层级扁平

- 将动画效果应用到`position`属性为`absolute`或`fixed`的元素上，避免影响其他元素的布局，这样只是一个重绘，而不是回流，同时，控制动画速度可以选择`requestAnimationFrame`
- 避免使用 CSS 表达式，可能会引发回流
- 将频繁重绘或者回流的节点设置为图层，图层能够阻止该节点的渲染行为影响别的节点，例如`will-change`、`video`、`iframe`等标签，浏览器会自动将该节点变为图层
- CSS3 硬件加速（GPU 加速），使用 CSS3 硬件加速，可以让`transform`、`opacity`、`filters`这些动画不会引起回流重绘 。但是对于动画的其它属性，比如`background-color`这些，还是会引起回流重绘的，不过它还是可以提升这些动画的性能

2. JavaScript 方面

- 避免频繁操作样式，最好一次性重写 style 属性，或者将样式列表定义为 class 并一次性更改 class 属性
- 避免频繁操作 DOM，创建一个 documentFragment，在它上面应用所有 DOM 操作，最后再把它添加到文档中
- 避免频繁读取会引发回流/重绘的属性，如果确实需要多次使用，就用一个变量缓存起来
- 对具有复杂动画的元素使用绝对定位，使它脱离文档流，否则会引起父元素及后续元素频繁回流

## 浏览器进程

1. 浏览器进程：浏览器的主进程（负责协调、主控），只有一个。作用有：

- 负责浏览器界面显示，与用户交互。如前进，后退等
- 负责各个页面的管理，创建和销毁其他进程
- 将`Renderer`进程得到的内存中的`Bitmap`，绘制到用户界面上
- 网络资源的管理，下载等

2. 第三方插件进程：每种类型的插件对应一个进程，仅当使用该插件时才创建

3. GPU 进程：最多一个，用于 3D 绘制等

4. 渲染进程（浏览器内核）（`Renderer`进程，内部是多线程的）：默认每个`Tab`页面一个进程，互不影响。主要作用为：页面渲染，脚本执行，事件处理等

## 进程间通信的方式

- `管道通信`：操作系统在内核中开辟一段缓冲区，进程 1 可以将需要交互的数据拷贝到这个缓冲区里，进程 2 就可以读取了
- `消息队列通信`：消息队列就是用户可以添加和读取消息的列表，消息队列里提供了一种从一个进程向另一个进程发送数据块的方法，不过和管道通信一样每个数据块有最大长度限制
- `共享内存通信`：就是映射一段能被其他进程访问的内存，由一个进程创建，但多个进程都可以访问，共享进程最快的是`IPC`方式
- `信号量通信`：比如信号量初始值是 1，进程 1 来访问一块内存的时候，就把信号量设为 0，然后进程 2 也来访问的时候看到信号量为 0，就知道有其他进程在访问了，就不访问了
- `socket`：其他的都是同一台主机之间的进程通信，而在不同主机的进程通信就要用到`socket`的通信方式了，比如发起`http`请求，服务器返回数据

## 预加载

### DNS Prefetch

```html
<link rel="dns-prefetch" href="https://fonts.googleapis.com/" />
```

### Preconnect

与`<link rel="dns-prefetch">`不同，除`DNS解析`之外，`<link rel="preconnect">`还会与服务器建立 TCP 连接以及进行 TSL 握手（对 HTTPS 站点而言），这能进一步减少建立跨域请求的时间，降低延迟。

```html
<link rel="preconnect" href="https://fonts.gstatic.com/" crossorigin />
```

### Preload

`preload`提供了一种声明式的命令，能让浏览器提前加载指定资源（如脚本或者样式表），并在需要执行的时候再执行。这在希望加快某个资源的加载速度时很有用。在`preload`下载完资源后，资源只是被缓存起来，浏览器不会对其执行任何操作。不执行脚本，不应用样式表。使用方式如下：

```html
<link rel="preload" href="style.css" as="style" />
<link rel="preload" href="main.js" as="script" />
```

注意：设置了`rel`属性的`link`标签必须设置`as`属性来声明资源的类型，否则浏览器可能无法正确加载资源。常见的`as`属性包括:

- font：字体文件
- image：图片文件
- script：JavaScript 文件
- style: CSS 样式文件

#### 使用场景

- 字体提前加载

```html
<link
  rel="preload"
  href="fonts/cicle_fina-webfont.woff2"
  as="font"
  type="font/woff2"
  crossorigin
/>
```

- 动态加载脚本，但不执行

通常我们可能想在当前页去加载下一页的资源，但是在`preload`的情况下，我们常常使用动态创建`script`标签的形式，但是动态创建`script`标签的话，`js`代码会立即执行。在有了`preload`之后，就可以做到动态加载，延迟执行

```js
const link = document.createElement("link");
link.href = "myscript.js";
link.rel = "preload";
link.as = "script";
document.head.appendChild(link);
```

上面这段代码可以让你预先加载脚本，下面这段代码可以让脚本执行

```js
const script = document.createElement("script");
script.src = "myscript.js";
document.body.appendChild(script);
```

- 基于标记语言的异步加载

```html
<link
  rel="preload"
  as="style"
  href="asyncstyle.css"
  onload="this.rel='stylesheet'"
/>
```

`preload`的`onload`事件可以在资源加载完成后修改`rel`属性，从而实现非常酷的异步资源加载

### Prefetch

`prefetch`(链接预取)是一种浏览器机制，其利用浏览器空闲时间来下载或预取用户在不久的将来可能访问的文档。网页向浏览器提供一组预取提示，并在浏览器完成当前页面的加载后开始**静默地拉取指定的文档并将其存储在缓存中**。当用户访问其中一个预取文档时，便可以快速的从浏览器缓存中得到。`prefetch`是一个**低优先级**的资源提示，允许浏览器在**后台空闲时**获取将来可能用得到的资源，并且将他们**存储在浏览器的缓存中**。一旦一个页面加载完毕就会开始下载其他的资源，然后当用户点击了一个带`prefetched`的连接，它将可以立刻从缓存中加载内容

```html
<link rel="dns-prefetch" href="https://example.com/" />
```

`webpack`插件`preload-webpack-plugin`可以帮助我们将该过程自动化，结合`htmlWebpackPlugin`在构建过程中插入`link`标签。[preload-webpack-plugin](https://www.npmjs.com/package/preload-webpack-plugin)

- preload

```js
plugins: [
  new HtmlWebpackPlugin(),
  new PreloadWebpackPlugin({
    rel: "preload",
    as(entry) {
      if (/\.css$/.test(entry)) return "style";
      if (/\.woff$/.test(entry)) return "font";
      if (/\.png$/.test(entry)) return "image";
      return "script";
    },
  }),
];
```

- prefetch

```js
plugins: [
  new HtmlWebpackPlugin(),
  new PreloadWebpackPlugin({
    rel: "prefetch",
  }),
];
```

### 浏览器资源加载优先级规则

#### 基本顺序

浏览器首先会按照资源默认的优先级确定加载顺序：

- html, css, font 这三种类型的资源优先级最高
- 然后是 preload 资源（通过`<link rel="preload">`标签预加载）
- 接着是图片、语音、视频
- 最低的是 prefetch 预读取的资源

#### 资源优先级提升

浏览器会按照如下规则，对优先级进行调整：

- 对于 XHR 请求资源：将同步 XHR 请求的优先级调整为最高
- 对于图片资源：会根据图片是否在可见视图之内来改变优先级。图片资源的默认优先级为 Low 。现代浏览器为了提高用户首屏的体验，在渲染时会计算图片资源是否在首屏可见视图之内，在的话，会将这部分视口可见图片资源的优先级提升为 High
- 对于脚本资源：浏览器会将根据脚本所处的位置和属性标签分为三类，分别设置优先级
  - 首先，对于添加 defer / async 属性标签的脚本的优先级会全部降为 Low
  - 然后，对于没有添加该属性的脚本，根据该脚本在文档中的位置是在浏览器展示的第一张图片之前还是之后，又可分为两类。在之前的（标记 early）它会被定为 High 优先级，在之后的（标记 late）会被设置为 Medium 优先级
