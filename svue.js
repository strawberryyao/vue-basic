class SVue {
  constructor (options) {
    this.$options = options
    this.$data = options.data
    console.log(options)
    this.observe(this.$data)

    new Compile(options.el, this)

    // new Watcher()
    // this.$data.test
  }

  observe (value) {
    if (!value || typeof value !== "object") return

    Object.keys(value).forEach(key => {
      //  数据劫持 对data里面每个属性 增加get set方法
      this.defineReactive(value, key, value[key])
    })
  }

  defineReactive (obj, key, val) {
    this.observe(val)

    const dep = new Dep()

    Object.defineProperty(obj, key, {
      get () {
        Dep.target && dep.addDep(Dep.target)
        return val
      },
      set (newVal) {
        if (newVal === val) {
          return
        }
        val = newVal
        // console.log(`${key}属性更新了：${val}`)
        dep.notify()
        
      }
    })
  } 
}

//Dep: 管理watcher 收集依赖通知watcher更新
class Dep {
  constructor () {
    this.deps = []
  }

  addDep(dep) {
    this.deps.push(dep)
  }

  notify () {
    this.deps.forEach(dep => dep.update())
  }
}

// watcher 将watcher示例指定到Dep静态属性 通知视图更新
class Watcher {
  constructor () {
    Dep.target = this
  }
  update () {
    console.log('test 属性更新了')
  }
}
