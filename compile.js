class Compile {
  constructor (el, vm) {
    this.$el = document.querySelector(el)
    this.$vm = vm

    if (this.$el) {
      // 取出$el里面的元素加到文档片段中
      this.$fragment = this.node2Fragment(this.$el)
      // 执行编译
      this.compile(this.$fragment)
      // 将编译完的片段追加至$el尾部
      this.$el.appendChild(this.$fragment)
    }
  }

  node2Fragment (el) {
    const frag = document.createDocumentFragment();
      // 将el中所有子元素搬家至frag中
      let child;
      while ((child = el.firstChild)) {
        frag.appendChild(child);
      }
      return frag;
  }

  compile (el) {
    // 根据类型 {{}} s- @ 类型分别编译
    const childNodes = el.childNodes
    Array.from(childNodes).forEach(node => {
      if(node.nodeType === 1) {
        //遍历元素属性 编译指令 事件
        const nodeAttrs = node.attributes
        Array.from(nodeAttrs).forEach(attr => {
          const attrName = attr.name
          const exp = attr.value
          if (this.isDirective(attrName)) {
            const dir = attrName.substring(2)
            this[dir] && this[dir](node, this.$vm, exp)
          }
          if (this.isEvent(attrName)) {

            const dir = attrName.substring(1)
            this.eventHandler(node, this.$vm, exp, dir)
          }
        })
      } else if (node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent)) {
        // 编译{{}}里面的属性
        // console.log(node.textContent);
        this.compileText(node)
      }

      // 递归子节点 获取元素中的字节点
      if (node.childNodes && node.childNodes.length > 0) {
        this.compile(node);
      }
    })
  }

  // 编译指令@. 处理事件
  eventHandler (node, vm, exp, dir) {
    let fn = vm.$options.methods && vm.$options.methods[exp];
    if (dir && fn) {
      node.addEventListener(dir, fn.bind(vm))
    }
  }

  compileText (node) {
    this.update(node, this.$vm, RegExp.$1, 'text')
  }

  // s-model
  model (node, vm, exp) {
    this.update(node, vm, exp, 'model')

    node.addEventListener('input', e => {
      vm[exp] = e.target.value
    })
  }

  // s-text
  text (node, vm, exp) {
    this.update(node, vm, exp, 'text')
  }

  // s-html
  html (node, vm, exp) {
    this.update(node, vm, exp, 'html')
  }

  // 中转站 更新函数
  update (node,vm,exp,dir) {
    console.log(vm[exp])
    const updateFn = this[dir+'Updater']
    updateFn && updateFn(node, vm[exp])
    // 
    new Watcher(vm, exp, function(value) {
      updateFn && updateFn(node, value)
    })
  }

  textUpdater (node, value) {
    node.textContent = value
  }

  htmlUpdater (node, value) {
    node.innerHTML = value
  }

  modelUpdater (node,newVal) {
    node.value = newVal
  }

  isDirective (attr) {
    return attr.indexOf('s-') === 0
  }

  isEvent (attr) {
    return attr.indexOf('@') === 0
  }
}