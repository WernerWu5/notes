


class Event {

  constructor() {
    this.handles = {}
  }


  addEvent(type, methode) {

    if (!(type in this.handles)) {
      this.handles[type] = []
    }

    this.handles[type].push(methode)
  }

  dispatchEvent(type, ...params) {

    if (!(type in this.handles)) {
      return new Error('未注册该函数')
    }

    this.handles[type].forEach(item => {
      item(params)
    })
  }

  removeEvent(type, methode) {

    if (!(type in this.handles)) {
      return new Error('未注册该函数')
    }

    if (methode) {
      const INDEX = this.handles[type].findIndex(item => {
        return item === methode
      })

      if (INDEX < 0) {
        return new Error('没有该函数')
      }

      this.handles[type].splice(INDEX, 1)
    }

    if (!methode || !this.handles[type].length) {
      delete this.handles[type]
    }

  }

}

const e = new Event()

function load(params) {
  console.log('load', params)
}

function load1(params) {
  console.log('load1', params)
}

function load2(params) {
  console.log('load2', params)
}

e.addEvent('load', load)
e.addEvent('load', load1)

e.dispatchEvent('load', 'hahahah')

console.log('-----------')
e.removeEvent('load', load)
e.dispatchEvent('load', 'hahahah')
