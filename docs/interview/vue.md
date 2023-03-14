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
