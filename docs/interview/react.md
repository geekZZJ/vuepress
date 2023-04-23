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
