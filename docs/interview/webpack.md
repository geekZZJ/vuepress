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

- 优化 babel-loader

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

- IgnorePlugin
- noParse
- happyPack
- ParallelUglifyPlugin
- 自动刷新
- 热更新
- DllPlugin

## 面试真题

### module chunk bundle 的区别

- module - 各个源码文件，webpack 中一切皆模块
- chunk - 多模块合并成的
- bundle - 最终的输出文件

![module chunk bundle 的区别](/webpack/module.png "module chunk bundle 的区别")
