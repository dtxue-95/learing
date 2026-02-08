// 手写 Promise
// 1. 状态机
// 2. then 方法
// 3. catch 方法
// 4. finally 方法
// 5. resolve 方法
// 6. reject 方法
// 7. all 方法
// 8. race 方法
// 9. any 方法
// 10. allSettled 方法

// 1、状态定义
// 初始化状态
const PENDING = 'pending';
// 成功状态
const FULFILLED = 'fulfilled';
// 失败状态
const REJECTED = 'rejected';

// 2、JiuPromise 类声明， 有两种方式
// 1. 构造函数方式
function JiuPromise(executor) {
    // 初始化状态
    this["[[PromiseState]]"] = PENDING;
    // 初始化值
    this["[[PromiseResult]]"] = undefined;
    // 回调池
    // 执行成功回调池
    this["[[OnFulfilledCallbacks]]"] = [];
    // 执行失败回调池
    this["[[OnRejectedCallbacks]]"] = [];

    const resolve = (value) => {
        
        this["[[PromiseResult]]"] = value;
        // 状态变更
        this["[[PromiseState]]"] = FULFILLED;
        // 发布
        this["[[OnFulfilledCallbacks]]"].forEach((callback) => {
            callback(value);
        });
        console.log('resolve');
    }
    const reject = (reason) => {
        this["[[PromiseResult]]"] = reason;
        // 状态变更
        this["[[PromiseState]]"] = REJECTED;
        // 发布
        this["[[OnRejectedCallbacks]]"].forEach((callback) => {
            callback(reason);
        });
        console.log('reject');
    }
    executor(resolve, reject);
}

// then 方法
JiuPromise.prototype.then = function (onFulfilled, onRejected) {
    if (this["[[PromiseState]]"] === FULFILLED) {
        onFulfilled(this["[[PromiseResult]]"]);
    } else if (this["[[PromiseState]]"] === REJECTED) {
        onRejected(this["[[PromiseResult]]"]);
    } else {
        this["[[OnFulfilledCallbacks]]"].push(onFulfilled);
        this["[[OnRejectedCallbacks]]"].push(onRejected);
    }
}

const jiuPromise = new JiuPromise((resolve, reject) => {
    // resolve('成功');
    reject('失败');
});

jiuPromise.then((value) => {
    console.log("🚀 ~ value:", value)
    console.log(value);
}, (reason) => {
    console.log("🚀 ~ reason:", reason)
    console.log(reason);
});

console.log(jiuPromise);

// 2. 静态方法方式

// class JiuPromise {
//   constructor() {}
// }