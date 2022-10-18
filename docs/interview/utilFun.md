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
