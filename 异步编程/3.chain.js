// 链式调用

function Person(name, age) {
  this.name = name;
  this.age = age;
}

// this 绑定方式
// 1. 隐式绑定 调用位置是否有上下文对象，或者是否被某个对象拥有或者包含
// 2. 显式绑定 call、apply、bind 方法
// 3. new 绑定 使用 new 关键字调用构造函数
// 4. 默认绑定 独立函数调用，this 指向全局对象（浏览器中是 window 对象）


// 上学
const goToSchool = function () {
  console.log(`${this.name} 上学了`);
  return this;
}

// 学习
const learn = function () { 
  console.log(`${this.name} 学习了`);
  return this;
}

// 考试
const exam = function () {
  console.log(`${this.name} 考试了`);
  return this;
}

Person.prototype = {
    goToSchool,
    learn,
    exam,
}


// 链式调用
const person = new Person('张三', 18);
person.goToSchool().learn().exam();
