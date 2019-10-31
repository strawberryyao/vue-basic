class SVue {
  constructor (options) {
    this.$options = options
    this.$data = options.data
    this.observe(this.$data)
  }

  observe (value) {
    if (!value || typeof value !== "object") return

    Object.keys(value).forEach(key => {
      //  数据劫持 对每个对象增加get set属性
      this.defineReactive(value, key, value[key])
    })
  }

  defineReactive (obj, key, val) {
    this.observe(val)
    Object.defineProperty(obj, key, {
      get () {
        return val
      },
      set (newVal) {
        if (newVal === val) {
          return
        }
        val = newVal
        console.log(`${key}属性更新了：${val}`)
        
      }
    })
  }
  
}