// 组件之间的事件通信，可以使用发布订阅模式
class PubSub {
  constructor() {
    // 订阅器
    this.subscribers = [];
  }

  // 订阅
  subscribe(event, callback) {
    this.subscribers.push({ event, callback });
  }

  // 发布
  publish(event, data) {
    this.subscribers.forEach((subscriber) => {
      if (subscriber.event === event) {
        subscriber.callback(data);
      }
    });
  }
}

const pubsub = new PubSub();
pubsub.subscribe('event1', (data) => {
  console.log(data);
});

pubsub.publish('event1', '发布事件1');

pubsub.subscribe('event2', (data) => {
  console.log(data);
});

pubsub.publish('event2', '发布事件2');