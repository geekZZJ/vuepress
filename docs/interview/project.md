# 项目设计

## 组件设计

- 从功能上拆分层次
- 尽量让组件原子化
- 容器组件（只管理数据）&UI 组件（只显示视图）

## 项目角色

- PM 产品经理
- UE 视觉设计师
- FE 前端开发
- RD 后端开发
- CRD 移动端开发
- QA 测试人员

## 完整项目流程

### 需求评审

- 了解背景
- 质疑需求是否合理
- 需求是否闭环
- 开发难度如何
- 是否需要其他支持
- 不要急于给排期

### 技术方案设计

- 求简，不过度设计
- 产出文档
- 找准设计重点
- 组内评审
- 和 RD CRD 沟通
- 发出会议结论

### 开发

如何保证项目质量

- 如何反馈排期
- 符合开发规范
- 写出开发文档
- 及时单元测试
- Mock API
- Code Review

### 联调+设计走查

- 和 RD CRD 技术联调
- 让 UE 确定视觉效果
- 让 PM 确定产品功能

### 测试

- 提测发邮件，抄送项目组
- 测试问题要详细记录
- 有问题及时沟通，QA 和 FE 天生信息不对称

### 上线

- 上线后及时通知 QA 回归测试
- 上线后及时同步 PM 和项目组
- 如有问题，及时回滚。先止损，再排查问题

## PM 想在项目开发过程中增加需求，该怎么办

- 不能拒绝，走需求变更流程
- 如果公司有规定，则按规定走
- 否则发起项目组和 leader 的评审，重新评估排期

## 观察者模式与发布订阅

### 组成区别

观察者模式本身只需要`2个`角色便可成型，即观察者和被观察者，其中被观察者是重点。而发布订阅需要至少`3个`角色来组成，包括发布者、订阅者和发布订阅中心，其中发布订阅中心是重点。

### 各自实现

#### 观察者模式实现

观察者模式一般至少有一个可被观察的对象`Subject`，可以有多个观察者去观察这个对象。二者的关系是通过被观察者主动建立的，被观察者至少要有三个方法--添加观察者、移除观察者、通知观察者

当被观察者将某个观察者添加到自己的观察者列表后，观察者与被观察者的关联就建立起来了。此后只要被观察者在某种时机触发通知观察者方法时，观察者即可接收到来自被观察者的消息
![观察者模式](/project/1.png "观察者模式")

- 被观察者对象

```js
class Subject {
  constructor() {
    this.observerList = [];
  }

  addObserver(observer) {
    this.observerList.push(observer);
  }

  removeObserver(observer) {
    const index = this.observerList.findIndex((o) => o.name === observer.name);
    this.observerList.splice(index, 1);
  }

  notifyObservers(message) {
    const observers = this.observeList;
    observers.forEach((observer) => observer.notified(message));
  }
}
```

- 观察者

```js
class Observer {
  constructor(name, subject) {
    this.name = name;
    if (subject) {
      subject.addObserver(this);
    }
  }

  notified(message) {
    console.log(this.name, "got message", message);
  }
}
```

- 使用

```js
const subject = new Subject();
const observerA = new Observer("observerA", subject);
const observerB = new Observer("observerB");
subject.addObserver(observerB);
subject.notifyObservers("Hello from subject");
subject.removeObserver(observerA);
subject.notifyObservers("Hello again");
```

- 解析

上面的代码分别实现了观察者和被观察者的逻辑，其中二者的关联有两种方式：

1. 观察者主动申请加入被观察者的列表
2. 被观察者主动将观察者加入列表

前者会在观察者对象创建之初显式声明要被加入到被观察者的通知列表内，后者则是在观察者创建实例后由被观察者主动将其添加进列表

#### 发布订阅

与`观察者模式`相比，发布订阅核心基于一个中心来建立整个体系。其中`发布者`和`订阅者`不直接进行通信，而是发布者将要发布的消息交由中心管理，订阅者也是根据自己的情况，按需订阅中心中的消息
![发布订阅](/project/2.png "发布订阅")

让我们来想象一下邮件系统，你可以作为订阅者订阅某个网站的通知，邮件系统在其中充当发布订阅中心的角色，而发布者则是你订阅的网站

