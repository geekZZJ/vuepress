# Vue

## Vue2

### computed 和 watch

- computed 有缓存，data 不变则不会重新计算，可以提高性能
- watch 监听引用类型，拿不到 oldVal；监听值类型可以
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
- Vue 常见性能优化

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

- 变量和方法来源不明确，不利于阅读
- 多 mixin 可能会造成命名冲突
- mixin 和组件可能出现多对多的关系，复杂度较高

### Vuex

![Vuex](/vue/vuex.png "Vuex")

```js
// 定义store
const store = createStore({
  state: {
    count: 0,
  },
  mutations: {
    increment(state) {
      state.count++;
    },
  },
  actions: {
    increment(context) {
      context.commit("increment");
    },
  },
});

// 触发action
store.dispatch("increment");
```

### Vue-router

- 路由模式：hash、H5 history
- 路由配置：动态路由、懒加载

```js
// 路由懒加载
// 将 import UserDetails from './views/UserDetails.vue' 替换成
const UserDetails = () => import("./views/UserDetails.vue");

const router = createRouter({
  routes: [{ path: "/users/:id", component: UserDetails }],
});
```

## Vue2 原理

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

实现代码：

```js
function updateView() {
  console.log("视图更新");
}

// 重新定义数组原型
const oldArrayProperty = Array.prototype;
// 创建新对象，原型指向oldArrayProperty
const arrProto = Object.create(oldArrayProperty);
["push", "pop", "shift", "unshift", "splice"].forEach((methodName) => {
  arrProto[methodname] = function() {
    updateView();
    oldArrayProperty[methodName].call(this, ...arguments);
  };
});

function defineReactive(target, key, value) {
  // 深度监听
  observer(value);
  Object.defineProperty(target, key, {
    get() {
      return value;
    },
    set(newVal) {
      if (newVal !== value) {
        // 设置新值需要深度监听
        observer(newVal);
        value = newVal;
        updateView();
      }
    },
  });
}

function observer(target) {
  if (typeof target !== "object" || target === null) {
    return target;
  }
  if (Array.isArray(target)) {
    target.__proto__ = arrProto;
  }
  for (let key in target) {
    defineReactive(target, key, target[key]);
  }
}
```

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

### Vue 渲染和更新

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

## Vue 插件

### elementUI 中 this.\$message 原理

使用方式：

```js
this.$message("这是一条消息提示");
this.$message({ message: "这是一条成功提示", type: "success" });
```

#### 在`main.js`中引入

```js
// 引入自定义组件库
import CustomComp from "../custom-comp";
// 使用element-ui的样式作为自定义组件库的样式
import "element-ui/lib/theme-chalk/index.css";
// 使用组件库
Vue.use(CustomComp);
```

安装`Vue`插件。如果插件是一个对象，必须提供`install`方法。如果插件是一个函数，它会被作为`install`方法。`install`方法调用时，会将`Vue`作为参数传入。该方法需要在调用`new Vue()`之前被调用。

建立下图目录结构：  
![自定义组件库目录](/vue/3.png "自定义组件库目录")

1. `custom-comp/index`导出所有组件
2. `package/message/index.js`导出当前`Message`组件
3. `package/message/src/main.vue`单独抽离出一个组件，将组件的展示逻辑和交互封装集中处理
4. `package/message/src/main.js`承接 vue 实例和组件展示

#### `custom-comp/index`实现

`Vue.use`需接收一个含有`install`方法的对象，所以该文件需要导出一个含有`install`方法的对象。将`$message`方法放到`Vue.prototype`上，本次只看`Message`部分即可

```js
// 引入Message方法
import Message from "./packages/message";
// 定义 install 函数
const install = function(Vue, opts = {}) {
  // 将方法放到Vue原型上
  Vue.prototype.$message = Message;
};

export default {
  install,
  Message,
};
```

#### `custom-comp/packages/message/index.js`

导出该组件

```js
import Message from "./src/main.js";
export default Message;
```

#### `custom-comp/packages/message/src/main.vue`

删减`element-ui`的`Message`之后展示部分的组件内容，代码删除了容错和边界值判断的代码，仅仅展示了基本功能

