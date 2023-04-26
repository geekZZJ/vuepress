# React

## 事件

```js
<div onClick={this.handleClick}>点击</div>;

handleClick = (event) => {
  console.log("event", event);
  console.log(event.nativeEvent.target); // 触发事件的div元素
  console.log(event.nativeEvent.currentTarget); // react17后绑定到root组件上
};
```

## 表单

- 受控组件
- 非受控组件

## setState

- 不可变值（纯函数）
- 异步的（无法立刻获取最新值）
  **react18 中 setTimeout、事件监听器中均是异步的**
- 可能批量合并处理

```js
// 传入对象会被合并，执行结果只+1
this.setState({
  count: this.state.count + 1,
});
this.setState({
  count: this.state.count + 1,
});
this.setState({
  count: this.state.count + 1,
});

// 传入函数不会被合并，执行结果+3
this.setState((prevState) => {
  // prevState为上次的值
  return {
    count: prevState.count + 1,
  };
});
this.setState((prevState) => {
  return {
    count: prevState.count + 1,
  };
});
this.setState((prevState) => {
  return {
    count: prevState.count + 1,
  };
});
```

## 生命周期

### 单组件生命周期

![常用生命周期](/react/lifecycle.png "常用生命周期")

### 父子组件生命周期

和 Vue 相同

## 高级特性

- 函数组件
- 非受控组件
- Portals
- context
- 异步组件
- 性能优化
- 高阶组件 HOC
- Render Props

### 函数组件

- 纯函数，输入 props，输出 JSX
- 没有实例，没有生命周期，没有 state
- 不能扩展其他方法

### 非受控组件

- ref
- defaultValue defaultChecked
- 手动操作 DOM 元素

```js
constructor(props) {
  super(props);
  this.state = {
    name: "zzj",
  };
  this.nameInputRef = React.createRef();
}

render() {
  return (
    <div>
      <input defaultValue={this.state.name} ref={this.nameInputRef} />
      <span>state.name:{this.state.name}</span>
      <button onClick={this.alertName}>alert name</button>
    </div>
  );
}

alertName = () => {
  // 通过ref获取DOM节点
  const elem = this.nameInputRef.current;
  alert(elem.value);
};
```

**使用场景**

- 必须手动操作 DOM 元素，setState 实现不了
- 文件上传`<input type="file" />`
- 某些富文本编辑器，需要传入 DOM 元素

**受控组件 vs 非受控组件**

- 优先使用受控组件，符合 React 设计原则
- 必须操作 DOM 时，再使用非受控组件

### Portals

类似于 Vue3 中传送门 Teleport

**使用场景**

- overflow: hidden
- 父组件 z-index 值太小
- fixed 需要放在 body 第一层级

### context

```js
const ThemeContext = React.createContext("light");

// class组件使用方式
class ThemeButton extends React.Component {
  static contextType = ThemeContext;
  render() {
    const theme = this.context;
    return <div>button theme is {theme}</div>;
  }
}

// 函数组件使用方式
function ThemeLink() {
  return (
    <ThemeContext.Consumer>
      {(value) => <p>link theme is {value}</p>}
    </ThemeContext.Consumer>
  );
}

function ToolBar() {
  return (
    <div>
      <ThemeButton></ThemeButton>
      <ThemeLink></ThemeLink>
    </div>
  );
}

class ContextDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: "light",
    };
  }
  render() {
    return (
      <ThemeContext.Provider value={this.state.theme}>
        <ToolBar></ToolBar>
        <hr />
        <button onClick={this.changeTheme}>change theme</button>
      </ThemeContext.Provider>
    );
  }

  changeTheme = () => {
    this.setState({
      theme: this.state.theme === "light" ? "dark" : "light",
    });
  };
}
```

### 异步组件

- import
- React.lazy
- React.Suspense

```js
import React, { lazy, Suspense } from "react";
const ContextDemo = lazy(() => import("./ContextDemo"));

render() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ContextDemo></ContextDemo>
    </Suspense>
  );
}
```

