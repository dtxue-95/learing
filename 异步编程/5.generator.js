// 生成器函数
function* generator() {
  yield 1;
  yield 2;
  yield 3;
}

// 调用生成器函数
const gen = generator();
console.log(gen.next()); // { value: 1, done: false }
console.log(gen.next()); // { value: 2, done: false }
console.log(gen.next()); // { value: 3, done: false }
console.log(gen.next()); // { value: undefined, done: true }

// zh-CN: 生成器函数可以暂停执行，每次调用 next 方法时，会返回一个对象，对象包含 value 和 done 两个属性。
// value 表示当前 yield 语句后面的表达式的值，done 表示是否还有更多的 yield 语句可以执行。
// 状态
// 挂起 suspended
// 结束 closed

// 自执行
// 由 while 循环实现自动执行
while (true) {
  const { value, done } = gen.next();
  if (done) {
    break;
  }
  console.log(value);
}

// 实现jiuAwait
// 有 then 方法实现自动执行
const jiuAwait = (gen) => {
    const { value, done } = gen.next();
    if (done) {
        return;
    }
    value.then((res) => {
        jiuAwait(gen);
    })
}

jiuAwait(gen);