```vue
<template>
  <transition name="el-message-fade" @after-leave="handleAfterLeave">
    <div class="el-message" :style="positionStyle" v-show="visible">
      <slot>
        <p class="el-message__content">
          {{ message }}
        </p>
      </slot>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      message: "",
      duration: 3000,
      // type: "info",
      onClose: null,
      closed: false,
      verticalOffset: 20,
      timer: null,
    };
  },
  computed: {
    positionStyle() {
      // 控制当前组件的显示位置
      return {
        top: `${this.verticalOffset}px`,
      };
    },
  },
  watch: {
    // 监听closed的变化，设置为true时，将组件销毁
    closed(newVal) {
      if (newVal) {
        this.visible = false;
      }
    },
  },
  mounted() {
    this.startTimer();
  },
  methods: {
    // transition组件的钩子，触发after-leave时执行
    handleAfterLeave() {
      // 销毁组件
      this.$destroy(true);
      // 将组件的DOM移除
      this.$el.parentNode.removeChild(this.$el);
    },

    close() {
      this.closed = true;
      if (typeof this.onClose === "function") {
        console.log("close");
        this.onClose(this);
      }
    },

    startTimer() {
      if (this.duration > 0) {
        this.timer = setTimeout(() => {
          if (!this.closed) {
            this.close();
          }
        }, this.duration);
      }
    },
  },
};
</script>
```

使用了`Vue`官方封装的`transition`组件，不仅提供了良好的过渡效果，还提供了合适的钩子便于开发者控制，组件中使用`after-leave`钩子，当组件离开时进行组件的销毁和`DOM`的移除，`visible`用于控制组件的展示与隐藏，计算属性`positionStyle`用于设置组件的展示位置，`message`为组件展示的内容数据

> script 部分可参考注释进行理解，需要注意两个地方  
> 首先需要注意生命周期钩子`mount`时做的事情，为何如此做？因为不存在`el`选项，实例不会立即进入编译阶段，需要显示调`$mount`手动开启编译  
> 还需要注意的时`close`函数中做了两件事，设置`closed`的值触发对应的`watch`，关闭组件，若是存在`onClose`方法则调用，注意这个`onClose`函数的定义是在控制部分定（package/message/src/main.js），稍后会说明

#### `custom-comp/packages/message/src/main.js`

至此已经清楚`Vue`中是通过`this.$message`触发组件的展示，而展示部分的组件内容也已完成，现在就需要通过控制部分将两者连接，达到期望的功能。与`Vue`关联比较简单，仅仅是定义一个方法并将其导出即可

```js
const Message = function(options) {
  // 逻辑编写....
};

export default Message;
```

这个时候通过`this.$message`即可调用，接下来便是将`Message`函数与组件关联，并控制展示部分

> Message 核心需要做哪些事情
>
> 1. 编译组件，使用渲染并插入到`body`中
> 2. 控制组件内的`visible`变量，触发组件的展示
> 3. 控制组件内的`verticalOffset`变量，决定组件展示时的位置

```js
import Vue from "vue";
import Main from "./main.vue";

// 使用基础 Vue 构造器，创建一个“子类”。参数是一个包含组件选项的对象
const MessageConstructor = Vue.extend(Main);

// options为外部传入数据，this.$message("这是一条消息提示");
const Message = function(options) {
  // 组件实例, 此时options与组件的data关联
  instance = new MessageConstructor({
    data: options,
  });
};
```

整个`Message`方法其余部分就是在做容错和健壮处理，整体简洁版代码如下：

```js
// 使用基础 Vue 构造器，创建一个“子类”。参数是一个包含组件选项的对象
const MessageConstructor = Vue.extend(Main);

// 当前组件
let instance;
// 将所有的message组件收集，用于位置的判断和销毁等
let instances = [];
// 每个message实例都有一个唯一标识
let seed = 1;

// options为外部传入数据，this.$message("这是一条消息提示");
const Message = function(options) {
  options = options || {};
  if (typeof options === "string") {
    options = {
      message: options,
    };
  }

  // 关闭时的回调函数, 参数为被关闭的 message 实例
  const userOnClose = options.onClose;
  const id = "message_" + seed++;

  // 增加 onClose 方法，组件销毁时，在组件内部调用
  options.onClose = function() {
    Message.close(id, userOnClose);
  };

  // 组件实例, 此时options与组件的data关联
  instance = new MessageConstructor({
    data: options,
  });

  // 设置ID
  instance.id = id;
  // 因为不存在el选项，实例不会立即进入编译阶段，需要显式调用$mount手动开启编译
  instance.$mount();
  // 将Message组件插入到body中
  document.body.appendChild(instance.$el);
  // 设置组件距离顶部的距离，每个message组件会有16px的间距
  let verticalOffset = options.offset || 20;
  instances.forEach((item) => {
    verticalOffset += item.$el.offsetHeight + 16;
  });
  instance.verticalOffset = verticalOffset;
  // 控制展示
  instance.visible = true;
  // 控制层级
  instance.$el.style.zIndex = 99;
  instances.push(instance);
  return instance;
};
```

