// 先实现数据劫持（观察者）
function Vue(options = {}) {
  this._data = options.data || {}
  this._el = options.el || 'app'
  this._options = options

  observe(this._data) // 劫持data所有属性

  Object.keys(this._data).forEach(key => {
    Object.defineProperty(this, key, {
      configurable: true,
      get() {
        return this._data[key]
      },
      set(newVal) {
        this._data[key] = newVal
      }
    })
  })
}

// defineProperty的缺点：
// （1）只能劫持对象的属性，并且是已存在的属性，新增则无法劫持到
// （2）无法监听到数组内部变化，数组长度变化等
function Observe(data) {
  Object.keys(data).forEach(key => {
    let val = data[key]
    observe(val) // 实现深度监听
    Object.defineProperty(data, key, {
      configurable: true,
      enumerable: true, // 必须为true，否则后面无法枚举
      get() {
        console.log('获取', key, '值：', val)
        return val // 不能使用data[key]，否则会循环调用get方法
      },
      set(newVal) {
        console.log('设置', key, '值：', newVal)
        if (newVal === val) {
          return
        }
        val = newVal
        observe(val) // 判断newVal是否为对象
      }
    })
  })
}

function observe(data) {
  if (!data || typeof data !== 'object') {
    return
  }
  new Observe(data)
  return
}

function Dep() {

}