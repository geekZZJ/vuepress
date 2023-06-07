# webpack

## 基本配置

- 拆分配置和 merge  
  拆分 webpack.common.js、webpack.dev.js、webpack.prod.js
  ![拆分配置和 merge](/webpack/merge.png "拆分配置和 merge")
- 启动本地服务

```js
devServer: {
  port: 8080,
  progress: true, // 显示打包的进度条
  contentBase: distPath, // 根目录
  open: true, // 自动打开浏览器
  compress: true, // 启动 gzip 压缩
  hot: true, // 热更新
  proxy: { // 设置代理
    // 将本地 /api/xxx 代理到 localhost:3000/api/xxx
    '/api': 'http://localhost:3000',
    // 将本地 /api2/xxx 代理到 localhost:3000/xxx
    '/api2': {
      target: 'http://localhost:3000',
      pathRewrite: {
        '/api2': '',
      },
    },
  },
}
```

- 处理 ES6

```js
module: {
  rules: [
    {
      test: /\.js$/,
      use: ['babel-loader'],
      include: srcPath,
      exclude: /node_modules/,
    }
  ],
},
```

- 处理样式（loader 的执行顺序：从后往前）

```js
module: {
  rules: [
    {
      test: /\.css$/,
      // loader 的执行顺序是：从后往前
      use: ['style-loader', 'css-loader', 'postcss-loader'], // 加了 postcss
    },
    {
      test: /\.less$/,
      // 增加 'less-loader' ，注意顺序
      use: ['style-loader', 'css-loader', 'less-loader'],
    },
  ],
},
```

- 处理图片

```js
rules: [
  // 直接引入图片 url
  {
    test: /\.(png|jpg|jpeg|gif)$/,
    use: 'file-loader',
  },
],
```

- 模块化

## 高级配置

### 配置多入口

```js
entry: {
  index: path.join(srcPath, "index.js"),
  other: path.join(srcPath, "other.js"),
},

output: {
  filename: "[name].[contenthash:8].js", // name 即多入口时 entry 的 key
},

plugins: [
  // 多入口 - 生成 index.html
  new HtmlWebpackPlugin({
    template: path.join(srcPath, "index.html"),
    filename: "index.html",
    // chunks 表示该页面要引用哪些 chunk （即上面的 index 和 other），默认全部引用
    chunks: ["index"], // 只引用 index.js
  }),
  // 多入口 - 生成 other.html
  new HtmlWebpackPlugin({
    template: path.join(srcPath, "other.html"),
    filename: "other.html",
    chunks: ["other"], // 只引用 other.js
  }),
],
```

### 抽离 CSS 文件

```js
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

module: {
  rules: [
    // 抽离 css
    {
      test: /\.css$/,
      use: [
        MiniCssExtractPlugin.loader, // 注意，这里不再用 style-loader
        "css-loader",
        "postcss-loader",
      ],
    },
    // 抽离 less
    {
      test: /\.less$/,
      use: [
        MiniCssExtractPlugin.loader, // 注意，这里不再用 style-loader
        "css-loader",
        "less-loader",
        "postcss-loader",
      ],
    },
  ],
},

plugins: [
  // 抽离 css 文件
  new MiniCssExtractPlugin({
    filename: "css/main.[contenthash:8].css",
  }),
],

optimization: {
  // 压缩 css
  minimizer: [new OptimizeCSSAssetsPlugin({})],
},
```

### 抽离公共代码

```js
optimization: {
  // 分割代码块
  splitChunks: {
    chunks: "all",
    /**
     * initial 入口chunk，对于异步导入的文件不处理
     * async 异步chunk，只对异步导入的文件处理
     * all 全部chunk
     */
    // 缓存分组
    cacheGroups: {
      // 第三方模块
      vendor: {
        name: "vendor", // chunk 名称
        priority: 1, // 权限更高，优先抽离，重要！！！
        test: /node_modules/,
        minSize: 0, // 大小限制
        minChunks: 1, // 最少复用过几次
      },

      // 公共的模块
      common: {
        name: "common", // chunk 名称
        priority: 0, // 优先级
        minSize: 0, // 公共模块的大小限制
        minChunks: 2, // 公共模块最少复用过几次
      },
    },
  },
},
```

### 异步加载

使用`import`

### 处理 JSX