展示组件内部会调用`this.onClose(this)`，组件内部设置`this.visible=false`关闭弹框，并且移除其对应的`DOM`结构，但是页面展示多个组件时需要修改其余组件的位置

`onClose`函数是在`Message`函数中定义

```js
// 关闭时的回调函数, 参数为被关闭的 message 实例
const userOnClose = options.onClose;
const id = "message_" + seed++;

// 增加 onClose 方法，组件销毁时，在组件内部调用
options.onClose = function() {
  Message.close(id, userOnClose);
};
```

`onClose`函数最终调用的是`Message`上的静态方法`close`

函数`Message.close`内部主要做了几件事情

- 在页面显示的组件数组中找到需要关闭的组件，将其移除
- 重新计算剩余组件的位置

```js
Message.close = function(id, userOnClose) {
  const len = instances.length;
  let index = -1;
  let removedHeight;
  for (let i = 0; i < len; i++) {
    if (id === instances[i].id) {
      removedHeight = instances[i].$el.offsetHeight;
      index = i;
      if (typeof userOnClose === "function") {
        userOnClose(instances[i]);
      }
      instances.splice(i, 1);
      break;
    }
  }
  if (len <= 1 || index === -1 || index > instances.length - 1) return;
  for (let i = index; i < len - 1; i++) {
    let dom = instances[i].$el;
    dom.style["top"] =
      parseInt(dom.style["top"], 10) - removedHeight - 16 + "px";
  }
};
```

#### `this.$message.error('错误')`的实现

`Message`组件支持`this.$message.error('错了哦，这是一条错误消息');`调用使用，到目前为止我们还不支持，代码比较简单直接上代码

```js
// 为每个 type 定义了各自的方法，如 Message.success(options)，可以直接调用
["success", "warning", "info", "error"].forEach((type) => {
  Message[type] = (options) => {
    return Message({
      type,
      message: options,
    });
  };
});
```

## 前端路由原理

### hash 的特点

- hash 变化会触发网页跳转，即浏览器的前进、后退
- hash 变化不会刷新页面，SPA 必需的特点
- hash 永远不会提交到 server 端

### hash 变化包括(window.onhashchange 可监听到)

- JS 修改 url
- 手动修改 url 的 hash
- 浏览器前进、后退

### H5 history

- 用 url 规范的路由，但跳转时不刷新页面
- history.pushState
- window.onpopstate
- H5 history 需要后端支持，访问所有路由均返回 index.html

## 面试真题

### v-for 中使用 key

- 必须用 key，且不能是 index 和 random
- diff 算法中通过 tag 和 key 来判断，是否是 sameNode
- 减少渲染次数，提升渲染性能

### 组件间通信

- 父子组件 props 和\$emit
- 自定义事件 event.$on event.$off event.\$emit
- Vuex

### 为什么组件 data 必须是一个函数

Vue 组件是一个 class，使用的时候是对这个类的实例化，目的是为了防止多个组件实例对象之间共用一个 data，产生数据污染。采用函数的形式，initData 时会将其作为工厂函数都会返回全新 data 对象

这里我们模仿组件构造函数，定义 data 属性，采用对象的形式

```js
function Component() {}
Component.prototype.data = {
  count: 0,
};
```

创建两个组件实例

```js
const componentA = new Component();
const componentB = new Component();
```

修改 componentA 组件 data 属性的值，componentB 中的值也发生了改变

```js
console.log(componentB.data.count); // 0
componentA.data.count = 1;
console.log(componentB.data.count); // 1
```

产生这样的原因这是两者共用了同一个内存地址，componentA 修改的内容，同样对 componentB 产生了影响  
如果我们采用函数的形式，则不会出现这种情况（函数返回的对象内存地址并不相同）

```js
function Component() {
  this.data = this.data();
}
Component.prototype.data = function() {
  return {
    count: 0,
  };
};
```

修改 componentA 组件 data 属性的值，componentB 中的值不受影响

```js
console.log(componentB.data.count); // 0
componentA.data.count = 1;
console.log(componentB.data.count); // 0
```

