# 脚手架

## 脚手架执行原理

![脚手架执行过程](/cli/1.png "脚手架执行过程")

- 在终端输入`vue create vue-test-app`
- 终端解析出`vue`命令
- 终端在环境变量中找到`vue`命令
- 终端根据`vue`命令链接到实际文件`vue.js`
- 终端利用`node`执行`vue.js`
- `vue.js`解析`command / options`
- `vue.js`执行`command`
- 执行完毕，退出执行

## 从应用的角度看如何开发一个脚手架

> 以`vue-cli`为例

- 开发`npm`项目，该项目中应包含一个`bin/vue.js`文件，并将这个项目发布到`npm`
- 将`npm`项目安装到`node`的`lib/node_modules`
- 在`node`的`bin`目录下配置`vue`软链接指向`lib/node_modules/@vue/cli/bin/vue.js`

## 为什么全局安装`@vue/c1i`后会添加的命令为`vue`

在`node`的`bin`目录下配置`vue`软链接指向`lib/node_modules/@vue/cli/bin/vue.js`，在`lib/node_modules/@vue/cli/package.json`中配置`bin`为`vue`，`vue`指向当前目录下的`bin/vue.js`

![脚手架执行过程](/cli/2.png "脚手架执行过程")

## 全局安装`@vue/cli`时发生了什么

- `npm`将`@vue/cli`下载到`node`的`lib/node_modules`目录下
- 解析`@vue/cli`的`package.json`，找到`bin`配置，将`bin`中配置的`vue`，在`node`的`bin`目录下创建软链接指向`lib/node_modules/@vue/cli/bin/vue.js`

## 执行`vue`命令时发生了什么，为什么`vue`指向一个`js`文件，我们却可以直接通过`vue`命令去执行它

- 在`node`的`bin`目录下查找`vue`，找到软链接，软链接指向`lib/node_modules/@vue/cli/bin/vue.js`
- 执行`vue.js`，因为文件顶部有`#!/usr/bin/env node`，会在当前环境变量中查找`node`并运行起来，所以`node`会自动执行`vue.js`
