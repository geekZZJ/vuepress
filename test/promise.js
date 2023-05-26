class Promise1 {
  // 构造器
  constructor(executor) {
    // 初始化state为等待态
    this.state = 'pending'
    // 成功的值
    this.value = undefined
    // 失败的原因
    this.reason = undefined
    // 成功存放的数组
    this.onResolvedCallbacks = []
    // 失败存放法数组
    this.onRejectedCallbacks = []

    const resolve = (value) => {
      // state改变,resolve调用就会失败
      if (this.state === 'pending') {
        // resolve调用后，state转化为成功态
        this.state = 'fulfilled'
        // 储存成功的值
        this.value = value
        // 一旦resolve执行，调用成功数组的函数
        this.onResolvedCallbacks.forEach((fn) => fn())
      }
    }

    const reject = (reason) => {
      // state改变,reject调用就会失败
      if (this.state === 'pending') {
        // reject调用后，state转化为失败态
        this.state = 'rejected'
        // 储存失败的原因
        this.reason = reason
        // 一旦reject执行，调用失败数组的函数
        this.onRejectedCallbacks.forEach((fn) => fn())
      }
    }

    // 如果executor执行报错，直接执行reject
    try {
      executor(resolve, reject)
    } catch (err) {
      reject(err)
    }
  }

  #handle(callback, data, resolve, reject) {
    try {
      const result = callback(data)
      if (result instanceof Promise) {
        // 2. 如果回调函数返回的是promise，return的promise的结果就是这个promise的结果
        result.then(
          (value) => {
            resolve(value)
          },
          (reason) => {
            reject(reason)
          }
        )
      } else {
        // 1. 如果回调函数返回的不是promise，return的promise的状态是resolved，value就是返回的值。
        resolve(result)
      }
    } catch (error) {
      //  3.如果执行onResolved的时候抛出错误，则返回的promise的状态为rejected
      reject(error)
    }
  }

  // then 方法 有两个参数onFulfilled onRejected
  then(onFulfilled, onRejected) {
    onResolved =
      typeof onResolved === 'function' ? onResolved : (value) => value
    onRejected =
      typeof onRejected === 'function'
        ? onRejected
        : (reason) => {
            throw reason
          }

    return new Promise1((resolve, reject) => {
      // 状态为fulfilled，执行onFulfilled，传入成功的值
      if (this.state === 'fulfilled') {
        this.#handle(onFulfilled, this.value, resolve, reject)
      }
      // 状态为rejected，执行onRejected，传入失败的原因
      if (this.state === 'rejected') {
        this.#handle(onRejected, this.reason, resolve, reject)
      }
      // 当状态state为pending时
      if (this.state === 'pending') {
        // onFulfilled传入到成功数组
        this.onResolvedCallbacks.push(() => {
          this.#handle(onFulfilled, this.value, resolve, reject)
        })
        // onRejected传入到失败数组
        this.onRejectedCallbacks.push(() => {
          this.#handle(onRejected, this.reason, resolve, reject)
        })
      }
    })
  }

  catch(onRejected) {}
}

const promise = new Promise1((resolve, reject) => {
  // throw new Error(333)
  setTimeout(() => {
    resolve(1111)
    // reject(22222)
  }, 1000)
}).then((value) => {
  console.log('second', value)
})

promise.then(
  (value) => {
    // console.log('resolve', value)
    // return value
    return new Promise((resolve, reject) => {
      resolve(value)
    })
  },
  (err) => {
    console.log('reject', err)
  }
)
// .then((value) => {
//   console.log('res', value)
// })