Vue 组件可能会有很多个实例，采用函数返回一个全新 data 形式，使每个实例对象的数据不会受到其他实例对象数据的污染

### ajax 请求放在哪个生命周期

- created，该阶段可以访问 data，但不能操作 DOM

### 将组件所有 props 传递给子组件

- \$props
- `<User v-bind="$props">`

### 何时使用 beforeDestroy

- 解除自定义事件 event.\$off
- 清除定时器
- 解绑自定义的 DOM 事件，如 window.scroll 等

### Vuex 中 action 和 mutation 区别

- action 中处理异步，mutation 不可以
- mutation 中做原子操作
- action 可以整合多个 mutation

### Vue 常见性能优化方式

- 合理使用 v-show 和 v-if
- 合理使用 computed
- v-for 时加 key，以及避免和 v-if 同时使用
- 自定义事件、DOM 事件及时销毁
- 合理使用异步组件
- 合理使用 keep-alive
- data 层级不要太深
- 使用 vue-loader 在开发环境做模板编译（预编译）

## Vue3

### Vue3 比 Vue2 的优势

- 性能更好
- 体积更小
- 更好的 ts 支持
- 更好的代码组织
- 更好的逻辑抽离
- 更多新功能

### Vue3 生命周期

- Options API 生命周期
- Composition API 生命周期

#### Options API 生命周期

- beforeDestroy 改为 beforeUnmount
- destroyed 改为 unmounted
- 其他沿用 Vue2 的生命周期

#### Composition API 生命周期

- setup 相当于 beforeCreate 和 created
- onBeforeMount、onMounted、onBeforeUpdate、onUpdated、onBeforeUnmount、onUnmounted

### 如何理解 ref toRef 和 toRefs

#### ref

- 生成值类型的响应式数据
- 可用于模板和 reactive
- 通过.valuie 修改值

#### toRef

- 针对一个响应式对象（reactive 封装）的属性
- 创建一个 ref，具有响应式
- 两者保持引用关系

```js
setup() {
  const state = reactive({
    age: 20,
    name: "test",
  });
  const ageRef = toRef(state, "age");
  setTimeout(() => {
    state.age = 25;
  }, 1500);
  setTimeout(() => {
    ageRef.value = 30;
  }, 3000);
  return {
    ageRef,
    state,
  };
},
// 1500ms后state.age和ageRef变为25，3000ms后state.age和ageRef变为30
```

#### toRefs

- 将响应式对象（reactive 封装）转换为普通对象
- 对象的每个属性都是对应的 ref
- 两者保持引用关系

```js
setup() {
  // 直接解构state会失去响应式
  const state = reactive({
    age: 20,
    name: "test",
  });
  // 将响应式对象变成普通对象
  // 对象的每个属性都是ref对象
  const stateAsRefs = toRefs(state);

  setTimeout(() => {
    state.age = 25;
  }, 1500);

  return {
    ...stateAsRefs,
  };
},
```

#### ref toRef toRefs 最佳使用方式

- 用 reactive 做对象的响应式，用 ref 做值类型响应式
- setup 中返回 toRets(state)，或者 toRef(state,'XXX')
- ref 的变量命名都用 xxxRef
- 合成函数返回响应式对象时 ，使用 toRets

### 为何需要 ref

- 返回值类型，会丟失响应式
- 如在 setup、computed、合成函数，都有可能返回值类型
- vue 如不定义 ref，用户将自造 ref，反而混乱

### 为何需要.value

- ref 是一个对象（不丢失响应式），value 存储值
- 通过 .value 属性的 get 和 set 实现响应式
- 用于模板、reactive 时，不需要 .value，其他情况都需要

### 为何需要 toRef 和 toRefs

- 初衷：不丢失响应式的情况下，把对象数据分解/扩散
- 前提：针对的是响应式对象（reactive 封装的）非普通对象
- 注意：不创造响应式，而是延续响应式

### Vue3 升级了哪些重要功能

- createApp
- emits 属性
- 生命周期
- 多事件

```js
<button @click="handleMulEvent1($event), handleMulEvent2()">多事件</button>

setup(props, { emit }) {
  const handleMulEvent1 = (e) => {
    console.log("111111", e);
  };

  const handleMulEvent2 = () => {
    console.log("222222");
  };

  return {
    handleMulEvent1,
    handleMulEvent2,
  };
},
```

- Fragment
- 移除.sync
- 移除 filter
- 异步组件的写法

```js
import { defineAsyncComponent } from "vue";

const AsyncComp = defineAsyncComponent(() =>
  import("./components/MyComponent.vue")
);
```

