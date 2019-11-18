class SVue {
  constructor (options) {
    this.$options = options
    this.$data = options.data
    this.observe(this.$data)

    new Compile(options.el, this)
    // 执行周期钩子函数
    if (options.created) {
      options.created.call(this)
    }
  }

  observe (value) {
    if (!value || typeof value !== "object") return

    Object.keys(value).forEach(key => {
      //  数据劫持 对data里面每个属性 增加get set方法
      this.defineReactive(value, key, value[key])
      // 将data 上的属性代理到this上
      this.proxyData(key)
    })
  }

  proxyData (key) {
    Object.defineProperty(this, key, {
      get () {
        return this.$data[key]
      },
      set (newVal) {
        this.$data[key] = newVal
      }
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

// watcher  通知视图更新
class Watcher {
  constructor (vm, key, cb) {
    this.vm = vm
    this.key = key
     this.cb = cb
    // 将watcher示例指定到Dep静态属性 target
    Dep.target = this
    // 触发getter 添加依赖
    this.vm[this.key]
    Dep.target = null;
  }
  update () {
    this.cb.call(this.vm, this.vm[this.key]);
    // console.log('test 属性更新了')
  }
}
