# JavaScript 异步编程与 Promise 深度解析
## 1. 学习目标
### 初中级
1. 理解异步编程处理方案：从 callback 到 promise 到 async，不同时期如何处理异步任务
2. 了解 Promise A+ 规范：了解 Promise A+ 规范，能清晰表述出 Promise A+ 规范细节
3. 能实现简单版 Promise：掌握发布订阅模式，掌握 Promise 执行机制，能手写简单版本 Promise

### 高级
1. 深入理解异步处理方案：深入理解 Promise 原理，理解 async 实现细节，了解 generator 生成器相关特性
2. 手写实现完整 Promise：从零到一完全实现 Promise，并能够通过 Promise A+ 规范测试

## 2. 相关面试真题
### 请手写 Promise
（完整实现见下文 7.7 完整代码）

### 如何解决 Promise 地狱问题？
所谓的 "Promise 地狱"，通常指的是代码中存在多层嵌套的 Promise 调用，这种情况会使代码难以理解和维护。解决 Promise 地狱的常见方法包括：
- 链式调用：利用 Promise 的 `.then()` 方法可以返回另一个 Promise，你可以通过链式调用的方式来避免深层的嵌套
- 异步函数（async/await）：使用 ES2017 引入的 async 和 await 语法可以使异步代码看起来像同步代码，这样可以极大地提高代码的可读性和可维护性。使用 async 标记的函数总是返回一个 Promise，而 await 关键字可以暂停 async 函数的执行，等待 Promise 解决

### Promise.all 和 Promise.race 的区别是什么？
- Promise.all：这个方法接受一个 Promise 对象的数组作为输入，只有当所有的 Promise 对象都变为 fulfilled 状态时，返回的 Promise 才会变为 fulfilled，并将一个数组作为结果传递给处理函数，数组中包含了所有输入 Promise 的结果。如果任何一个输入 Promise 变为 rejected，返回的 Promise 就会立即变为 rejected 状态，且失败的原因会是第一个失败 Promise 的结果
- Promise.race：这个方法同样接受一个 Promise 对象的数组，但是返回的 Promise 的状态会由第一个改变状态的输入 Promise 决定。也就是说，如果输入数组中的任何一个 Promise 先达到 fulfilled 或 rejected 状态，返回的 Promise 就会立即变为相同的状态，并以那个 Promise 的结果作为返回值

### 实现异步调度器 Scheduler
实现一个带并发限制的异步调度器 Scheduler，保证同时运行的任务最多有N个。

```javascript
class Scheduler {
  constructor(max) {
    this.max = max;
    this.count = 0; // 用来记录当前正在执行的异步函数
    this.queue = new Array(); // 表示等待队列
  }
  
  async add(promiseCreator) {
    // 此时count已经满了，不能执行本次add需要阻塞在这里，将resolve放入队列中等待唤醒
    // 等到count<max时，从队列中取出执行resolve,执行，await执行完毕，本次add继续
    if (this.count >= this.max) {
      await new Promise((resolve, reject) => this.queue.push(resolve));
    }

    this.count++;
    let res = await promiseCreator();
    this.count--;
    
    if (this.queue.length) {
      // 依次唤醒add
      // 若队列中有值，将其resolve弹出，并执行
      // 以便阻塞的任务，可以正常执行
      this.queue.shift()();
    }
    
    return res;
  }
}

const timeout = time =>
  new Promise(resolve => {
    setTimeout(resolve, time);
  });

const scheduler = new Scheduler(2);

const addTask = (time, order) => {
  // add返回一个promise，参数也是一个promise
  scheduler.add(() => timeout(time)).then(() => console.log(order));
};
  
addTask(1000, '1');
addTask(500, '2');
addTask(300, '3');
addTask(400, '4');

// output: 2 3 1 4
```

**流程分析**：
1. 起始1、2两个任务开始执行；
2. 500ms时，2任务执行完毕，输出2，任务3开始执行；
3. 800ms时，3任务执行完毕，输出3，任务4开始执行；
4. 1000ms时，1任务执行完毕，输出1，此时只剩下4任务在执行；
5. 1200ms时，4任务执行完毕，输出4；

