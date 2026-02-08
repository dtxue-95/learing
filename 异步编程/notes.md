## 异步编程
### 1. 回调函数 callback
回调函数是一种将函数作为参数传递给另一个函数的技术。当某个事件发生时，该函数会被调用。

jsonP 也是一种回调函数的实现方式，它通过在URL中添加一个回调函数参数来实现跨域请求。
```js
// 客户端代码
const jsonp = (url, callback) => {
  const script = document.createElement('script');
  script.src = `${url}?callback=${callback}`;
  document.body.appendChild(script);
}

// 服务端代码
app.get('/jsonp', (req, res) => {
  const callback = req.query.callback;
  const data = { name: '张三', age: 18 };
  res.send(`${callback}(${JSON.stringify(data)})`);
});
```
当下使用的最多的是 cors 跨域请求，它通过在服务器端设置响应头来允许跨域请求。
```js
// 服务端代码
app.get('/cors', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.send('打印结果：cors 跨域请求');
});
```
分为简单请求和复杂请求。
简单请求：GET、POST、HEAD 请求，并且请求头中只包含简单的头部字段（如：Accept、Accept-Language、Content-Language、Content-Type 等）。
复杂请求：PUT、DELETE、CONNECT、OPTIONS、TRACE、PATCH 请求，或者请求头中包含非简单头部字段。 会先发送一个预检请求（OPTIONS 请求），服务器端需要返回允许的请求方法和请求头字段，客户端才会发送实际请求。


### 2. 事件监听
事件监听是一种通过注册事件处理函数来响应事件的技术。当事件发生时，注册的处理函数会被调用。
### 3. 发布/订阅
发布/订阅是一种通过发布者和订阅者之间的消息传递来实现解耦的技术。发布者发布消息，订阅者订阅消息并响应。
### 4. Promise
Promise是一种用于处理异步操作的对象。它表示一个异步操作的最终完成或失败，以及其结果值。
#### Promise A+ 规范
Promise A+ 规范是 Promise 规范的一种实现，它定义了 Promise 的行为和规则。
- 状态：Promise 有三种状态：pending（进行中）、fulfilled（已成功）、rejected（已失败）。
- 状态转换：Promise 只能从 pending 状态转换到 fulfilled 或 rejected 状态，且只能转换一次。
- 方法：Promise 有`then()`、`catch()`、`finally()`方法来处理异步操作的结果。
  - `then()`方法：用于处理异步操作成功的情况，它接收一个回调函数作为参数，该函数会在 Promise 状态变为 fulfilled 时被调用。
  - `catch()`方法：用于处理异步操作失败的情况，它接收一个回调函数作为参数，该函数会在 Promise 状态变为 rejected 时被调用。
  - `finally()`方法：用于在异步操作无论成功还是失败都要执行的情况，它接收一个回调函数作为参数，该函数会在 Promise 状态变为 fulfilled 或 rejected 时被调用。
  - `then()`、`catch()`、`finally()`方法都返回一个新的 Promise 对象，因此可以链式调用。
- 异常处理：如果 Promise 状态变为 rejected，并且没有注册对应的拒绝处理函数（reject handler），那么异常会被传播到最近的拒绝处理函数。
- 相关术语
  - Promise 实例：指的是一个 Promise 对象，它可以是 pending、fulfilled 或 rejected 状态。
  - Promise 链：指的是多个 Promise 实例通过`then()`方法链式调用的情况。
  - Promise 解决（resolve）：指的是将 Promise 状态从 pending 转换为 fulfilled 状态，并传递成功结果。
  - Promise 拒绝（reject）：指的是将 Promise 状态从 pending 转换为 rejected 状态，并传递失败结果。
### 5. Generator
Generator是一种特殊的函数，它可以暂停执行并在稍后恢复。它使用`yield`关键字来定义暂停点，并且可以通过`next()`方法来恢复执行。
### 6. Async/Await
Async/Await是一种基于Promise的语法糖，它使得异步代码看起来更像同步代码。它使用`async`关键字来定义异步函数，并且可以使用`await`关键字来等待Promise的解决。

## 手写 Promise

### 手写前准备
- 了解 Promise A+ 规范
- 理解 Promise 的状态和方法
- 掌握回调函数的使用
- 发布订阅模式
- 面向对象编程思想 class、构造函数、原型链
- 链式调用，返回值的处理