1. `npm install --save-dev @babel/preset-react`
2. 在`babel.config.json`文件中增加以下配置

```json
{
  "presets": ["@babel/preset-react"]
}
```

### 处理 Vue

1. 安装`vue-loader`

```bash
npm i vue-loader
```

2. 配置 vue 文件解析

```js
module: {
  rules: [
    {
      test: /\.vue$/,
      use: ["vue-loader"],
      include: srcPath,
    },
  ],
},
```

## 性能优化

### 优化构建速度

#### 优化 babel-loader

```js
module: {
  rules: [
    {
      test: /\.js$/,
      // 开启缓存，缓存目录为 node_modules/.cache/babel-loader
      use: ["babel-loader?cacheDirectory"],
      // 排除范围，include 和 exclude 两者选一个即可
      include: srcPath,
      exclude: /node_modules/,
    },
  ],
},
```

#### IgnorePlugin（避免引入无用模块）

```js
plugins: [
  // 忽略 moment 下的 /locale 目录
  new webpack.IgnorePlugin({
    resourceRegExp: /^\.\/locale$/,
    contextRegExp: /moment$/,
  }),
],
```

#### noParse（避免重复打包）

我们对类似`jquery`这类依赖库，一般会认为不会引用其他的包。所以，对于这类不引用其他的包的库，我们在打包的时候就没有必要去解析，这样能够增加打包速率

```js
module: {
  // min.js 一般已经模块化，无需我们再次处理
  noParse: [/react\.min\.js/],
},
```

> IgnorePlugin 对比 noParse  
> IgnorePlugin 直接不引入，代码中没有。noParse 引入，但不打包

#### happyPack

- JS 单线程，开启多进程打包
- 提高构建速度

```js
const HappyPack = require("happypack");

module: {
  rules: [
    {
      test: /\.js$/,
      // 把对 .js 文件的处理转交给 id 为 babel 的 HappyPack 实例
      use: ["happypack/loader?id=babel"],
      // 排除范围，include 和 exclude 两者选一个即可
      include: srcPath,
      // exclude: /node_modules/,
    },
  ],
},

plugins: [
  // happy开启多进程打包
  new HappyPack({
    // 用唯一的标识符 id 来代表当前的 HappyPack 是用来处理一类特定的文件
    id: "babel",
    // 如何处理 .js 文件，用法和 Loader 配置中一样
    loaders: ["babel-loader?cacheDirectory"],
  }),
],
```

#### TerserJSPlugin 开启多进程压缩

```js
const TerserJSPlugin = require("terser-webpack-plugin");

optimization: {
  // 压缩 js
  minimizer: [
    new TerserJSPlugin({
      // 开启多进程压缩
      parallel: true,
    }),
  ],
}
```

> 关于开启多进程  
> 项目较大，打包较慢，开启多进程能提高速度  
> 项目较小，打包很快，开启多进程会降低速度（进程开销）  
> 按需使用

#### 热更新

- 自动刷新：整个网页全部刷新，速度较慢
- 自动刷新：整个网页全部刷新，状态会丢失
- 热更新：新代码生效，网页不刷新，状态不丢失

```js
devServer: {
  // 开启热更新
  hot: true,
},
```

如需改动样式文件，热更新即可生效。  
如需改动 js 文件，则需要进行如下改写：

```js
// 开启热更新之后的代码逻辑
if (module.hot) {
  // math.js中代码发生变化页面不会整体刷新
  module.hot.accept("./math.js", () => {
    // 热更新的回调函数
    const sumRes = sum(10, 20);
    console.log("热更新", sumRes);
  });
}
```

#### DllPlugin

- webpack 已内置 DllPlugin 支持
- DllPlugin - 打包出 dll 文件
- DllReferencePlugin - 使用 dll 文件

### 减少代码体积

#### 小图片 base64 编码

```js
module: {
  rules: [
    // 图片 - 考虑 base64 编码的情况
    {
      test: /\.(png|jpg|jpeg|gif)$/,
      use: {
        loader: "url-loader",
        options: {
          // 小于 5kb 的图片用 base64 格式产出
          // 否则，依然延用 file-loader 的形式，产出 url 格式
          limit: 5 * 1024,
          // 打包到 img 目录下
          outputPath: "/img/",
          // 设置图片的 cdn 地址（也可以统一在外面的 output 中设置，那将作用于所有静态资源）
          // publicPath: 'http://cdn.abc.com'
        },
      },
    },
  ],
},
```

