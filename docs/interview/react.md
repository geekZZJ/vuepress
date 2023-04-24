# React

## 事件

```js
;<div onClick={this.handleClick}>点击</div>

handleClick = (event) => {
  console.log('event', event)
  console.log(event.nativeEvent.target) // 触发事件的div元素
  console.log(event.nativeEvent.currentTarget) // react17后绑定到root组件上
}
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
})
this.setState({
  count: this.state.count + 1,
})
this.setState({
  count: this.state.count + 1,
})

// 传入函数不会被合并，执行结果+3
this.setState((prevState) => {
  // prevState为上次的值
  return {
    count: prevState.count + 1,
  }
})
this.setState((prevState) => {
  return {
    count: prevState.count + 1,
  }
})
this.setState((prevState) => {
  return {
    count: prevState.count + 1,
  }
})
```
