# webpack

## 基本配置

- 拆分配置和 merge  
  拆分 webpack.common.js、webpack.dev.js、webpack.prod.js
  ![拆分配置和 merge](/webpack/merge.png '拆分配置和 merge')
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
