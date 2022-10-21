# 排序

## 插入排序

将第一待排序序列第一个元素看做一个有序序列，把第二个元素到最后一个元素当成是未排序序列  
从头到尾依次扫描未排序序列，将扫描到的每个元素插入有序序列的适当位置（如果待插入的元素与有序序列中的某个元素相等，则将待插入元素插入到相等元素的后面）
![插入排序](/sort/1.gif "插入排序")

```js
function insertionSort(arr) {
  const len = arr.length;
  let preIndex, current;
  for (let i = 1; i < len; i++) {
    preIndex = i - 1;
    current = arr[i];
    while (preIndex >= 0 && arr[preIndex] > current) {
      arr[preIndex + 1] = arr[preIndex];
      preIndex--;
    }
    arr[preIndex + 1] = current;
  }
  return arr;
}
```

## 二分插入排序

我们发现要插入元素前面的数据是直接有序的存在，所以可以结合 2 分查找的方式将插入的手段改成 2 分插入的方式来做，这样我们的插入排序在做比较插入的逻辑就能从最悲观的比较次数简化到 2 分查找的虚拟树的深度
![二分插入排序](/sort/2.png "二分插入排序")

```js
function binaryInsertSort(arr) {
  // cur当前处理的数字，left、right二分查找第一个>=当前元素的位置的index，查找区间的左右index，中间index
  for (let i = 1; i < arr.length; i++) {
    let left = 0;
    let right = i - 1;
    const cur = arr[i];
    // 用二分查找找到第一个大于当前元素的索引
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (cur < arr[mid]) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    }
    // 插入元素
    arr.splice(left, 0, arr.splice(i, 1)[0]);
  }
  return arr;
}
```