- Teleport
- Suspense
- Composition API

### Composition API 实现逻辑复用

- 抽离逻辑代码到一个函数
- 函数命名约定为 useXxxx 格式（React Hooks 也是）
- 在 setup 中引用 useXxx 函数

```js
import { onMounted, onUnmounted, ref } from "vue";
function useMousePosition() {
  const x = ref(0);
  const y = ref(0);
  function update(e) {
    x.value = e.pageX;
    y.value = e.pageY;
  }

  onMounted(() => {
    window.addEventListener("mousemove", update);
  });

  onUnmounted(() => {
    window.removeEventListener("mousemove", update);
  });
  return { x, y };
}

export default useMousePosition;
```

### Vue3 如何实现响应式

#### Proxy 基本使用

```js
const data = {
  name: "zzj",
  age: 12,
};

const proxyData = new Proxy(data, {
  get(target, key, receiver) {
    // 原型的属性不处理
    const ownKeys = Reflect.ownKeys(target);
    // 只处理本身的属性
    if (ownKeys.includes(key)) {
      console.log("get", key);
    }
    const result = Reflect.get(target, key, receiver);
    // 返回结果
    return result;
  },
  set(target, key, val, receiver) {
    if (val === target[key]) return true;
    const result = Reflect.set(target, key, val, receiver);
    console.log("set", key, val);
    console.log("result", result);
    // 是否设置成功
    return result;
  },
  deleteProperty(target, key) {
    const result = Reflect.deleteProperty(target, key);
    console.log("delete", key);
    console.log("result", result);
    // 是否删除成功
    return result;
  },
});
```

#### Reflect 作用

- 和 Proxy 能力一一对应
- 规范化、标准化、函数式
- 替代掉 Object 上的工具函数

#### Proxy 实现响应式

```js
function reactive(target = {}) {
  if (typeof target !== "object" || target === null) {
    // 不是对象或数组，直接返回
    return target;
  }

  const proxyConf = {
    get(target, key, receiver) {
      // 原型的属性不处理
      const ownKeys = Reflect.ownKeys(target);
      // 只处理本身的属性
      if (ownKeys.includes(key)) {
        console.log("get", key);
      }
      const result = Reflect.get(target, key, receiver);
      // 深度监听
      return reactive(result);
    },
    set(target, key, val, receiver) {
      // 重复的数据不处理
      if (val === target[key]) return true;
      const ownKeys = Reflect.ownKeys(target);
      if (ownKeys.includes(key)) {
        console.log("已有的key");
      } else {
        console.log("新增的key");
      }
      const result = Reflect.set(target, key, val, receiver);
      console.log("set", key, val);
      // 是否设置成功
      return result;
    },
    deleteProperty(target, key) {
      const result = Reflect.deleteProperty(target, key);
      console.log("delete", key);
      // 是否删除成功
      return result;
    },
  };

  const observed = new Proxy(target, proxyConf);
  return observed;
}
```

- 深度监听，性能更好（使用到时再进行递归）
- 可监听 新增/删除 属性
- 可监听数组变化

### watch 和 watchEffect 的区别

- 两者都可监听 data 属性变化
- watch 需要明确监听哪个属性
- watchEffect 会根据其中的属性，自动监听其变化
- watchEffect 初始化时一定会执行一次

### setup 中如何获取组件实例

- 在 setup 和其他 Composition API 中没有 this
- 可通过 getCurrentInstance 获取当前实例

### Vue3 组件间通信

- props/emit
- expose/ref
- v-model
- provide/inject
- pinia
- mitt

### Vue3 为何比 Vue2 快

- Proxy 响应式
- PatchFlag
- hoistStatic
- cacheHandler
- SSR 优化
- tree-shaking

#### PatchFlag

- 编泽模板时，动态节点做标记
- 标记 ，分为不同的类型，如 TEXT PROPS
- diff 算法时，可以区分静态节点，以及不同类型的动态节点