#### bundle 加 hash

```js
output: {
  filename: "[name].[contenthash:8].js", // name 即多入口时 entry 的 key
},
```

#### 提取公共代码

#### IgnorePlugin

#### 使用 CDN 加速

所有的静态文件都会加上 CDN 的前缀，打包后需要将静态文件放到 CDN 上

```js
output: {
  publicPath: "http://cdn.abc.com", // 修改所有静态文件 url 的前缀（如 cdn 域名）
},
```

#### 使用 production

- 自动开启代码压缩
- Vue React 等会自动删掉调试代码（如开发环境的 warning）
- 启动 Tree-Shaking（ES6 Module 才能让 tree-shaking 生效）

#### Scope Hosting

未开启时，一个 js 文件会生成一个函数，开启后会将多个 js 文件相关代码合并到一个函数中

- 代码体积更小
- 创建函数作用域更少
- 代码可读性更好

```js
resolve: {
  // 针对 npm 中的第三方模块优先采用 jsnext:main 中指向的 ES6 模块化语法的文件
  mainFields: ["jsnext:main", "browser", "main"],
},

plugins: [
  // 开启 scope hosting
  new webpack.optimize.ModuleConcatenationPlugin(),
];
```

## babel

### babel 基本使用

1. 安装依赖`@babel/cli`、`@babel/core`、`@babel/preset-env`(preset-env 为常见 babel 的集合)
2. 新增`.babelrc`文件，增加以下配置

```js
{
  "presets": [["@babel/preset-env"]],
  "plugins": []
}
```

### babel-polyfill

- core-js 和 regenerator
- babel-polyfill 是以上两者的集合
- babel7.4 后已被弃用

配置按需引入

```js
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "useBuiltIns": "usage",
        "corejs": 3
      }
    ]
  ],
}
```

### babel-runtime

- 防止污染全局环境
- 安装`@babel/plugin-transform-runtime`、`@babel/runtime`，在`.babelrc`文件中做以下配置：

```js
"plugins": [
  [
    "@babel/plugin-transform-runtime",
    {
      "absoluteRuntime": false,
      "corejs": 3,
      "helpers": true,
      "regenerator": true,
      "useESModules": false
    }
  ]
]
```

## 面试真题

### module chunk bundle 的区别

- module - 各个源码文件，webpack 中一切皆模块
- chunk - 多模块合并成的
- bundle - 最终的输出文件

![module chunk bundle 的区别](/webpack/module.png "module chunk bundle 的区别")

### ES6 Module 和 Commonjs 区别

- ES6 Module 静态引入，编译时引入
- Commonjs 动态引入，执行时引入
- 只有 ES6 Module 才能静态分析，实现 Tree-Shaking

### 前端为何要进行打包和构建

- 体积更小（Tree-Shaking、压缩、合并），加载更快
- 编译高级语言或语法（TS、ES6+、模块化、scss）
- 兼容性和错误检查(Polyfill、postcss、eslint)
- 统一、高效的开发环境
- 统一的构建流程和产出标准
- 集成公司构建规范（提测、上线等）

### loader 和 plugin 的区别

- loader 模块转换器，如 less -> css
- plugin 扩展插件，如 HtmlWebpackPlugin，它丰富了 webpack 本身，针对是 loader 结束后，webpack 打包的整个过程，它并不直接操作文件，而是基于事件机制工作，会监听 webpack 打包过程中的某些节点，执行广泛的任务

### babel 和 webpack 的区别

- babel - JS 新语法编译工具，不关心模块化
- webpack - 打包构建工具，是多个 loader plugin 的集合

### babel-polyfill 和 babel-runtime 的区别

- babel-polyfill 会污染全局
- babel-runtime 不会污染全局
- 产出第三方 lib 要用 babel-runtime

### 为何 Proxy 不能被 Polyfill

- 如 Class 可以用 function 模拟
- 如 Promise 可以用 callback 来模拟
- 但 Proxy 的功能用 Object.defineProperty 无法模拟

## webpack 按需加载原理

### 懒加载（按需加载）的前提