### 高阶组件 HOC

```js
const withMouse = (Component) => {
  class withMouseComponent extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        x: 0,
        y: 0,
      };
    }
    // 公共组件
    handleMouseMove = (event) => {
      this.setState({
        x: event.clientX,
        y: event.clientY,
      });
    };
    render() {
      return (
        <div style={{ height: "500px" }} onMouseMove={this.handleMouseMove}>
          {/* 1. 透传所有 props 2. 增加 mouse 属性 */}
          <Component {...this.props} mouse={this.state}></Component>
        </div>
      );
    }
  }
  return withMouseComponent;
};
```

redux connect 是高阶组件

### Render Props

```js
import React from "react";

class Mouse extends React.Component {
  constructor(props) {
    super(props);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove = (event) => {
    this.setState({
      x: event.clientX,
      y: event.clientY,
    });
  };

  render() {
    return (
      <div style={{ height: "500px" }} onMouseMove={this.handleMouseMove}>
        {this.props.render(this.state)}
      </div>
    );
  }
}

const App = () => {
  return (
    <Mouse
      render={({ x, y }) => (
        <h1>
          the mouse position is {x}-{y}
        </h1>
      )}
    ></Mouse>
  );
};

export default App;
```

## 性能优化

- shouldComponentUpdate（简称 SCU）
- PureComponent 和 React.memo
- 不可变值 immutable.js

### shouldComponentUpdate

![SCU基本用法](/react/scu.png "SCU基本用法")

**React 默认：父组件有更新，子组件也无条件更新**

#### SCU 使用总结

- SCU 默认返回 true，即 React 默认重新渲染所有子组件
- 必须配合“不可变值”一起使用
- 可先不用 SCU，有性能问题时再考虑使用

### PureComponent

PureComponent, SCU 中实现了浅比较

### memo

memo，函数组件中的 PureComponent

### immutable.js

- 彻底拥抱“不可变值”
- 基于共享数据（不是深拷贝），速度快
- 有一定学习和迁移成本，按需使用

## Redux

- store state
- action
- reducer

### 单向数据流概述

- dispatch(action)
- reducer -> newState
- subscribe 触发通知

![redux单向数据流](/react/redux.png "redux单向数据流")

### React Redux

- Provider
- connect
- mapStateToProps 和 mapDispatchToProps

### action

- 同步 action

```js
export const addTodo = (text) => ({
  type: "ADD_TODO",
  id: nextTodoId++,
  text,
});
```

- 异步 action（返回一个函数）

```js
export const addTodoAsync = (text) => {
  return (dispatch) => {
    fetch(url).then((res) => {
      // 执行异步action
      dispatch(addTodo(res.text));
    });
  };
};
```

1. redux-thunk
2. redux-promise
3. redux-saga

### Redux 中间件

![redux中间件](/react/middleware.png "redux中间件")

## React 原理

- 函数式编程
- vdom 和 diff
- JSX 本质
- 合成事件
- setState batchUpdate
- 组件渲染过程

### 函数式编程

- 纯函数
- 不可变值

### vdom 和 diff

- h 函数
- vnode 数据结构
- patch 函数
- 只比较同一层级，不跨级比较
- tag 不相同，则直接删掉重建 ，不再深度比较
- tag 和 key ，两者都相同，则认为是相同节点，不再深度比较

### 合成事件

- 所有事件挂载到 root 上
- event 不是原生的，是 SyntheticEvent 合成事件对象
- 和 Vue 事件不同，和 DOM 事件也不同

![合成事件](/react/synthesis.png "合成事件")

> 为何要合成事件机制

- 更好的兼容性和跨平台
- 挂载到 document，减少内存消耗，避免频繁解绑
- 方便事件的统一管理（如事务机制）

### setState 和 batchUpdate

![batchUpdate](/react/batchUpdate.png "batchUpdate")

> 哪些能命中 batchUpdate 机制

- 生命周期（和它调用的函数）
- React 中注册的事件（和它调用的函数）
- React 可以“管理”的入口
