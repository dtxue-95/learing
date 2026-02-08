// const JiuPromise = require('./4.jiuyu-promise.js');
const JiuPromise = require('./full-jiuyu-promise.js');

JiuPromise.deferred = function () {
  let dfd = {};
  dfd.promise = new JiuPromise((resolve, reject) => {
    dfd.resolve = resolve;
    dfd.reject = reject;
  });
  return dfd;
}

module.exports = JiuPromise;