## 3. 异步处理发展史
JavaScript 的异步编程模型经历了从回调函数到 Promise，再到 async/await 的发展过程，每一步都旨在使异步代码更加清晰和易于管理。

### 3.1 回调函数（Callback）
回调函数是最初用来处理异步操作的方式。但当异步操作需要连续进行时，就容易出现"回调地狱"，导致代码难以阅读和维护。

```javascript
function getData(query, callback) {
    setTimeout(() => {
        const result = '数据结果';
        callback(result);
    }, 1000);
}

getData('query', function(result) {
    console.log(result);
    // 假设还有另一个基于这个结果的异步操作
    getData('anotherQuery', function(result) {
        console.log(result);
        // 可能还有更多层的嵌套...
    });
});
```

### 3.2 Promise
为了解决回调地狱的问题，Promise 被引入为一种更好的异步处理方式。Promise 提供了更好的错误处理机制，并支持链式调用。

```javascript
function getData(query) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const result = '数据结果';
            resolve(result);
        }, 1000);
    });
}

getData('query')
    .then(result => {
        console.log(result);
        return getData('anotherQuery');
    })
    .then(result => {
        console.log(result);
    })
    .catch(error => {
        console.error('发生错误：', error);
    });
```

### 3.3 Async/Await
Async/await 是建立在 Promise 之上的，它使异步代码的编写和阅读更接近传统的同步代码。

```javascript
async function asyncFunction() {
    try {
        const result = await getData('query');
        console.log(result);
        const anotherResult = await getData('anotherQuery');
        console.log(anotherResult);
    } catch (error) {
        console.error('发生错误：', error);
    }
}

asyncFunction();
```

## 4. Promise A+ 规范
Promise A+ 规范详细描述了 JavaScript 中 Promise 的行为标准，确保不同的 Promise 实现可以相互兼容。

### 4.1 术语
- promise：一个对象或函数，其具有 then 方法，其行为符合本规范。
- thenable：一个具有 then 方法的对象或函数。
- value：任何合法的 JavaScript 值（包括 undefined，一个 thenable，或一个 promise）。
- exception：一个使用 throw 语句抛出的值。
- reason：一个表示 promise 被拒绝的原因。

### 4.2 要求
#### Promise 状态
一个 promise 必须处于以下三种状态之一：pending（等待态），fulfilled（执行态），或 rejected（拒绝态）。
- pending: 可以迁移到 fulfilled 或 rejected 状态。
- fulfilled: 不可迁移到其他状态，必须有一个 value。
- rejected: 不可迁移到其他状态，必须有一个 reason。

#### then 方法
一个 promise 必须提供一个 then 方法来访问其当前或最终的 value 或 reason。

```
promise.then(onFulfilled, onRejected)
```

- onFulfilled 和 onRejected 都是可选参数。
- 如果 onFulfilled 不是函数，必须忽略它。
- 如果 onRejected 不是函数，必须忽略它。

#### onFulfilled 的执行
- onFulfilled 必须在 promise 完成后被调用，且 promise 的 value 作为其第一个参数。
- onFulfilled 不得在 promise 完成前被调用。
- onFulfilled 必须只被调用一次。

#### onRejected 的执行
- onRejected 必须在 promise 被拒绝后被调用，且 promise 的 reason 作为其第一个参数。
- onRejected 不得在 promise 被拒绝前被调用。
- onRejected 必须只被调用一次。

#### then 方法必须返回一个 promise
```
promise2 = promise1.then(onFulfilled, onRejected);
```
- promise2 必须是一个新的 promise。

#### 处理返回的值
- 如果 onFulfilled 或 onRejected 返回一个值 x，则运行 Promise 解决程序 [[Resolve]](promise2, x)。
- 如果 onFulfilled 或 onRejected 抛出一个异常 e，则 promise2 必须以 e 作为拒绝原因。
- 如果 onFulfilled 不是一个函数且 promise1 完成，promise2 必须以 promise1 的 value 作为其 value。
- 如果 onRejected 不是一个函数且 promise1 被拒绝，promise2 必须以 promise1 的 reason 作为其 reason。

