## 如何防止重复发送ajax请求

### 背景

先来说说重复发送ajax请求带来的问题

* 场景一：用户快速点击按钮，多次相同的请求打到服务器，给服务器造成压力。如果碰到提交表单操作，而且恰好后端没有做兼容处理，那么可能会造成数据库中插入两条及以上的相同数据

* 场景二：用户频繁切换下拉筛选条件，第一次筛选数据量较多，花费的时间较长，第二次筛选数据量较少，请求后发先至，内容先显示在界面上。但是等到第一次的数据回来之后，就会覆盖掉第二次的显示的数据。筛选结果和查询条件不一致，用户体验很不好

### 常用解决方案

为了解决上述问题，通常会采用以下几种解决方案

#### 状态变量

发送ajax请求前，btnDisable置为true，禁止按钮点击，等到ajax请求结束解除限制，这是我们最常用的一种方案

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9UODFiQVYwTk5OOHUzVU13aWJ6bk1zTk9oR3dMUnVvM3ZIV2liQUxpY1czSGVpYllmVE0yUjFJSVRtTGpyak9ESzFvaWFRUDVicE5ZbTBJdUVGc3g5OVJhN2ljdy82NDA?x-oss-process=image/format,png)

但该方案也存在以下弊端：

* 与业务代码耦合度高
* 无法解决上述场景二存在的问题

#### 函数节流和函数防抖

固定的一段时间内，只允许执行一次函数，如果有重复的函数调用，可以选择使用函数节流忽略后面的函数调用，以此来解决场景一存在的问题

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9UODFiQVYwTk5OOHUzVU13aWJ6bk1zTk9oR3dMUnVvM3Z4SjQ3MGlhQkZ3M1dEbUFuYWNONm9jMkxSaWJ5aWNscURaa3luTFh3RUljNnB2amZTT1RZOVlCYXcvNjQw?x-oss-process=image/format,png)

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9UODFiQVYwTk5OOHUzVU13aWJ6bk1zTk9oR3dMUnVvM3Z1UTRFUGV2WWczQ3ZpY3dKekJQTVZ0bVI4UGdrVnc1ZEE2bm85cktNeWJhaWFZUU5qOFRXcVR3dy82NDA?x-oss-process=image/format,png)

也可以选择使用函数防抖忽略前面的函数调用，以此来解决场景二存在的问题

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9UODFiQVYwTk5OOHUzVU13aWJ6bk1zTk9oR3dMUnVvM3ZGSXhxMk91WGFKZGVXTHpEUXhSaWFVRlNFallITWRHTVJCdU1HajJJUGVNZ3lYUkh5OW5BNVdBLzY0MA?x-oss-process=image/format,png)

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9UODFiQVYwTk5OOHUzVU13aWJ6bk1zTk9oR3dMUnVvM3ZzbFhEVFJLWVlSc2JRZTJnWmx6RWdXcnhOdDN6SmJNc1NuVmNPaWNFWmNweEtmZUZPTmd0Qkp3LzY0MA?x-oss-process=image/format,png)

该方案能覆盖场景一和场景二，不过也存在一个大问题：

* wait time是一个固定时间，而ajax请求的响应时间不固定，wait time设置小于ajax响应时间，两个ajax请求依旧会存在重叠部分，wait time设置大于ajax响应时间，影响用户体验。总之就是wait time的时间设定是个难题

#### 请求拦截和请求取消

作为一个成熟的ajax应用，它应该能自己在pending过程中选择请求拦截和请求取消

* 请求拦截

  用一个数组存储目前处于pending状态的请求。发送请求前先判断这个api请求之前是否已经有还在pending的同类，即是否存在上述数组中，如果存在，则不发送请求，不存在就正常发送并且将该api添加到数组中。等请求完结后删除数组中的这个api。

* 请求取消
  
  用一个数组存储目前处于pending状态的请求。发送请求时判断这个api请求之前是否已经有还在pending的同类，即是否存在上述数组中，如果存在，则找到数组中pending状态的请求并取消，不存在就将该api添加到数组中。然后发送请求，等请求完结后删除数组中的这个api

#### 实现
接下来介绍一下本文的主角 axios 的 cancel token(查看详情)。通过axios 的 cancel token，我们可以轻松做到请求拦截和请求取消

```js
const CancelToken = axios.CancelToken;
const source = CancelToken.source();
 
 
axios.get('/user/12345', {
  cancelToken: source.token
}).catch(function (thrown) {
  if (axios.isCancel(thrown)) {
    console.log('Request canceled', thrown.message);
  } else {
    // handle error
  }
});
 
 
axios.post('/user/12345', {
  name: 'new name'
}, {
  cancelToken: source.token
})
 
 
// cancel the request (the message parameter is optional)
source.cancel('Operation canceled by the user.');
```
官网示例中，先定义了一个 const CancelToken = axios.CancelToken，定义可以在axios源码axios/lib/axios.js目录下找到

```js
// Expose Cancel & CancelToken
axios.Cancel = require('./cancel/Cancel');
axios.CancelToken = require('./cancel/CancelToken');
axios.isCancel = require('./cancel/isCancel');
```

示例中调用了axios.CancelToken的source方法，所以接下来我们再去axios/lib/cancel/CancelToken.js目录下看看source方法

```js
/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};
```
source方法返回一个具有token和cancel属性的对象，这两个属性都和CancelToken构造函数有关联，所以接下来我们再看看CancelToken构造函数

```js
/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }
 
 
  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });
 
 
  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }
 
 
    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}
```
所以souce.token是一个CancelToken的实例，而source.cancel是一个函数，调用它会在CancelToken的实例上添加一个reason属性，并且将实例上的promise状态resolve掉

官网另一个示例

```js
const CancelToken = axios.CancelToken;
let cancel;
 
 
axios.get('/user/12345', {
  cancelToken: new CancelToken(function executor(c) {
    // An executor function receives a cancel function as a parameter
    cancel = c;
  })
});
 
 
// cancel the request
cancel();
```

它与第一个示例的区别就在于每个请求都会创建一个CancelToken实例，从而它拥有多个cancel函数来执行取消操作

我们执行axios.get，最后其实是执行axios实例上的request方法，方法定义在axios\lib\core\Axios.js

```js
Axios.prototype.request = function request(config) {
  ...
  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);
 
 
  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });
 
 
  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });
 
 
  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }
 
 
  return promise;
};
```

request方法返回一个链式调用的promise，等同于
```js
Promise.resolve(config).then('request拦截器中的resolve方法', 'request拦截器中的rejected方法').then(dispatchRequest, undefined).then('response拦截器中的resolve方法', 'response拦截器中的rejected方法')
```

接下来看看axios\lib\core\dispatchRequest.js中的dispatchRequest方法
```js

function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);
  ...
  var adapter = config.adapter || defaults.adapter;
  return adapter(config).then()
};
```

如果是cancel方法立即执行，创建了CancelToken实例上的reason属性，那么就会抛出异常，从而被response拦截器中的rejected方法捕获，并不会发送请求，这个可以用来做请求拦截
```js

CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};
```

如果cancel方法延迟执行，那么我们接着去找axios\lib\defaults.js中的defaults.adapter
```js
function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = require('./adapters/xhr');
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = require('./adapters/http');
  }
  return adapter;
}
 
 
var defaults = {
  adapter: getDefaultAdapter()
}
```





### 转发

[如何防止重复发送ajax请求](https://blog.csdn.net/xgangzai/article/details/108413909)

