# JS

## 基本数据类型介绍，值类型和引用类型的理解

在`JS`中共有`7`种基本的数据类型，分别为：`Undefined`、`Null`、`Boolean`、`Number`、`String`、`Object`、`Symbol`。`Symbol`是 ES6 新增的数据类型  
基本数据类型保存在栈内存中，引用数据类型保存在堆内存中，然后在栈内存中保存了一个对堆内存中实际对象的引用，即数据在堆内存中的地址，`JS`对引用数据类型的操作都是操作对象的引用而不是实际的对象，如果`obj1`拷贝了`obj2`，那么这两个引用数据类型就指向了同一个堆内存对象，具体操作是`obj1`将栈内存的引用地址复制了一份给`obj2`，因而它们共同指向了一个堆内存对象

> 为什么基本数据类型保存在栈中，而引用数据类型保存在堆中
>
> - 堆比栈大，栈比堆速度快
> - 基本数据类型比较稳定，而且相对来说占用的内存小
> - 引用数据类型大小是动态的，而且是无限的，引用值的大小会改变，不能把它放在栈中，否则会降低变量查找的速度，因此放在变量栈空间的值是该对象存储在堆中的地址，地址的大小是固定的，所以把它存储在栈中对变量性能无任何负面影响
> - 堆内存是无序存储，可以根据引用直接获取  
>   `注`：按引用访问：JS 不允许直接访问保存在堆内存中的对象，所以在访问一个对象时，首先得到的是这个对象在堆内存中的地址，然后再按照这个地址去获得这个对象中的值

## 数据类型的判断

- typeof：能判断所有**值类型，函数**。不可对**null、对象、数组**进行精确判断，因为都返回`object`
- instanceof：能判断**对象**类型，不能判断基本数据类型，其**内部运行机制是判断在其原型链中能否找到该类型的原型**

```js
class People {}
class Student extends People {}

const zzj = new Student();

console.log(zzj instanceof People); // true
console.log(zzj instanceof Student); // true
```

其实现就是顺着**原型链**去找，如果能找到对应的`xxxx.prototype`即为`true`。比如这里的`zzj`作为实例，顺着原型链能找到`Student.prototype`及`People.prototype`，所以都为`true`

- Object.prototype.toString.call()：所有原始数据类型都是能判断的，还有**Error 对象、Date 对象**等

```js
Object.prototype.toString.call(2); // "[object Number]"
Object.prototype.toString.call(""); // "[object String]"
Object.prototype.toString.call(true); // "[object Boolean]"
Object.prototype.toString.call(undefined); // "[object Undefined]"
Object.prototype.toString.call(null); // "[object Null]"
Object.prototype.toString.call(Math); // "[object Math]"
Object.prototype.toString.call({}); // "[object Object]"
Object.prototype.toString.call([]); // "[object Array]"
Object.prototype.toString.call(function() {}); // "[object Function]"
```

> 如何判断变量是否为数组？

```js
Array.isArray(arr); // true
arr.__proto__ === Array.prototype; // true
arr instanceof Array; // true
Object.prototype.toString.call(arr); // "[object Array]"
```

## 深拷贝和浅拷贝的定义

浅拷贝：
![浅拷贝](/js/1.png "浅拷贝")

> 创建一个新对象，这个对象有着原始对象属性值的一份精确拷贝。如果属性是基本类型，拷贝的就是基本类型的值，如果属性是引用类型，拷贝的就是内存地址，所以如果其中一个对象改变了这个地址，就会影响到另一个对象

深拷贝：
![深拷贝](/js/2.png "深拷贝")

> 将一个对象从内存中完整的拷贝一份出来，从堆内存中开辟一个新的区域存放新对象，且修改新对象不会影响原对象

## 手写深拷贝

```js
function clone(target, map = new Map()) {
  if (typeof target === "object" && target !== null) {
    const cloneTarget = Array.isArray(target) ? [] : {};
    if (map.get(target)) {
      return map.get(target);
    }
    // 防止循环引用
    map.set(target, cloneTarget);
    for (const key in target) {
      // 保证 key 不是原型属性
      if (target.hasOwnProperty(key)) {
        cloneTarget[key] = clone(target[key], map);
      }
    }
    return cloneTarget;
  } else {
    return target;
  }
}
```