#### Promise 解决程序 [[Resolve]]
```
[[Resolve]](promise, x)
```
- 如果 promise 和 x 指向同一对象，则以 TypeError 作为拒绝原因。
- 如果 x 是一个 promise，采用 x 的状态。
- 如果 x 是一个对象或函数：
  - 取出 x.then。
  - 如果取 then 时抛出异常，以该异常作为拒绝原因。
  - 如果 then 是一个函数，将 x 作为 this 调用 then，第一个参数是 resolvePromise，第二个参数是 rejectPromise。
  - 如果 then 不是一个函数，以 x 为值完成 promise。
- 如果 x 不是对象或函数，以 x 为值完成 promise。

## 5. Promise 手写实现
### 5.1 核心实现要点
Promise 的实现，离不开以下几个关键思路：
1. 面向对象编程
2. 发布订阅模式
3. 链式调用

### 5.2 完整代码
```javascript
const PENDING_STATE = "pending";
const FULFILLED_STATE = "fulfilled";
const REJECTED_STATE = "rejected";

const isFunction = function (fun) {
  return typeof fun === "function";
};

const isObject = function (value) {
  return value && typeof value === "object";
};

function Promise(fun) {
  // 1. 基本的判断
  // 1.1 判断是否是通过new调用
  if (!this || this.constructor !== Promise) {
    throw new TypeError("Promise must be called with new");
  }
  // 1.2 判断参数fun是否是一个函数
  if (!isFunction(fun)) {
    throw new TypeError("Promise constructor's argument must be a function");
  }

  // 2. 定义基本属性
  this.state = PENDING_STATE; // promise实例的状态
  this.value = void 0; // promise的决议值

  // Promises/A+：2.2.6 一个promise实例，可能会调用多次then函数，所以需要一个数组保存then中注册的回调并记录其调用顺序
  this.onFulfilledCallbacks = []; // 保存完成回调
  this.onRejectedCallbacks = []; // 保存拒绝回调

  // 3. 定义resolve方法
  const resolve = (value) => {
    resolutionProcedure(this, value);
  };

  // 主要执行Promise的决议逻辑
  const resolutionProcedure = function (promise, x) {
    // 3.1 判断x是否是promise自身
    // Promises/A+：2.3.1 如果promise和x引用相同的对象，则抛出一个TypeError为原因拒绝promise。
    if (x === promise) {
      return reject(new TypeError("Promise can not resolved with it seft"));
    }

    // 3.2 判断x是否是promise
    // Promises/A+：2.3.2 如果x是一个promise，则直接采用它的决议值进行决议
    if (x instanceof Promise) {
      return x.then(resolve, reject);
    }

    // 3.3 判断是否是thenable
    // Promises/A+：2.3.3 如果x是一个对象或函数：
    if (isObject(x) || isFunction(x)) {
      let called = false;
      try {
        // 检索x.then属性
        let then = x.then;
        if (isFunction(then)) {
          // 调用then方法
          then.call(
            x,
            (y) => {
              if (called) {
                return;
              }
              called = true;
              resolutionProcedure(promise, y);
            },
            (error) => {
              if (called) {
                return;
              }
              called = true;
              reject(error);
            }
          );
          return;
        }
      } catch (error) {
        if (called) {
          return;
        }
        called = true;
        reject(error);
      }
    }

    // 3.4 x为其他js基础值，且未决议，则直接决议
    if (promise.state === PENDING_STATE) {
      promise.state = FULFILLED_STATE;
      promise.value = x;
      promise.onFulfilledCallbacks.forEach((callback) => callback());
    }
  };

  // 4. 定义reject方法
  const reject = (reason) => {
    if (this.state === PENDING_STATE) {
      this.state = REJECTED_STATE;
      this.value = reason;
      this.onRejectedCallbacks.forEach((callback) => callback());
    }
  };

  // 5. 执行fun函数
  try {
    fun(resolve, reject);
  } catch (error) {
    reject(error);
  }
}

Promise.prototype.then = function (onFulfilled, onRejected) {
  // 1. 处理onFulfilled或者onRejected不是函数的情况
  onFulfilled = isFunction(onFulfilled) ? onFulfilled : (value) => value;
  onRejected = isFunction(onRejected)
    ? onRejected
    : (error) => {
        throw error;
      };

  // 2. 返回一个新的promise实例
  let promise2 = new Promise((resolve, reject) => {
    // 2.1 包装onFulfilled和onRejected为异步函数
    let wrapOnFulfilled = () => {
      setTimeout(() => {
        try {
          let x = onFulfilled(this.value);
          resolve(x);
        } catch (error) {
          reject(error);
        }
      }, 0);
    };
    
    let wrapOnRejected = () => {
      setTimeout(() => {
        try {
          let x = onRejected(this.value);
          resolve(x);
        } catch (error) {
          reject(error);
        }
      }, 0);
    };

    // 2.2 判断状态
    if (this.state === FULFILLED_STATE) {
      wrapOnFulfilled();
    } else if (this.state === REJECTED_STATE) {
      wrapOnRejected();
    } else {
      this.onFulfilledCallbacks.push(wrapOnFulfilled);
      this.onRejectedCallbacks.push(wrapOnRejected);
    }
  });
  
  return promise2;
};

Promise.prototype.catch = function (callback) {
  return this.then(null, callback);
};

// Promise.prototype.finally 
Promise.prototype.finally = function (callback) {
  return this.then(
    (data) => {
      callback();
      return data;
    },
    (error) => {
      callback();
      throw error;
    }
  );
};

// Promise.resolve
Promise.resolve = function (value) {
  return value instanceof Promise
    ? value
    : new Promise((resolve) => resolve(value));
};

// Promise.reject
Promise.reject = function (reason) {
  return new Promise((resolve, reject) => reject(reason));
};

// Promise.race
Promise.race = function (promises) {
  return new Promise((resolve, reject) => {
    promises.forEach((promise) => {
      Promise.resolve(promise).then(resolve, reject);
    });
  });
};

// Promise.all
Promise.all = function (promises) {
  return new Promise((resolve, reject) => {
    if (!promises.length) {
      resolve([]);
    }

    let result = [];
    let resolvedPro = 0;
    for (let index = 0, length = promises.length; index < length; index++) {
      Promise.resolve(promises[index]).then(
        (data) => {
          result[index] = data;
          if (++resolvedPro === length) {
            resolve(result);
          }
        },
        (error) => {
          reject(error);
        }
      );
    }
  });
};

// Promise.allSettled
Promise.allSettled = function (promises) {
  return new Promise((resolve, reject) => {
    if (!promises.length) {
      resolve([]);
    }

    let result = [];
    let resolvedPro = 0;
    for (let index = 0, length = promises.length; index < length; index++) {
      Promise.resolve(promises[index])
        .then((data) => {
          result[index] = {
            status: FULFILLED_STATE,
            value: data,
          };
          if (++resolvedPro === length) {
            resolve(result);
          }
        })
        .catch((error) => {
          result[index] = {
            status: REJECTED_STATE,
            reason: error,
          };
          if (++resolvedPro === length) {
            resolve(result);
          }
        });
    }
  });
};

module.exports = Promise;
```