整个链路是从你的订阅开始，虽然在你订阅之前，别人可能已经订阅过某些网站并不断接收来自网站更新所发出的消息。你的订阅动作是在某个你想订阅的网站填入自己的邮箱，如果这一步以邮件系统为中心，那么则是在的邮箱内记录这个网站信息，后续当网站有内容更新时，邮件系统会及时接收到并向你发送邮件，以达到通知你这个订阅者的目的

- 降级为观察者模式

这里说的是以邮件系统为中心，假如以网站为中心，那么你对于网站就相当于一个观察者，你希望观察网站的一举一动，即网站内容的更新。那么订阅动作本身便成了你让网站将你的邮箱加入网站维护的观察者列表。这样当网站有内容更新后，便会通知所有观察者，也就是订阅者，这时发布订阅模型则退化成了观察者模式

- 升级为发布订阅

可以看出，此时网站和用户间其实是有`耦合`的，也就是网站除了要维护自身功能外，还需要维护订阅者列表，并且在内容更新后完成通知工作。这样在用户和网站之间有一部分关系是维护在网站内部的。如果网站想把这部分任务抽离出来，自然便恢复至发布订阅模型，即建立单独的`消息中心`来管理发布者和订阅者之间的关系以及接收变化和通知消息的工作

#### 发布订阅实现

- 发布订阅中心

```js
class PubSub {
  constructor() {
    this.messages = {};
    this.listeners = {};
  }

  publish(type, content) {
    const existContent = this.messages[type];
    if (!existContent) {
      this.messages[type] = [];
    }
    this.messages[type].push(content);
  }

  subscribe(type, cb) {
    const existListener = this.listeners[type];
    if (!existListener) {
      this.listeners[type] = [];
    }
    this.listeners[type].push(cb);
  }

  notify(type) {
    const messages = this.messages[type];
    const subscribers = this.listeners[type] || [];
    subscribers.forEach((cb, index) => cb(messages[index]));
  }
}
```

- 发布者

```js
class Publisher {
  constructor(name, context) {
    this.name = name;
    this.context = context;
  }

  publish(type, content) {
    this.context.publish(type, content);
  }
}
```

- 订阅者

```js
class Subscriber {
  constructor(name, context) {
    this.name = name;
    this.context = context;
  }

  subscribe(type, cb) {
    this.context.subscribe(type, cb);
  }
}
```

- 使用

```js
const TYPE_A = "music";
const TYPE_B = "movie";
const TYPE_C = "novel";

const pubsub = new PubSub();

const publisherA = new Publisher("publisherA", pubsub);
publisherA.publish(TYPE_A, "we are young");
publisherA.publish(TYPE_B, "the silicon valley");
const publisherB = new Publisher("publisherB", pubsub);
publisherB.publish(TYPE_A, "stronger");
const publisherC = new Publisher("publisherC", pubsub);
publisherC.publish(TYPE_C, "a brief history of time");

const subscriberA = new Subscriber("subscriberA", pubsub);
subscriberA.subscribe(TYPE_A, (res) => {
  console.log("subscriberA received", res);
});
const subscriberB = new Subscriber("subscriberB", pubsub);
subscriberB.subscribe(TYPE_C, (res) => {
  console.log("subscriberB received", res);
});
const subscriberC = new Subscriber("subscriberC", pubsub);
subscriberC.subscribe(TYPE_B, (res) => {
  console.log("subscriberC received", res);
});

pubsub.notify(TYPE_A); // subscriberA received we are young
pubsub.notify(TYPE_B); // subscriberC received the silicon valley
pubsub.notify(TYPE_C); // subscriberB received a brief history of time
```

- 解析

以上`发布订阅中心`、`发布者`和`订阅者`三者有各自的实现，其中`发布者`和`订阅者`实现比较简单，只需完成各自`发布`、`订阅`的任务即可。其中`订阅者`可以在接收到消息后做后续处理。重点在于二者需要确保在与同一个`发布订阅中心`进行关联，否则两者之间的通信无从关联。

发布者的发布动作和订阅者的订阅动作相互独立，无需关注对方，消息派发由发布订阅中心负责。
