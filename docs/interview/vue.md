# Vue

## Vue2

### computed 和 watch

- computed 有缓存，data 不变则不会重新计算
- watch 监听引用类型，拿不到 oldVal；监听引用类型可以
- watch 深度监听

```js
watch: {
  obj: {
    handler: function (newVal, oldVal) {
      console.log(newVal, oldVal);
    },
    deep: true,
  },
},
```

### v-if 及 v-show 区别及使用场景

- v-show 通过 CSS display 控制显示和隐藏
- v-if 是组件真正的渲染和销毁，而不是显示和隐藏
- 频繁切换使用 v-show，否则用 v-if

### 列表渲染

- 如何遍历对象——也可以用 v-for
- key 的重要性。key 不能乱写（如 random 或者 index）
- v-for 和 v-if 不能一起使用

### 事件

```js
<button @click="inc2(2, $event)">添加2</button>

inc2(num, event) {
  this.num = this.num + num;
  console.log(event);
  // 1. event 是原生的
  // 2. 事件被挂载到当前元素
}
```

### 兄弟组件通信

- 通过`props`和`emit`，子组件向外`emit`事件，修改父组件中的值，兄弟组件通过`props`接收父组件的值
- 通过创建 event.js 实现，如下：

```js
// event.js
import Vue from "vue";
export default new Vue();

// A.vue
handleAdd() {
  event.$emit("onAddTitle", this.content);
},

// B.vue
mounted() {
  event.$on("onAddTitle", this.addTitleHandler);
},
beforeDestroy() {
  // 及时销毁，否则可能造成内存泄漏
  event.$off("onAddTitle");
},
```

### 生命周期

#### 单个组件

- beforeCreate
- created
- beforeMount
- mounted
- beforeUpdate
- updated
- beforeDestroy
- destroyed

![生命周期](/vue/lifecycle.png "生命周期")

> mounted 和 created 的区别
> created：在模板渲染成 html 前调用，即通常初始化某些属性值，然后再渲染成视图
> mounted：在模板渲染成 html 后调用，通常是初始化页面完成后，再对 html 的 dom 节点进行一些需要的操作

#### 父子组件

1. 加载渲染过程
   父组件 created -> 子组件 created -> 子组件 mounted -> 父组件 mounted

2. 子组件更新过程
   父组件 beforeUpdate -> 子组件 beforeUpdate -> 子组件 updated -> 父组件 updated

3. 销毁过程
   父组件 beforeDestroy -> 子组件 beforeDestroy -> 子组件 destroyed -> 父组件 destroyed

### 自定义 v-model

```js
<p>{{ test }}</p>
<input type="text" :value="test" @input="test = $event.target.value" />
```

- input 元素的 value = this.name
- 绑定 input 事件 this.name = \$event.target.value
- data 更新触发 re-render

### \$nextTick

- Vue 是异步渲染
- data 改变之后，DOM 不会立刻渲染
- `$nextTick` 会在 DOM 渲染之后被触发，以获取最新 DOM 节点

### slot

#### 作用域插槽

父组件可访问插槽中的数据

```js
// 父组件
<ScopedSlotDemo :url="website.url">
  <template v-slot="slotProps"> {{ slotProps.testData.title }} </template>
</ScopedSlotDemo>

export default {
  data() {
    return {
      website: {
        url: "test.com",
        title: "测试title",
        subTitle: "程序员",
      },
    };
  },
};


-------------------------------
// 子组件
<template>
  <a :href="url">
    <slot :testData="website">
      {{ website.subTitle }}
    </slot>
  </a>
</template>

export default {
  props: ["url"],
  data() {
    return {
      website: {
        url: "111.com",
        title: "zzj",
        subTitle: "年少轻狂",
      },
    };
  },
};
```

#### 具名插槽

![具名插槽](/vue/1.png "具名插槽")

### 动态组件