### 5.3 使用 promises-aplus-tests 测试
#### package.json
```json
{
  "name": "jiuyu-promise-test",
  "version": "1.0.0",
  "description": "A Promise polyfill with Promises/A+",
  "main": "index.js",
  "scripts": {
    "test": "promises-aplus-tests ./src/test.js"
  },
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "promises-aplus-tests": "^2.1.2"
  }
}
```

#### src/test.js
```javascript
const Promise = require("./promise");

Promise.deferred = function () {
  var result = {};
  result.promise = new Promise(function (resolve, reject) {
    result.resolve = resolve;
    result.reject = reject;
  });

  return result;
};

module.exports = Promise;
```

## 6. async/await
### 6.1 介绍
async/await的用处：用同步方式，执行异步操作

```javascript
function request(num) { // 模拟接口请求
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(num * 2)
    }, 1000)
  })
}

// 传统Promise方式
request(5).then(res1 => {
  console.log(res1) // 1秒后 输出 10
  request(res1).then(res2 => {
    console.log(res2) // 2秒后 输出 20
  })
})

// async/await方式
async function fn () {
  const res1 = await request(5)
  const res2 = await request(res1)
  console.log(res2) // 2秒后输出 20
}
fn()
```

### 6.2 规则
1. await 只能在async 函数中使用，不然会报错；
2. async 函数返回的是一个 Promise 对象，有无值看有无 return 值；
3. await 后面最好是接 Promise，虽然接其他值也能达到排队效果；
4. async/await 作用是用同步方式，执行异步操作