[PatchFlag 体验](https://template-explorer.vuejs.org/ "PatchFlag体验")
![diff算法优化](/vue/PatchFlag.png "diff算法优化")

```html
<div>
  <span>Hello World1</span>
  <span>Hello World1</span>
  <span>Hello World1</span>
  <span>{{msg}}</span>
</div>
```

模版编译后

```js
import {
  createElementVNode as _createElementVNode,
  toDisplayString as _toDisplayString,
  openBlock as _openBlock,
  createElementBlock as _createElementBlock,
} from "vue";

export function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (
    _openBlock(),
    _createElementBlock("div", null, [
      // 静态节点
      _createElementVNode("span", null, "Hello World1"),
      _createElementVNode("span", null, "Hello World1"),
      _createElementVNode("span", null, "Hello World1"),
      // 动态节点，并做标记 1
      _createElementVNode(
        "span",
        null,
        _toDisplayString(_ctx.msg),
        1 /* TEXT */
      ),
    ])
  );
}
```

#### hoistStatic

- 将静态节点的定义，提升到父作用域，缓存起来
- 多个相邻的静态节点 ，会被合并起来
- 典型的拿空间换时间的优化策略

```html
<div>
  <span>Hello World1</span>
  <span>Hello World1</span>
  <span>Hello World1</span>
  <span>{{msg}}</span>
</div>
```

开启 hoistStatic，模版编译后

```js
import {
  createElementVNode as _createElementVNode,
  toDisplayString as _toDisplayString,
  openBlock as _openBlock,
  createElementBlock as _createElementBlock,
} from "vue";

// 静态节点的定义，提升到父作用域，缓存起来
const _hoisted_1 = /*#__PURE__*/ _createElementVNode(
  "span",
  null,
  "Hello World1",
  -1 /* HOISTED */
);
const _hoisted_2 = /*#__PURE__*/ _createElementVNode(
  "span",
  null,
  "Hello World1",
  -1 /* HOISTED */
);
const _hoisted_3 = /*#__PURE__*/ _createElementVNode(
  "span",
  null,
  "Hello World1",
  -1 /* HOISTED */
);

export function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (
    _openBlock(),
    _createElementBlock("div", null, [
      _hoisted_1,
      _hoisted_2,
      _hoisted_3,
      _createElementVNode(
        "span",
        null,
        _toDisplayString(_ctx.msg),
        1 /* TEXT */
      ),
    ])
  );
}
```

#### cacheHandler

缓存事件

```html
<div>
  <span @click="handleClick">Hello World1</span>
  <span>{{msg}}</span>
</div>
```

开启 cacheHandler，模版编译后

```js
import {
  createElementVNode as _createElementVNode,
  toDisplayString as _toDisplayString,
  openBlock as _openBlock,
  createElementBlock as _createElementBlock,
} from "vue";

export function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (
    _openBlock(),
    _createElementBlock("div", null, [
      _createElementVNode(
        "span",
        {
          onClick:
            // 开启cacheHandler效果，有缓存取缓存
            _cache[0] ||
            (_cache[0] = (...args) =>
              _ctx.handleClick && _ctx.handleClick(...args)),
        },
        "Hello World1"
      ),
      _createElementVNode(
        "span",
        null,
        _toDisplayString(_ctx.msg),
        1 /* TEXT */
      ),
    ])
  );
}
```

#### SSR 优化

- 静态节点直接输出 ，绕过了 vdom
- 动态节点，还是需要动态渲染

```html
<div>
  <span>Hello World1</span>
  <span>Hello World1</span>
  <span>Hello World1</span>
  <span>{{msg}}</span>
</div>
```

开启 SSR 优化，模版编译后

```js
import { mergeProps as _mergeProps } from "vue";
import {
  ssrRenderAttrs as _ssrRenderAttrs,
  ssrInterpolate as _ssrInterpolate,
} from "vue/server-renderer";

export function ssrRender(
  _ctx,
  _push,
  _parent,
  _attrs,
  $props,
  $setup,
  $data,
  $options
) {
  const _cssVars = { style: { color: _ctx.color } };
  _push(
    `<div${_ssrRenderAttrs(
      _mergeProps(_attrs, _cssVars)
    )}><span>Hello World1</span><span>Hello World1</span><span>Hello World1</span><span>${_ssrInterpolate(
      _ctx.msg
    )}</span></div>`
  );
}
```

#### tree shaking

- 编译时，根据不同的情况，引入不同的 API

### Vite 为何启动快

- 开发环境使用 ES6 Module，无需打包——非常快
- 生产环境使用 rollup，并不会快很多

### Composition API 和 React Hooks 对比

- 前者 setup 只会被调用一次，而后者函数会被多次调用
- 前者无需 useMemo useCallback，因为 setup 只调用一次
- 前者无需顾虑调用顺序，而后者需要保证 hooks 的顺序一致
- 前者 reactive + ref 比后者 useState 要难理解