```js
<component :is="CustomVModelName"></component>

export default {
  data() {
    return {
      CustomVModelName: "CustomVModel",
    };
  },
};
```

### keep-alive

- 缓存组件
- 频繁切换，不需要重复渲染
- vue 常见性能优化

```js
<keep-alive>
  <KeepAliveStageA v-if="state === 'A'" />
  <KeepAliveStageB v-if="state === 'B'" />
  <KeepAliveStageC v-if="state === 'C'" />
</keep-alive>
```

### mixin

多个组件有相同的逻辑，抽离出来

**缺点**

- 变量和方法 来源不明确，不利于阅读
- 多 mixin 可能会造成命名冲突
- mixin 和组件可能出现多对多的关系，复杂度较高

### Vuex

![Vuex](/vue/vuex.png "Vuex")

### Vue-router

- 路由模式：hash、H5 history
- 路由配置：动态路由、懒加载

## Vue 原理

### 组件化基础

#### 数据驱动视图

- Vue:MVVM
  ![MVVM](/vue/MVVM.png "MVVM")
- React:setState

### Vue 响应式

- 组件 data 的数据一旦变化，立刻触发视图的更新
- 实现数据驱动视图的第一步
- 核心 API - Object.defineProperty
  ![defineProperty](/vue/defineProperty.png "defineProperty")

#### defineProperty 缺点

- 深度监听，需要递归到底，一次性计算量大
- 无法监听新增属性/删除属性(Vue.set Vue.delete)
- 无法原生监听数组，需要特殊处理

### 虚拟 DOM

- 用 JS 模拟 DOM 结构(vnode)
- 新、旧 vnode 对比，得出最小的更新范围，最后更新 DOM
- 数据驱动视图的模式下，有效控制 DOM 操作

**学习 snabbdom**

### diff 算法

- 只比较同一层级，不跨级比较
- tag 不相同，则直接删掉重建，不再深度比较
- tag 和 key，两者都相同，则认为是相同节点，不再深度比较

![tag不同](/vue/diff1.png "tag不同")

**snabbdom 中的重要方法**

- patchVnode
- addVnodes ｜ removeVnodes
- updateChildren（key 的重要性）

### 模版编译

- 模板编译为 render 函数，执行 render 函数返回 vnode
- 基于 vnode 再执行 patch 和 diff
- 使用 webpack vue-loader，会在开发环境下编译模板

### vue 渲染和更新

#### 初次渲染过程

- 解析模板为 render 函数（或在开发环境已完成，vue-loader）
- 触发响应式，监听 data 属性 getter setter
- 执行 render 函数，生成 vnode，patch(elem, vnode)

#### 更新过程

- 修改 data，触发 setter（此前在 getter 中已被监听）
- 重新执行 render 函数，生成 newVnode
- patch(vnode, newVnode)

![vue渲染更新过程](/vue/2.png "vue渲染更新过程")

### 异步渲染

- \$nextTick
- 汇总 data 的修改，一次性更新视图
- 减少 DOM 操作次数，提高性能

### 前端路由原理

#### hash 的特点

- hash 变化会触发网页跳转，即浏览器的前进、后退
- hash 变化不会刷新页面，SPA 必需的特点
- hash 永远不会提交到 server 端

#### hash 变化包括(window.onhashchange 可监听到)

- JS 修改 url
- 手动修改 url 的 hash
- 浏览器前进、后退

#### H5 history

- 用 url 规范的路由，但跳转时不刷新页面
- history.pushState
- window.onpopstate
- H5 history 需要后端支持，访问所有路由均返回 index.html

### v-for 中使用 key

- 必须用 key，且不能是 index 和 random
- diff 算法中通过 tag 和 key 来判断，是否是 sameNode
- 减少渲染次数，提升渲染性能

### 组件间通信

- 父子组件 props 和\$emit
- 自定义事件 event.$on event.$off event.\$emit
- vuex
