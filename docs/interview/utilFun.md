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

## 控制请求并发数

### 通过 for 循环实现

- `urls`的长度为`0`时，`results`就没有值，此时应该返回空数组
- `maxNum`大于`urls`的长度时，应该取的是`urls`的长度，否则则是取`maxNum`
- 需要定义一个`count`计数器来判断是否已全部请求完成
- 因为没有考虑请求是否请求成功，所以请求成功或报错都应把结果保存在`results`集合中
- `results`中的顺序需和`urls`中的保持一致

```javascript
/**
 * 并发请求函数
 * @param {*} urls 请求地址
 * @param {*} maxNum 最大并发数
 * @returns
 */
const concurrencyRequest = (urls, maxNum) => {
  return new Promise((resolve) => {
    if (urls.length === 0) {
      resolve([]);
      return;
    }
    const results = [];
    // 下一个请求的下标
    let index = 0;
    // 当前请求完成的数量
    let count = 0;

    // 发送请求
    async function request() {
      // index与urls相等则不向下执行创建请求
      if (index === urls.length) return;
      // 保存序号，使result和urls相对应
      const i = index;
      const url = urls[index];
      index++;
      try {
        const resp = await fetch(url);
        // resp 加入到results
        results[i] = resp;
      } catch (err) {
        // err 加入到results
        results[i] = err;
      } finally {
        count++;
        // 判断是否所有的请求都已完成
        if (count === urls.length) {
          resolve(results);
        }
        request();
      }
    }

    // maxNum和urls.length取最小进行调用
    const times = Math.min(maxNum, urls.length);
    for (let i = 0; i < times; i++) {
      request();
    }
  });
};
```

测试代码如下：

```js
const urls = [];
for (let i = 1; i <= 20; i++) {
  urls.push(`https://jsonplaceholder.typicode.com/todos/${i}`);
}

concurrencyRequest(urls, 4).then((res) => {
  console.log(res);
});
```

### 通过 Promise.race 实现

```js
/**
 * 并发请求函数
 * @param {*} requestList 请求队列
 * @param {*} limits 并发最大数
 */
async function concurrencyRequest(requestList, limits) {
  // 维护一个promise队列
  const promises = [];
  // 当前的并发池，用Set结构方便删除
  const pool = new Set();

  // 开始并发执行所有的任务
  for (let request of requestList) {
    // 拿到promise
    const promise = request();

    // 请求结束后，从pool里面移除
    const cb = () => {
      pool.delete(promise);
    };

    // 注册下then的任务
    promise.then(cb, cb);
    pool.add(promise);
    promises.push(promise);

    // 开始执行前，先判断当前的并发任务是否超过限制
    if (pool.size >= limits) {
      // 这里因为没有try catch ，所以要捕获一下错误，不然影响下面微任务的执行
      await Promise.race(pool).catch((err) => err);
    }
  }
  // 为什么要使用 Promise.allSettled
  // 因为使用的 Promise.race ，最后一个并发请求中最快的一个已经返回
  // 但是最后一个并发请求中更慢的几个还没有返回，通过 Promise.allSettled 确保所有 promise 均返回
  return Promise.allSettled(promises);
}
```

测试代码如下：

```js
const promises = [];
for (let i = 1; i <= 20; i++) {
  // promises.push(() => fetch(`https://jsonplaceholder.typicode.com/todos/${i}`));
  promises.push(() => request(i));
}

// 其中request 可以是：
function request(url) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("请求结束：" + url);
      if (Math.random() > 0.5) {
        resolve("成功");
      } else {
        reject("错误;");
      }
    }, 2000);
  });
}

concurrencyRequest(promises, 3).then((res) => {
  console.log(res);
});
```

## [minNum, maxNum]之间取获取随机整数

Math.random 返回介于 [0,1) 之间的一个随机数

toFix(n)可用于截取小数

```js
function getRandom(minNum, maxNum) {
  if (minNum > maxNum) {
    [maxNum, minNum] = [minNum, maxNum];
  }
  return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
}
```

## 万能数据生成器

```js
const createValues = (creator, length = 10) => Array.from({ length }, creator);
```

### Array.from 语法解释

![对象遍历](/utilFun/1.png "对象遍历")

### 生成随机数数组

```js
const createValues = (creator, length = 10) => Array.from({ length }, creator);
const createRandomValues = (len) => createValues(Math.random, len);
const values = createRandomValues();
```

### 序列生成器

```js
const createValues = (creator, length = 10) => Array.from({ length }, creator);
const createRange = (start, stop, step) =>
  createValues((_, i) => start + i * step, (stop - start) / step + 1);
const values = createRange(1, 100, 3);
```

### 数据生成器

```js
const createValues = (creator, length = 10) => Array.from({ length }, creator);
function createUser(v, index) {
  return {
    name: `user-${index}`,
    age: (Math.random() * 100) >> 0,
  };
}
const users = createValues(createUser, 1000);
```

## 数组求交集

```js
// 引用类型
function intersect(arr1, arr2, key) {
  const map = new Map();
  arr1.forEach((val) => map.set(val[key]));
  console.log(map);

  return arr2.filter((val) => {
    return map.has(val[key]);
  });
}

// 原始数据类型
function intersectBase(arr1, arr2) {
  const map = new Map();
  arr1.forEach((val) => map.set(val));

  return arr2.filter((val) => {
    return map.has(val);
  });
}
```

> 为什么不使用`includes`
> 使用`includes`在数组中查找元素时性能较差，主要是由于其线性时间复杂度`O(n)`。在处理大数据集时，这会导致较高的计算开销。通过使用`Map`，可以将查找操作的时间复杂度降到`O(1)`，从而显著提高求交集操作的性能。

## 求数组最大值和最小值

```js
const numArray = [1, 3, 8, 666, 22, 9982, 11, 0];
const max = Math.max.apply(Math, numArray);
const min = Math.min.apply(Math, numArray);
```