详细解析：[如何写出一个惊艳面试官的深拷贝](https://juejin.cn/post/6844903929705136141 "如何写出一个惊艳面试官的深拷贝")

## IEEE 754 浮点数标准

![浮点数标准](/js/3.png "浮点数标准")
![浮点数标准](/js/4.png "浮点数标准")
以双精度浮点格式为例，如上图，三个参数 S E M:

```
名称                        长度        比特位置

符号位 Sign （S）            1bit        （b63）
指数部分 Exponent （E）      11bit      （b62-b52）
尾数部分 Mantissa （M）      52bit      （b51-b0）

单精度的指数部分（E）采用的偏置码为 127
双精度的指数部分（E）采用的偏置码为 1023

S=1表示负数 S=0表示正数
```

求值公式`(-1)^S*2^(E-1023)*(1.M)`  
举个例子，比如`103.0625`

- `S`符号位：因为是正数，所以为`0`
- `E`指数位：先转为二进制`1100111.0001`，然后进行规范化`1.1001110001 * 2^6`，`6 = E - 1023`，`E = 1029`，将`E = 1029`转为二进制`10000000101`
- `M`尾数：对于`1.1001110001`，M 的值为`1001110001`，因为长度有`52`位，后面补充`0`就行，结果为`1001110001000000000000000000000000000000000000000000`

大家知道，十进制有无限循坏小数，二进制也是存在的。遇到这种情况，10 进制是四舍五入，那二进制呢。 只有 0 和 1，那么是 1 就入。

## 0.1 + 0.2 != 0.3

按[IEEE 754 浮点数标准](/interview/js.html#ieee-754-浮点数标准)计算出`0.1`和啊`0.2`对应的 IEEE 754 标准的二进制数据结构，最终`0.1`为`0-01111111011-1001100110011001100110011001100110011001100110011010`，`0.2`为`0-01111111100-1001100110011001100110011001100110011001100110011010`

### 对阶

**小阶对大阶**，0.1 的指数为`01111111011=1019`，0.2 的指数为`01111111100=1020`  
0.2 的指数大，0.1 的调整指数位为 01111111100，同时尾数部分右移一位，如下

```
0.1    0-01111111100-11001100110011001100110011001100110011001100110011010
0.2    0-01111111100-1001100110011001100110011001100110011001100110011010
```

### 尾数运算

可以看到有进位

```
    0.11001100110011001100110011001100110011001100110011010    ---0.1尾数
    1.1001100110011001100110011001100110011001100110011010     ---0.2尾数
-----------------------------------------------------------------------------
   10.01100110011001100110011001100110011001100110011001110
```

### 结果规格化

需要右移一位，E+1 = 1020 + 1 = 1021 = 1111111101  
`1.M = 1.001100110011001100110011001100110011001100110011001110`

### 舍入处理

尾数小数部分`001100110011001100110011001100110011001100110011001110`长度为 54，四舍五入`0011001100110011001100110011001100110011001100110100`

### 溢出检查

指数没有溢出  
S 为 0，E 为 1021，`(-1)^S*2^(E-1023)*(1.M) => (1.0011001100110011001100110011001100110011001100110100)\*2^(-2) => 0.010011001100110011001100110011001100110011001100110100`转为 10 进制为`0.30000000000000004`  
所以**0.1 + 0.2 != 0.3**

## 如何使 0.1 + 0.2 === 0.3

- 使用`Number.EPSILON`误差范围

```js
function isEqual(a, b) {
  return Math.abs(a - b) < Number.EPSILON;
}

console.log(isEqual(0.1 + 0.2, 0.3)); // true
```

`Number.EPSILON`的实质是一个可以接受的最小误差范围，一般来说为`Math.pow(2, -52)`

- 转成字符串，对字符串做加法运算

```js
// 字符串数字相加(位数相同)
const addStrings = (num1, num2) => {
  let i = num1.length - 1;
  let j = num2.length - 1;
  const res = [];
  let carry = 0;
  while (i >= 0 || j >= 0) {
    const n1 = i >= 0 ? Number(num1[i]) : 0;
    const n2 = j >= 0 ? Number(num2[j]) : 0;
    const sum = n1 + n2 + carry;
    res.unshift(sum % 10);
    carry = Math.floor(sum / 10);
    i--;
    j--;
  }
  if (carry) res.unshift(carry);
  return res.join("");
};

const isEqual = (a, b, sum) => {
  const [intStr1, decStr1] = a.toString().split(".");
  const [intStr2, decStr2] = b.toString().split(".");
  // 整数部分相加
  const intSum = addStrings(intStr1, intStr2);
  // 小数部分相加
  const decSum = addStrings(decStr1, decStr2);
  return intSum + "." + decSum === String(sum);
};

console.log(isEqual(0.1, 0.2, 0.3)); // true
```

## 数组的常用方法

- `isArray()`用于判断一个对象是否为数组
- `join()`可以将数组转为字符串
- `toString()`把数组转换为字符串，并返回结果
- `push()`向数组的末尾添加一个或更多元素，并返回新的长度
- `pop()`删除数组的最后一个元素并返回删除的元素
- `unshift()`向数组的开头添加一个或更多元素，并返回新的长度
- `shift()`删除并返回数组的第一个元素
- `reverse()`用于颠倒数组中元素的顺序，**会改变原数组**
- `sort()`用于对数组的元素进行排序，**会改变原数组**
- `splice(index,howmany,item1,.....,itemX)`，`index`必需，规定从何处添加/删除元素。`howmany`可选，规定应该删除多少元素，必须是数字，但可以是 0，如果未规定此参数，则删除从`index`开始到原数组结尾的所有元素。`item1, ..., itemX`可选，要添加到数组的新元素。**会改变原始数组**

```js
const fruits = ["Banana", "Orange", "Apple", "Mango"];
fruits.splice(2, 0, "Lemon", "Kiwi"); // ["Banana", "Orange", "Lemon", "Kiwi" "Apple", "Mango"]
```

- `slice(start, end)`，`start`可选，规定从何处开始选取，如果是负数，那么它规定从数组尾部开始算起的位置，也就是说，-1 指最后一个元素，-2 指倒数第二个元素，以此类推。`end`可选，规定从何处结束选取，该参数是数组片断结束处的数组下标，如果没有指定该参数，那么切分的数组包含从`start`到数组结束的所有元素，如果这个参数是负数，那么它规定的是从数组尾部开始算起的元素。**不会改变原始数组**

```js
const fruits = ["Banana", "Orange", "Lemon", "Apple", "Mango"];
const citrus = fruits.slice(1, 3);
// Orange,Lemon
```

- `every()`用于检测数组所有元素是否都符合指定条件，**不会改变原始数组**
- `filter(),forEach(),map(),some()`，**不会改变原始数组**
- `reduce()`

## `reduce`深入理解

### 定义

`reduce()`接收一个函数作为累加器，数组中的每个值（从左到右）开始缩减，最终计算为一个值

### 语法：

`array.reduce(function(total, currentValue, currentIndex, arr), initialValue)`

### 参数

- `callbackFn`
  - `total`：上一次调用`callbackFn`时的返回值。在第一次调用时，若指定了初始值`initialValue`，其值则为`initialValue`，否则为数组索引为 0 的元素`array[0]`
  - `currentValue`：数组中正在处理的元素。在第一次调用时，若指定了初始值`initialValue`，其值则为数组索引为 0 的元素`array[0]`，否则为`array[1]`
  - `currentIndex`：数组中正在处理的元素的索引。若指定了初始值`initialValue`，则起始索引号为 0，否则从索引 1 起始
  - `arr`：用于遍历的数组
- `initialValue`: 作为第一次调用`callback`函数时参数`total`的值。若指定了初始值`initialValue`，则`currentValue`则将使用数组第一个元素；否则`total`将使用数组第一个元素，而`currentValue`将使用数组第二个元素

### 高级用法

- 累加累乘

```js
// 累加
function accumulation(arr) {
  return arr.reduce((t, v) => t + v, 0);
}

// 累乘
function multiplication(arr) {
  return arr.reduce((t, v) => t * v, 1);
}

accumulation([1, 2, 3, 4]); // 10
multiplication([1, 2, 3, 4]); // 24
```

- 权重求和

```js
const scores = [
  { score: 90, subject: "chinese", weight: 0.5 },
  { score: 95, subject: "math", weight: 0.3 },
  { score: 85, subject: "english", weight: 0.2 },
];

const result = scores.reduce((t, v) => t + v.score * v.weight, 0); // 90.5
```

- 代替`reverse`

```js
// return a,b 最终返回值为b（最后的变量）
function reverse(arr) {
  return arr.reduceRight((t, v) => (t.push(v), t), []);
}

const result = reverse([1, 2, 3, 4, 5]); // [5, 4, 3, 2, 1]
```

- 代替`map`和`filter`

```js
const arr = [0, 1, 2, 3];
// 代替map：[0, 2, 4, 6]
const b = arr.reduce((t, v) => [...t, v * 2], []);

// 代替filter：[2, 3]
const d = arr.reduce((t, v) => (v > 1 ? [...t, v] : t), []);

// 代替map和filter：[4, 6]
const f = arr.reduce((t, v) => (v * 2 > 2 ? [...t, v * 2] : t), []);
```

- 代替`some`和`every`

```js
const scores = [
  { score: 45, subject: "chinese" },
  { score: 90, subject: "math" },
  { score: 60, subject: "english" },
];

// 代替some：至少一门合格
const isAtLeastOneQualified = scores.reduce(
  (t, v) => t || v.score >= 60,
  false
); // true
// 代替every：全部合格
const isAllQualified = scores.reduce((t, v) => t && v.score >= 60, true); // false
```

- 数组过滤

```js
// 将arr1中与arr2都含有的元素从arr1中过滤掉
function difference(arr = [], oArr = []) {
  return arr.reduce((t, v) => (!oArr.includes(v) && t.push(v), t), []);
}

const arr1 = [1, 2, 3, 4, 5];
const arr2 = [2, 3, 6];
const result = difference(arr1, arr2); // [1, 4, 5]
```

- 数组扁平

```js
function flat(arr = []) {
  return arr.reduce((t, v) => t.concat(Array.isArray(v) ? flat(v) : v), []);
}

const arr = [0, 1, [2, 3], [4, 5, [6, 7]], [8, [9, 10, [11, 12]]]];
const result = flat(arr); // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
```

- 数组去重

```js
function uniq(arr) {
  return arr.reduce((t, v) => (t.includes(v) ? t : [...t, v]), []);
}

const arr = [2, 1, 0, 3, 2, 1, 2];
const result = uniq(arr); // [2, 1, 0, 3]
```

- 数组最大最小值

```js
// 求最大值
function max(arr) {
  return arr.reduce((t, v) => (t > v ? t : v));
}

// 求最小值
function min(arr) {
  return arr.reduce((t, v) => (t < v ? t : v));
}

const arr = [12, 45, 21, 65, 38, 76, 108, 43];
const result = max(arr); // 108
const result1 = min(arr); // 12
```

- 数组成员个数统计

```js
function count(arr) {
  return arr.reduce((t, v) => ((t[v] = (t[v] || 0) + 1), t), {});
}

const arr = [0, 1, 1, 2, 2, 2];
const result = count(arr); // { 0: 1, 1: 2, 2: 3 }
```

- 数组成员位置记录

```js
function position(arr, val) {
  return arr.reduce((t, v, i) => (v === val && t.push(i), t), []);
}

const arr = [2, 1, 5, 4, 2, 1, 6, 6, 7];
const result = position(arr, 2); // [0, 4]
```

- 字符串翻转

```js
function reverseStr(str) {
  return str.split("").reduceRight((t, v) => t + v);
}

const str = "reduce最牛逼";
const result = reverseStr(str); // "逼牛最ecuder"
```

- 斐波那契数列

```js
function fibonacci(len = 2) {
  const arr = [...new Array(len).keys()];
  return arr.reduce((t, v, i) => (i > 1 && t.push(t[i - 1] + t[i - 2]), t), [
    0,
    1,
  ]);
}

const result = fibonacci(10); // [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
```

## `sort`函数解析

### 无参时的使用

此时排序的方式是按照`ascii`码进行排序，它会先将数组里的元素全部转为字符串进行比较

```js
const arr = [23, 12, 32, 5, 21, 7, 1];
arr.sort();
console.log(arr); // [1, 12, 21, 23, 32, 5, 7]
```

### 有参数时的使用

- 首先我们来看一下`a`指代的到底是什么

```js
const arr = [23, 12, 32, 5, 21, 7, 1];

arr.sort((a, b) => {
  console.log("a:" + a);
  return 1;
});
console.log(arr);
```

![有参数](/js/5.png "有参数")  
很容易看出`a`的范围是`[arr[1],arr[arr.length-1]]`；另外我们还能看出当函数返回一个正值时，数组并没有发生变化（0 也是）

- 我们再看一`b`指的是什么

```js
const arr = [23, 12, 32, 5, 21, 7, 1];

arr.sort((a, b) => {
  console.log("b:" + b);
  return -1;
});
console.log(arr);
```

![有参数](/js/6.png "有参数")  
`b`的范围`[arr[0],arr[arr.length-2]`；另外在这里我们还得到一个使数组反序的方法

- 数字排序  
  若`a`小于`b`，在排序后的数组中`a`应该出现在`b`之前，则返回一个小于 0 的值。若`a`等于`b`，则返回 0。若`a`大于`b`，则返回一个大于 0 的值

```js
// 从小到大排序
function sortNumber(a, b) {
  return a - b;
}
```

### 结论

如果数据量较小使用二分插入排序；当数据量较大时，就会使用归并排序的思想

- 判断数组长度，小于 2 直接返回，不排序
- `sort`无参数时，先将数组里的元素全部转为字符串进行比较。此时排序的方式是按照`ascii`码进行排序

```js
// 5. Let xString be ? ToString(x).
const xString = ToString_Inline(x);

// 6. Let yString be ? ToString(y).
const yString = ToString_Inline(y);

// 7. Let xSmaller be the result of performing
//    Abstract Relational Comparison xString < yString.
// 8. If xSmaller is true, return -1.
if (StringLessThan(context, xString, yString) == True) return -1;

// 9. Let ySmaller be the result of performing
//    Abstract Relational Comparison yString < xString.
// 10. If ySmaller is true, return 1.
if (StringLessThan(context, yString, xString) == True) return 1;

// 11. Return +0.
return 0;
```

详细解析：[v8 array-sort](https://github.com/v8/v8/blob/master/third_party/v8/builtins/array-sort.tq "v8 array-sort")

## 原型和原型链

```js
function Foo() {}

let f1 = new Foo();
let f2 = new Foo();
```

![原型和原型链](/js/7.png "原型和原型链")  
推荐阅读：[JavaScript 深入之从原型到原型链](https://github.com/mqyqingfeng/blog/issues/2 "JavaScript深入之从原型到原型链")、[轻松理解 JS 原型原型链](https://juejin.cn/post/6844903989088092174 "轻松理解JS原型原型链")

## instanceof 实现原理

```js
function myInstanceof(leftValue, rightValue) {
  // 取右表达式的 prototype 值
  const rightProto = rightValue.prototype;
  // 取左表达式的__proto__值
  leftValue = leftValue.__proto__;
  while (true) {
    if (leftValue === null) {
      return false;
    }
    if (leftValue === rightProto) {
      return true;
    }
    leftValue = leftValue.__proto__;
  }
}
```

## 执行上下文

- JavaScript 采用的是词法作用域，函数的作用域在函数定义的时候就决定了

```js
const value = 1;

function foo() {
  console.log(value);
}

function bar() {
  const value = 2;
  foo();
}

bar();
```

- 在进入执行上下文时，首先会处理函数声明，其次会处理变量声明，如果变量名称跟已经声明的形式参数或函数相同，则变量声明不会干扰已经存在的这类属性

```js
console.log(foo);

function foo() {
  console.log("foo");
}

var foo = 1;
```

> `a = 1`事实上是对属性赋值操作。首先，它会尝试在当前作用域链中解析`a`；如果在当前作用域链中找到`a`作用域链，则对其进行属性进行赋值，如果没有找到`a`，则它会在全局对象（即当前作用域链的最顶层对象，如`window`对象）中创造`a`属性并赋值。**注意！它并不是声明了一个全局变量，而是创建了一个全局对象的属性**

顺序阅读：[JavaScript 深入之执行上下文栈](https://github.com/mqyqingfeng/Blog/issues/4 "JavaScript深入之执行上下文栈")、[JavaScript 深入之变量对象](https://github.com/mqyqingfeng/Blog/issues/5 "JavaScript深入之变量对象")、[JavaScript 深入之作用域链](https://github.com/mqyqingfeng/Blog/issues/6 "JavaScript深入之作用域链")、[JavaScript 深入之执行上下文](https://github.com/mqyqingfeng/Blog/issues/8 "JavaScript深入之执行上下文")

## 闭包

### 闭包难题

先看个简单的例子：

```js
var t = function() {
  var n = 99;
  var t2 = function() {
    n++;
    console.log(n);
  };
  return t2;
};

var a1 = t();
var a2 = t();

a1(); // 100
a1(); // 101

a2(); // 100
a2(); // 101
```

我们会发现，`n`的值都是从 99 开始，执行一次`a1()`的时候，值会加一，再执行一次，值再加一，但是`n`在`a1()`和`a2()`并不是公用的。你可以理解为：同一个函数形成的多个闭包的值都是相互独立的。  
接下来看这道题目，关键在于`nAdd`函数

```js
var nAdd;
var t = function() {
  var n = 99;
  nAdd = function() {
    n++;
  };
  var t2 = function() {
    console.log(n);
  };
  return t2;
};

var a1 = t();
var a2 = t();

nAdd();

a1(); // 99
a2(); // 100
```

当执行`var a1 = t()`的时候，变量`nAdd`被赋值为一个函数，这个函数是`function (){n++}`，我们命名这个匿名函数为`fn1`吧。接着执行`var a2 = t()`的时候，变量`nAdd`又被重写了，这个函数跟以前的函数长得一模一样，也是`function (){n++}`，但是这已经是一个新的函数了，我们就命名为`fn2`吧

所以当执行`nAdd`函数，我们执行的是其实是`fn2`，而不是`fn1`，我们更改的是`a2`形成的闭包里的`n`的值，并没有更改`a1`形成的闭包里的`n`的值。所以`a1()`的结果为 99 ，`a2()`的结果为 100

## 3 个判断数组的方法，介绍它们之间的区别和优劣

> Object.prototype.toString.call() 、 instanceof 以及 Array.isArray()

### Object.prototype.toString.call()

每一个继承 Object 的对象都有`toString`方法，如果`toString`方法没有重写的话，会返回`[Object type]`，其中 type 为对象的类型。但当除了 Object 类型的对象外，其他类型直接使用`toString`方法时，会直接返回都是内容的字符串，所以我们需要使用`call`或者`apply`方法来改变`toString`方法的执行上下文

```js
const an = ["Hello", "An"];
an.toString(); // "Hello,An"
Object.prototype.toString.call(an); // "[object Array]"
```

这种方法对于所有基本的数据类型都能进行判断，即使是 null 和 undefined

```js
Object.prototype.toString.call("An"); // "[object String]"
Object.prototype.toString.call(1); // "[object Number]"
Object.prototype.toString.call(Symbol(1)); // "[object Symbol]"
Object.prototype.toString.call(null); // "[object Null]"
Object.prototype.toString.call(undefined); // "[object Undefined]"
Object.prototype.toString.call(function() {}); // "[object Function]"
Object.prototype.toString.call({ name: "An" }); // "[object Object]"
```

`Object.prototype.toString.call()`常用于判断浏览器内置对象时

### instanceof

`instanceof`的内部机制是通过判断对象的原型链中是不是能找到类型的`prototype`
使用`instanceof`判断一个对象是否为数组，`instanceof`会判断这个对象的原型链上是否会找到对应的`Array`的原型，找到返回`true`，否则返回`false`

```js
[] instanceof Array; // true
```

但`instanceof`只能用来判断对象类型，原始类型不可以。并且所有对象类型`instanceof Object`都是`true`

```js
[] instanceof Object; // true
```

### Array.isArray()

功能：用来判断对象是否为数组

- `instanceof`与`isArray`
  当检测 Array 实例时，`Array.isArray`优于`instanceof`，因为`Array.isArray`可以检测出`iframe`

```js
const iframe = document.createElement("iframe");
document.body.appendChild(iframe);
xArray = window.frames[window.frames.length - 1].Array;
const arr = new xArray(1, 2, 3); // [1,2,3]

// Correctly checking for Array
Array.isArray(arr); // true
Object.prototype.toString.call(arr); // '[object Array]'
// Considered harmful, because doesn't work though iframe
arr instanceof Array; // false
```

- `isArray`与`Object.prototype.toString.call()`
  `Array.isArray()`是 ES5 新增的方法，当不存在`Array.isArray()`，可以用`Object.prototype.toString.call()`实现

```js
if (!Array.isArray) {
  Array.isArray = function(arg) {
    return Object.prototype.toString.call(arg) === "[object Array]";
  };
}
```

## 手写`bind`函数

```js
// 模拟bind
Function.prototype.bind1 = function() {
  // 将参数拆解为数组
  const args = Array.prototype.slice.call(arguments);
  // 或者用...运算符
  // const args = [...arguments].slice(1);
  // 获取this(即数组第一项)
  const t = args.shift();
  // fn.bind(...)中的fn
  const self = this;
  // 返回一个函数
  return function() {
    return self.apply(t, args);
  };
};
```

## promise

### promise 值穿透

值穿透指的是：链式调用的参数不是函数时，会发生值穿透。传入的非函数值被忽略，而传入的是之前的函数参数

- 值穿透

```js
Promise.resolve(1)
  .then(2)
  .then(Promise.resolve(3))
  .then(console.log);
// 1
```

```js
Promise.resolve(1)
  .then(function() {
    return 2;
  })
  .then(() => {
    Promise.resolve(3); // 未return promise
  })
  .then(console.log); // undefined
```

- 正常链式调用

```js
Promise.resolve(1)
  .then(() => {
    return 2;
  })
  .then(() => {
    return 3;
  })
  .then(console.log);
// 3
```

### 异常穿透

- 当在 then 中传入了第二个函数，错误就不会被 catch 捕获到了

```js
Promise.reject(1)
  .then((res) => {
    console.log(res);
  })
  .then(
    (res) => {
      console.log(res);
    },
    (rej) => {
      console.log(`rej****${rej}`); // rej****1
    }
  )
  .catch((err) => {
    console.log(`err****${err}`);
  });
```

- 被 then 捕获的错误也会传给下一个链式调用成功的状态，值为`undefined`

```js
Promise.reject(1)
  .then((res) => {
    console.log(res);
  })
  .then(
    (res) => {
      console.log(res);
    },
    (rej) => {
      console.log(`rej****${rej}`); // rej****1
    }
  )
  .then(
    (res) => {
      console.log(`res****${res}`); // res****undefined
    },
    (rej) => {
      console.log(`rej****${rej}`);
    }
  )
  .catch((err) => {
    console.log(`err${err}`);
  });
```

### 实现 Promise

> https://juejin.cn/post/6856213486633304078  
> https://juejin.cn/post/6844903625769091079

```js
class Promise1 {
  // 构造器
  constructor(executor) {
    // 初始化state为等待态
    this.state = "pending";
    // 成功的值
    this.value = undefined;
    // 失败的原因
    this.reason = undefined;
    // 成功存放的数组
    this.onResolvedCallbacks = [];
    // 失败存放法数组
    this.onRejectedCallbacks = [];

    const resolve = (value) => {
      // state改变,resolve调用就会失败
      if (this.state === "pending") {
        // resolve调用后，state转化为成功态
        this.state = "fulfilled";
        // 储存成功的值
        this.value = value;
        // 一旦resolve执行，调用成功数组的函数
        this.onResolvedCallbacks.forEach((fn) => fn());
      }
    };

    const reject = (reason) => {
      // state改变,reject调用就会失败
      if (this.state === "pending") {
        // reject调用后，state转化为失败态
        this.state = "rejected";
        // 储存失败的原因
        this.reason = reason;
        // 一旦reject执行，调用失败数组的函数
        this.onRejectedCallbacks.forEach((fn) => fn());
      }
    };

    // 如果executor执行报错，直接执行reject
    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }

  #handle(callback, data, resolve, reject) {
    try {
      const result = callback(data);
      if (result instanceof Promise) {
        // 2. 如果回调函数返回的是promise，return的promise的结果就是这个promise的结果
        result.then(
          (value) => {
            resolve(value);
          },
          (reason) => {
            reject(reason);
          }
        );
      } else {
        // 1. 如果回调函数返回的不是promise，return的promise的状态是resolved，value就是返回的值。
        resolve(result);
      }
    } catch (error) {
      //  3.如果执行onResolved的时候抛出错误，则返回的promise的状态为rejected
      reject(error);
    }
  }

  // then 方法 有两个参数onFulfilled onRejected
  then(onFulfilled, onRejected) {
    onFulfilled =
      typeof onFulfilled === "function" ? onFulfilled : (value) => value;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (reason) => {
            throw reason;
          };

    return new Promise1((resolve, reject) => {
      // 状态为fulfilled，执行onFulfilled，传入成功的值
      if (this.state === "fulfilled") {
        this.#handle(onFulfilled, this.value, resolve, reject);
      }
      // 状态为rejected，执行onRejected，传入失败的原因
      if (this.state === "rejected") {
        this.#handle(onRejected, this.reason, resolve, reject);
      }
      // 当状态state为pending时
      if (this.state === "pending") {
        // onFulfilled传入到成功数组
        this.onResolvedCallbacks.push(() => {
          this.#handle(onFulfilled, this.value, resolve, reject);
        });
        // onRejected传入到失败数组
        this.onRejectedCallbacks.push(() => {
          this.#handle(onRejected, this.reason, resolve, reject);
        });
      }
    });
  }

  catch(fn) {
    return this.then(null, fn);
  }
}

Promise1.resolve = function(value) {
  return new Promise1((resolve, reject) => {
    if (value instanceof Promise1) {
      // 如果 value 是 promise
      value.then(
        (value) => {
          resolve(value);
        },
        (reason) => {
          reject(reason);
        }
      );
    } else {
      // 如果 value 不是 promise
      resolve(value);
    }
  });
};

Promise1.reject = function(value) {
  return new Promise1((resolve, reject) => {
    reject(value);
  });
};

Promise1.all = function(promises) {
  const values = [];
  // 状态为resolved的promise的数量
  var resolvedCount = 0;
  return new Promise1((resolve, reject) => {
    // 遍历promises，获取每个promise的结果
    promises.forEach((p, index) => {
      Promise.resolve(p).then(
        (value) => {
          // p状态为resolved，将值保存起来
          values[index] = value;
          resolvedCount++;
          // 如果全部p都为resolved状态，return的promise状态为resolved
          if (resolvedCount === promises.length) {
            resolve(values);
          }
        },
        (reason) => {
          // 只要有一个失败，return的promise状态就为reject
          reject(reason);
        }
      );
    });
  });
};

Promise.race = function(promises) {
  return new Promise((resolve, reject) => {
    // 遍历promises，获取每个promise的结果
    promises.forEach((p) => {
      Promise.resolve(p).then(
        (value) => {
          // 只要有一个成功，返回的promise的状态就为resolved
          resolve(value);
        },
        (reason) => {
          // 只要有一个失败，return的promise状态就为reject
          reject(reason);
        }
      );
    });
  });
};
```

## 模块化

### 模块化的好处

- 避免命名冲突（减少命名空间污染）
- 更好的分离，按需加载
- 更高复用性
- 高可维护性

### CommonJS

暴露模块：`module.exports = value`或`exports.xxx = value`

引入模块：`require(xxx)`，如果是第三方模块，`xxx`为模块名；如果是自定义模块，`xxx`为模块文件路径

代表：node.js

### AMD

`CommonJS`规范加载模块是同步的，也就是说，只有加载完成，才能执行后面的操作。`AMD`规范则是非同步加载模块，允许指定回调函数。由于`Node.js`主要用于服务器编程，模块文件一般都已经存在于本地硬盘，所以加载起来比较快，不用考虑非同步加载的方式，所以`CommonJS`规范比较适用。但是，如果是浏览器环境，要从服务器端加载模块，这时就必须采用非同步模式，因此浏览器端一般采用`AMD`规范。此外`AMD`规范比`CommonJS`规范在浏览器端实现要来着早。

#### 基本语法

- 定义暴露模块

```js
// 定义没有依赖的模块
define(function() {
  return 模块;
});

// 定义有依赖的模块
define(["module1", "module2"], function(m1, m2) {
  return 模块;
});
```

- 引入使用模块

```js
require(["module1", "module2"], function(m1, m2) {
  // 使用 m1 / m2
});
```

### CMD

`CMD`规范专门用于浏览器端，模块的加载是异步的，模块使用时才会加载执行。`CMD`规范整合了`CommonJS`和`AMD`规范的特点。在`Sea.js`中，所有`JS`模块都遵循`CMD`模块定义规范

#### 基本语法

- 定义暴露模块

```js
// 定义没有依赖的模块
define(function(require, exports, module) {
  exports.xxx = value;
  module.exports = value;
});

// 定义有依赖的模块
define(function(require, exports, module) {
  // 引入依赖模块(同步)
  var module2 = require("./module2");
  // 引入依赖模块(异步)
  require.async("./module3", function(m3) {});
  // 暴露模块
  exports.xxx = value;
});
```

- 引入使用模块

```js
define(function(require) {
  var m1 = require("./module1");
  var m4 = require("./module4");
  m1.show();
  m4.show();
});
```

### ES6 模块化

`ES6`模块的设计思想是尽量的静态化，使得编译时就能确定模块的依赖关系，以及输入和输出的变量。`CommonJS`和`AMD`模块，都只能在运行时确定这些东西。比如，`CommonJS`模块就是对象，输入时必须查找对象属性

#### 基本语法

`export`命令用于规定模块的对外接口，`import`命令用于输入其他模块提供的功能

```js
/** 定义模块 math.js **/
const basicNum = 0;
const add = function(a, b) {
  return a + b;
};
export { basicNum, add };

/** 引用模块 **/
import { basicNum, add } from "./math";
function test(ele) {
  ele.textContent = add(99 + basicNum);
}
```

如上例所示，使用`import`命令的时候，用户需要知道所要加载的变量名或函数名，否则无法加载。为了给用户提供方便，让他们不用阅读文档就能加载模块，就要用到`export default`命令，为模块指定默认输出

```js
// 定义
export default function() {
  console.log("foo");
}

// 引入
import customName from "./export-default";
customName();
```

### 区别

- `CommonJS`规范主要用于服务端编程，加载模块是同步的，这并不适合在浏览器环境，因为同步意味着阻塞加载，浏览器资源是异步加载的，因此有了`AMD`、`CMD`解决方案
- `AMD`规范在浏览器环境中异步加载模块，而且可以并行加载多个模块。不过，`AMD`规范开发成本高，代码的阅读和书写比较困难，模块定义方式的语义不顺畅
- `CMD`规范与`AMD`规范很相似，都用于浏览器编程，依赖就近，延迟执行，可以很容易在`Node.js`中运行。不过，依赖`SPM`打包，模块的加载逻辑偏重
- `ES6`在语言标准的层面上，实现了模块功能，而且实现得相当简单，完全可以取代`CommonJS`和`AMD`规范，成为浏览器和服务器通用的模块解决方案
- `require,exports,module.exports`属于`CommonJS`规范，`import,export,export default`属于`ES6`规范
- `require`支持动态导入，动态匹配路径，`import`对这两者都不支持
- `require`是运行时调用，`import`是编译时调用
- `require`是赋值过程，`import`是解构过程
- 对于`export`和`export default`不同的使用方式，`import`就要采取不同的引用方式，主要区别在于是否存在`{}`，`export`导出的，`import`导入需要`{}`，导入和导出一一对应，`export default`默认导出的，`import`导入不需要`{}`
- `exports`是`module.exports`一种简写形式，不能直接给`exports`赋值
- `module.exports`与`exports`同时使用时，`exports`会失效

## Map 与 Object 的区别

`Map`是为了快速搜索和查找数据而生的。`Map`中的键和值可以是任何数据类型，不仅限于字符串或整数

- 键：`Object`遵循普通的字典规则，键必须是单一类型，并且只能是整数、字符串或是`Symbol`类型。但在`Map`中，`key`可以为任意数据类型（`Object`、`Array`等）
- 元素顺序：`Map`会保留所有元素的顺序，而`Object`并不会保证属性的顺序
- 继承：`Map`是`Object`的实例对象，而`Object`显然不可能是`Map`的实例对象

### 使用对比

- `JSON`直接支持`Object`，但尚未支持`Map`
- 针对于存在大量增删操作的场景，使用`Map`更合适
- `Map`会保留所有元素的顺序
- `Map`在存储大量数据的场景下表现更好，尤其是在`key`为未知状态

## Weak Set 与 Weak Map

### Weak Set

主要便于垃圾回收机制，防止内存泄漏

- 我们只能向`WeakSet`添加对象（而不能是原始值）
- `WeakSet`支持`add`，`has`和`delete`方法，但不支持`size`和`keys()`，并且不可迭代

### Weak Map

`Weak Map`是弱引用`Map`集合。主要便于垃圾回收机制

- `WeakMap`支持`get`，`set`，`has`和`delete`方法，但不支持`values()`和`keys()`，并且不可迭代