进行懒加载的子模块（子组件）需要是一个单独的文件。因为懒加载是对子模块（子组件）进行延后加载。如果子模块（子组件）不单独打包，而是和别的模块掺和在一起，那其他模块加载时就会将整个文件加载出来了，这样子模块（子组件）就被提前加载出来了。所以，要实现懒加载，就得先将进行懒加载的子模块（子组件）分离出来

### 借助函数实现懒加载（按需加载）

无论使用函数声明还是函数表达式创建函数，函数被创建后并不会立即执行函数内部的代码，只有等到函数被调用之后，才执行内部的代码

只要将需要进行懒加载的`子模块文件（children chunk）`的引入语句（`特指import()`）放到一个函数内部。然后在需要加载的时候执行该函数。这样就可以实现懒加载（按需加载）。这也就是是懒加载（按需加载）的原理了

```js
// import和require的比较
import 是解构过程并且是编译时执行
require 是赋值过程并且是运行时才执行，也就是异步加载
require的性能相对于import稍低，因为require是在运行时才引入模块并且还赋值给某个变量
```

## plugin 执行顺序

`webpack`整体是一个插件架构，所有的功能都以插件的方式集成在构建流程中，通过发布订阅事件来触发各个插件执行。`webpack`核心使用`tapable`来实现插件的`binding`（绑定）和`applying`（应用）

### tapable 核心函数--compiler（编译器）和 compilation（编译）

#### compiler

`compiler`对象代表的是配置完备的`webpack`环境。`compiler`对象只在`webpack`启动时构建一次，由`webpack`组合所有的配置项构建生成

- 功能核心

`Compiler`继承自前面我们介绍的`Tapable`类，其混合了`Tapable`类以吸收其功能来注册和调用自身的插件。 大多数面向用户的插件，都是首先在`Compiler`上注册的

- compiler 事件钩子

https://webpack.js.org/api/compiler-hooks/

#### compilation

继承于`compiler`，`compilation`对象代表了一次单一的版本构建和生成资源。当运行`webpack`开发环境中间件时，每当检测到一个文件变化，一次新的编译将被创建，从而生成一组新的编译资源。一个编译对象表现了当前的模块资源、编译生成资源、变化的文件、以及被跟踪依赖的状态信息。编译对象也提供了很多关键点回调供插件做自定义处理时选择使用

#### 二者关系

- `compiler`对象代表的是不变的`webpack`环境，是针对`webpack`的
- `compilation`对象针对的是随时可变的项目文件，只要文件有改动，`compilation`就会被重新创建

## webpack proxy 原理

目的是为了便于开发者在开发模式下解决跨域问题（浏览器安全策略限制）

### 工作原理

`proxy`工作原理实质上是利用`http-proxy-middleware`这个`http`代理中间件，实现请求转发给其他服务器

在开发阶段，本地地址为`http://localhost:3000`，该浏览器发送一个前缀带有`/api`标识的请求到服务端获取数据，但响应这个请求的服务器只是将请求转发到另一台服务器中

```js
const express = require("express");
const proxy = require("http-proxy-middleware");

const app = express();

app.use(
  "/api",
  proxy({ target: "http://www.example.org", changeOrigin: true })
);
app.listen(3000);

// http://localhost:3000/api/foo/bar -> http://www.example.org/api/foo/bar
```

**服务器与服务器之间请求数据并不会存在跨域行为，跨域行为是浏览器安全策略限制**

## webpack 编译过程

### 运行流程

`webpack`的运行流程是一个串行的过程，它的工作流程就是将各个插件串联起来

在运行过程中会广播事件，插件只需要监听它所关心的事件，就能加入到这条`webpack`机制中，去改变`webpack`的运作，使得整个系统扩展性良好

从启动到结束会依次执行以下三大步骤：

- 初始化流程：从配置文件和`Shell`语句中读取与合并参数，并初始化需要使用的插件和配置插件等执行环境所需要的参数
- 编译构建流程：从`Entry`发出，针对每个`Module`串行调用对应的`Loader`去翻译文件内容，再找到该`Module`依赖的`Module`，递归地进行编译处理
- 输出流程：对编译后的`Module`组合成`Chunk`，把`Chunk`转换成文件，输出到文件系统

![运行流程](/webpack/process.png "运行流程")

### 初始化流程

从配置文件和`Shell`语句中读取与合并参数，得出最终的参数

配置文件默认下为`webpack.config.js`，也或者通过命令的形式指定配置文件，主要作用是用于激活`webpack`的加载项和插件

