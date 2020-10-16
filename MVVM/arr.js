// import { def } from '../util/index'

// 不是完整代码，无法正常运行
const arrayProto = Array.prototype
export const arrayMethods = Object.create(arrayProto) // 类似创建了一个实例，改变实例的内容并不会影响到 Array.prototype

[
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]
  .forEach(function (method) {
    const original = arrayProto[method] // 获取原生Array方法
    def(arrayMethods, method, function mutator(...args) {
      const result = original.apply(this, args)
      const ob = this.__ob__
      let inserted
      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args
          break
        case 'splice':
          inserted = args.slice(2)
          break
      }
      if (inserted) ob.observeArray(inserted)
      ob.dep.notify()
      return result
    })
  })

// 贴出def部分的代码
export function def(obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  })
}


const push = Array.prototype.push;

Array.prototype.push = function mutator(...arg) {
  const result = push.apply(this, arg)
  doSomething()
  return result
}

function doSomething() {
  console.log('do something')
}

let arr = []
arr.push(1)
arr.push(2)

