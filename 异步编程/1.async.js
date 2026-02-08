// 1. 回调函数
const fetchDataByCallback = (callback) => {
  setTimeout(() => {
    callback('打印结果：1. 回调函数');
  }, 1000);
}

// 回调地狱
const callbackHell = () => {
  fetchDataByCallback((data) => {
    console.log(data);
    fetchDataByCallback((data) => {
      console.log(data);
      fetchDataByCallback((data) => {
        console.log(data);
      });
    });
  });
}

// 2. promise
const fetchDataByPromise = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('打印结果：2. promise');
    }, 1000);
  });
}

// 地狱promise
const promiseHell = () => {
  fetchDataByPromise()
    .then((data) => {
      console.log(data);
      return fetchDataByPromise();
    })
    .then((data) => {
      console.log(data);
      return fetchDataByPromise();
    })
    .then((data) => {
      console.log(data);
    });
}

// 3. async/await
const fetchDataByAsyncAwait = async () => {
    return await fetchDataByPromise();
 
}

// 不存在回调地狱
(async () => {
  await fetchDataByAsyncAwait();
  console.log('打印结果：3. async/await');
  await fetchDataByAsyncAwait();
  console.log('打印结果：3. async/await');
})();