### 6.3 实现原理
async/await 是一种语法糖，用到的是 ES6 里的迭代函数——generator函数

#### 6.3.1 generator 基础
generator函数跟普通函数在写法上的区别就是，多了一个星号*，并且只有在generator函数中才能使用yield，而yield相当于generator函数执行的中途暂停点。

```javascript
function* gen() {
  yield 1
  yield 2
  yield 3
  return 4
}
const g = gen()
console.log(g.next()) // { value: 1, done: false }
console.log(g.next()) // { value: 2, done: false }
console.log(g.next()) // { value: 3, done: false }
console.log(g.next()) // { value: 4, done: true }
```

#### 6.3.2 yield 后接 Promise
```javascript
function fn(num) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(num)
    }, 1000)
  })
}
function* gen() {
  yield fn(1)
  yield fn(2)
  return 3
}
const g = gen()
console.log(g.next()) // { value: Promise { <pending> }, done: false }
console.log(g.next()) // { value: Promise { <pending> }, done: false }
console.log(g.next()) // { value: 3, done: true }
```

#### 6.3.3 next 函数传参
```javascript
function* gen() {
  const num1 = yield 1
  console.log(num1)
  const num2 = yield 2
  console.log(num2)
  return 3
}
const g = gen()
console.log(g.next()) // { value: 1, done: false }
console.log(g.next(11111))
// 11111
// { value: 2, done: false }
console.log(g.next(22222)) 
// 22222
// { value: 3, done: true }
```

#### 6.3.4 实现 async/await
```javascript
function fn(nums) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(nums * 2)
    }, 1000)
  })
}

function* gen() {
  const num1 = yield fn(1)
  const num2 = yield fn(num1)
  const num3 = yield fn(num2)
  return num3
}

function generatorToAsync(generatorFn) {
  return function() {
    const gen = generatorFn.apply(this, arguments)

    // 返回一个Promise
    return new Promise((resolve, reject) => {

      function go(key, arg) {
        let res
        try {
          res = gen[key](arg)
        } catch (error) {
          return reject(error)
        }

        // 解构获得value和done
        const { value, done } = res
        if (done) {
          // 如果done为true，说明走完了，进行resolve(value)
          return resolve(value)
        } else {
          // 如果done为false，说明没走完，还得继续走
          return Promise.resolve(value).then(val => go('next', val), err => go('throw', err))
        }
      }

      go("next") // 第一次执行
    })
  }
}

// 使用示例
const asyncFn = generatorToAsync(gen)
asyncFn().then(res => console.log(res)) // 3秒后输出 8
```

### 总结
1. JavaScript 异步编程经历了从回调函数到 Promise 再到 async/await 的发展，核心目标是解决回调地狱，提升代码可读性和可维护性。
2. Promise A+ 规范定义了 Promise 的核心行为，包括三种状态、then 方法的链式调用规则和值的解析逻辑。
3. 手写 Promise 需要实现状态管理、发布订阅模式、then 方法的链式调用，以及 Promise.resolve/reject/all/race 等静态方法。
4. async/await 是 Generator 函数的语法糖，通过自动执行 Generator 函数并处理 Promise 结果，实现了同步风格的异步编程。

## 7. 补充资料
- Chromium V8 Promise 源码：https://chromium.googlesource.com/v8/v8/+/refs/tags/12.6.236/src/builtins/promise-jobs.tq
- Promise A+ 规范：https://promisesaplus.com/
- Promise A+ 测试：https://github.com/promises-aplus/promises-tests
- 老版 Promise 实现：https://github.com/tj/co
- async 实现：https://dev.to/gsarciotto/implementing-async-await-55f
- Redux-saga 使用 generator: https://github.com/redux-saga/redux-saga/blob/9a6210bf891d3d74d4bab8d0f55c171e3c68355e/examples/async/src/sagas/index.js#L12