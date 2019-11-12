class Compile {
  constructor (el, vm) {
    console.log(el,vm);
    
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
      console.log(node)
      if(node.nodeType === 1) {
        //遍历元素属性 编译指令 事件
        console.log(node)
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

  compileText (node) {
    // console.log(node, this.$vm, RegExp.$1, 'text')
    this.update(node, this.$vm, RegExp.$1, 'text')
  }

  // 中转站 更新函数
  update (node,vm,exp,dir) {
    const updateFn = this[dir+'Updater']
    updateFn && updateFn()
  }

  text (node, vm, exp) {

  }

  isElementNode (node) {
    return node.nodeType === 1
  }

  isInterpolation (node) {
    return node.nodeType === 3 
    // && /\{\{(.*)\}\}/.test(node.textContent)
  }
}