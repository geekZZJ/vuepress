# 工具函数

## Date 类型转 xxx-xx-xx

```js
/**
 * Date类型转xxx-xx-xx
 * @param {Date} dt
 * @returns String
 */
function formatDate(dt) {
  if (!dt) {
    dt = new Date();
  }
  const year = dt.getFullYear();
  const month = dt.getMonth() + 1;
  const date = dt.getDate();
  if (month < 10) {
    // 强制类型转换
    month = "0" + month;
  }
  if (date < 10) {
    date = "0" + date;
  }
  return year + "-" + month + "-" + date;
}
const dt = new Date();
const formatDate = formatDate(dt); // 2022-10-18
```

## 遍历对象和数组的通用 forEach 函数

```js
/**
 * 遍历对象和数组的通用forEach函数
 * @param {Array|Object} obj 对象或数组
 * @param {Function} fn 回调函数
 */
function forEach(obj, fn) {
  if (obj instanceof Array) {
    // 判断是不是数组
    obj.forEach(function(item, index) {
      fn(index, item);
    });
  } else {
    // 不是数组就是对象
    for (const key in obj) {
      fn(key, obj[key]);
    }
  }
}
```

## 防抖（debounce）函数

```js
function debounce(fn, delay = 500) {
  // timer在闭包中
  let timer = null;
  return function() {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, arguments);
      timer = null;
    }, delay);
  };
}

// 使用
const input1 = document.getElementById("input1");
input1.addEventListener(
  "keyup",
  debounce(() => {
    console.log(input1.value);
  }, 1000)
);
```

## 节流（throttle）函数

```js
function throttle(fn, delay) {
  let timer = null;
  return function() {
    if (timer) return;
    timer = setTimeout(() => {
      fn.apply(this, arguments);
      timer = null;
    }, delay);
  };
}

// 使用
const div1 = document.getElementById("div1");
div1.addEventListener(
  "drag",
  throttle((e) => {
    console.log(e.offsetX, e.offsetY);
  }, 500)
);
```

## 深度比较

```js
// 判断是否为数组或对象
function isObject(obj) {
  return typeof obj === "object" && obj !== null;
}

// 深度比较
function isEqual(obj1, obj2) {
  if (!isObject(obj1) || !isObject(obj2)) {
    return obj1 === obj2;
  }
  if (obj1 === obj2) return true;
  // 两个都是对象或数组，且不相等
  // 先比较key的个数
  const obj1Keys = Object.keys(obj1);
  const obj2Keys = Object.keys(obj2);
  if (obj1Keys.length !== obj2Keys.length) return false;
  // 以obj1为基准，和obj2一次递归比较
  for (const key in obj1) {
    const res = isEqual(obj1[key], obj2[key]);
    if (!res) return false;
  }
  return true;
}

// 用法
const obj1 = {
  a: 100,
  b: {
    x: 100,
    y: 200,
  },
};
const obj2 = {
  a: 100,
  b: {
    x: 100,
    y: 200,
  },
};
console.log(isEqual(obj1, obj2)); // true
```

## trim 方法

```js
String.prototype.trim = function() {
  return this.replace(/^\s+/, "").replace(/\s+$/, "");
};
```

## 获取页面 url 参数

- 方法一

```js
function query(name) {
  // 去掉?，仅保留a=1&b=2
  const search = location.search.substring(1);
  // 正则匹配
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, "i");
  const res = search.match(reg);
  if (res === null) {
    return null;
  }
  return res[2];
}
// query("b");
```

- 方法二

```js
function query(name) {
  const search = location.search;
  const p = new URLSearchParams(search);
  return p.get(name);
}
// query("b");
```

## 手写数组 flat

```js
function flat(arr) {
  // 验证arr中是否还有深层数组
  const isDeep = arr.some((item) => Array.isArray(item));
  if (!isDeep) {
    return arr;
  }
  // 类似于[].concat([1,2,3,4])
  const res = Array.prototype.concat.apply([], arr);
  return flat(res);
}
```

## 数组去重

```js
function unique(arr) {
  const set = new Set(arr);
  return [...set];
}

// console.log(unique([1, 3, 4, 5, 5, 6, 6, 3]));
```
