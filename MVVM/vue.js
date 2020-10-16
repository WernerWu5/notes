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

  new Compile(this._el, this)
}

// defineProperty的缺点：
// （1）只能劫持对象的属性，并且是已存在的属性，新增则无法劫持到
// （2）无法监听到数组内部变化，数组长度变化等
//  vue如何实现对 数组方法push等的变异 请查看 arr.js 文件
function Observe(data) {
  Object.keys(data).forEach(key => {
    let dep = new Dep()
    let val = data[key]
    observe(val) // 实现深度监听
    Object.defineProperty(data, key, {
      configurable: true,
      enumerable: true, // 必须为true，否则后面无法枚举
      get() {
        console.log('获取', key, '值：', val)
        Dep.target && dep.add(Dep.target)
        return val // 不能使用data[key]，否则会循环调用get方法
      },
      set(newVal) {
        console.log('设置', key, '值：', newVal)
        if (newVal === val) {
          return
        }
        val = newVal
        dep.notify(newVal)
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

// 编译
function Compile(el, vm) {
  vm._el = document.querySelector(el)

  let fragment = document.createDocumentFragment() // 创建虚拟DOM
  let child

  // 将真实DOM移入到虚拟DOM中
  while (child = vm._el.firstChild) {
    fragment.appendChild(child)
  }

  const replace = function (frag) {

    Array.from(frag.childNodes).forEach((node) => {
      let reg = /\{\{(.*?)\}\}/g
      let text = node.textContent

      // console.log('text', text)
      // console.log('node.nodeType', node.nodeType)
      // console.log('reg.test(text)', reg.test(text))

      // 文本节点并且存在{{}}字符
      if (node.nodeType === 3 && reg.test(text)) {
        let arr = RegExp.$1.split('.')
        let val = vm

        // 如果dom存在 {{a.b}} 则获取到a对象的b属性值
        arr.forEach(key => {
          val = val[key]
        })
        new Watcher(vm, RegExp.$1, function (newVal) {
          node.textContent = text.replace(reg, newVal).trim()
        })
        // 将文本内容 替换
        node.textContent = text.replace(reg, val).trim()
      }

      // 元素节点
      if (node.nodeType === 1) {
        let nodeAttr = node.attributes
        Array.from(nodeAttr).forEach(att => {
          let name = att.name
          let exp = att.value
          // console.log('att.name', att.name)
          // console.log('att.value', att.value)
          if (name.includes('v-model')) {
            node.value = vm[exp]

            new Watcher(vm, RegExp.$1, function (newVal) {
              node.value = text.replace(reg, newVal).trim()
            })

            node.addEventListener('input', function (e) {
              let newVal = e.target.value
              // console.log(newVal);
              vm[exp] = newVal
            })
          }

        })
      }

      if (node.childNodes && node.childNodes.length) {
        replace(node)
      }
    })
  }

  replace(fragment)

  // 将虚拟DOM重新导入到真实DOM中
  vm._el.appendChild(fragment)
}

// 添加发布订阅
function Dep() {
  this.subs = []
}

Dep.prototype.add = function (sub) {
  this.subs.push(sub)
}

Dep.prototype.notify = function () {
  this.subs.forEach(sub => {
    sub.update()
  })
}

// 观察者
function Watcher(vm, exp, fn) {
  this.vm = vm
  this.exp = exp
  this.fn = fn
  Dep.target = this
  let val = vm
  let arr = exp.split('.')
  arr.forEach(exp => {
    val = val[exp]
  })
  Dep.target = null
}

Watcher.prototype.update = function () {
  let val = this.vm
  let arr = this.exp.split('.')
  arr.forEach(key => {
    val = val[key]
  })
  this.fn(val)
}