# JS

### 基本数据类型介绍，值类型和引用类型的理解

在`JS`中共有`7`种基本的数据类型，分别为：`Undefined`、`Null`、`Boolean`、`Number`、`String`、`Object`、`Symbol`。`Symbol`是 ES6 新增的数据类型  
基本数据类型保存在栈内存中，引用数据类型保存在堆内存中，然后在栈内存中保存了一个对堆内存中实际对象的引用，即数据在堆内存中的地址，`JS`对引用数据类型的操作都是操作对象的引用而不是实际的对象，如果`obj1`拷贝了`obj2`，那么这两个引用数据类型就指向了同一个堆内存对象，具体操作是`obj1`将栈内存的引用地址复制了一份给`obj2`，因而它们共同指向了一个堆内存对象

> 为什么基本数据类型保存在栈中，而引用数据类型保存在堆中
>
> - 堆比栈大，栈比堆速度快
> - 基本数据类型比较稳定，而且相对来说占用的内存小
> - 引用数据类型大小是动态的，而且是无限的，引用值的大小会改变，不能把它放在栈中，否则会降低变量查找的速度，因此放在变量栈空间的值是该对象存储在堆中的地址，地址的大小是固定的，所以把它存储在栈中对变量性能无任何负面影响
> - 堆内存是无序存储，可以根据引用直接获取  
>   `注`：按引用访问：JS 不允许直接访问保存在堆内存中的对象，所以在访问一个对象时，首先得到的是这个对象在堆内存中的地址，然后再按照这个地址去获得这个对象中的值

### 数据类型的判断

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

### 深拷贝和浅拷贝的定义

浅拷贝：
![浅拷贝](/js/1.png "浅拷贝")

> 创建一个新对象，这个对象有着原始对象属性值的一份精确拷贝。如果属性是基本类型，拷贝的就是基本类型的值，如果属性是引用类型，拷贝的就是内存地址，所以如果其中一个对象改变了这个地址，就会影响到另一个对象

深拷贝：
![深拷贝](/js/2.png "深拷贝")

> 将一个对象从内存中完整的拷贝一份出来，从堆内存中开辟一个新的区域存放新对象，且修改新对象不会影响原对象

### 手写深拷贝