`webpack`将`webpack.config.js`中的各个配置项拷贝到`options`对象中，并加载用户配置的`plugins`

完成上述步骤之后，则开始初始化`Compiler`编译对象，该对象掌控者`webpack`生命周期，不执行具体的任务，只是进行一些调度工作

```js
class Compiler extends Tapable {
  constructor(context) {
    super();
    this.hooks = {
      beforeCompile: new AsyncSeriesHook(["params"]),
      compile: new SyncHook(["params"]),
      afterCompile: new AsyncSeriesHook(["compilation"]),
      make: new AsyncParallelHook(["compilation"]),
      entryOption: new SyncBailHook(["context", "entry"]),
      // 定义了很多不同类型的钩子
    };
    // ...
  }
}

function webpack(options) {
  var compiler = new Compiler();
  // ...
  // 检查options，若watch字段为true，则开启watch线程
  return compiler;
}
// ...
```

`Compiler`对象继承自`Tapable`，初始化时定义了很多钩子函数

### 编译构建流程

根据配置中的`entry`找出所有的入口文件

```js
module.exports = {
  entry: "./src/file.js",
};
```

初始化完成后会调用`Compiler`的`run`来真正启动`webpack`编译构建流程，主要流程如下：

- `compile`开始编译
- `make`从入口点分析模块及其依赖的模块，创建这些模块对象
- `build-module`构建模块
- `seal`封装构建结果
- `emit`把各个`chunk`输出到结果文件

#### compile 编译

执行了`run`方法后，首先会触发`compile`，主要是构建一个`Compilation`对象

该对象是编译阶段的主要执行者，主要会依次下述流程：执行模块创建、依赖收集、分块、打包等主要任务的对象

#### make 编译模块

当完成了上述的`compilation`对象后，就开始从`Entry`入口文件开始读取，主要执行`_addModuleChain()`函数，如下：

```js
function _addModuleChain(context, dependency, onModule, callback) {
  // ...
  // 根据依赖查找对应的工厂函数
  const Dep = /** @type {DepConstructor} */ (dependency.constructor);
  const moduleFactory = this.dependencyFactories.get(Dep);

  // 调用工厂函数NormalModuleFactory的create来生成一个空的NormalModule对象
  moduleFactory.create(
    {
      dependencies: [dependency],
      // ...
    },
    (err, module) => {
      // ...
      const afterBuild = () => {
        this.processModuleDependencies(module, (err) => {
          if (err) return callback(err);
          callback(null, module);
        });
      };

      this.buildModule(module, false, null, null, (err) => {
        // ...
        afterBuild();
      });
    }
  );
}
```

过程如下：

`_addModuleChain`中接收参数`dependency`传入的入口依赖，使用对应的工厂函数`NormalModuleFactory.create`方法生成一个空的`module`对象

回调中会把此`module`存入`compilation.modules`对象和`dependencies.module`对象中，由于是入口文件，也会存入`compilation.entries`中

随后执行`buildModule`进入真正的构建模块`module`内容的过程

#### build module 完成模块编译

这里主要调用配置的`loaders`，将我们的模块转成标准的`JS`模块

在用`Loader`对一个模块转换完后，使用`acorn`解析转换后的内容，输出对应的抽象语法树（`AST`），以方便`Webpack`后面对代码的分析

从配置的入口模块开始，分析其`AST`，当遇到`require`等导入其它模块语句时，便将其加入到依赖的模块列表，同时对新找出的依赖模块递归分析，最终搞清所有模块的依赖关系

#### seal 输出资源

`seal`方法主要是要生成`chunks`，对`chunks`进行一系列的优化操作，并生成要输出的代码

`webpack`中的`chunk`，可以理解为配置在`entry`中的模块，或者是动态引入的模块

根据入口和模块之间的依赖关系，组装成一个个包含多个模块的`chunk`，再把每个`chunk`转换成一个单独的文件加入到输出列表

#### emit 输出完成

在确定好输出内容后，根据配置确定输出的路径和文件名

```js
output: {
  path: path.resolve(__dirname, 'build'),
  filename: '[name].js'
}
```

在`Compiler`开始生成文件前，钩子`emit`会被执行，这是我们修改最终文件的最后一个机会

从而`webpack`整个打包过程则结束了

![运行流程](/webpack/process1.png "运行流程")
