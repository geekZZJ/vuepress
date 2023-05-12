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

#### TerserJSPlugin 开启进程压缩

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
- plugin 扩展插件，如 HtmlWebpackPlugin

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
