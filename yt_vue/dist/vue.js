(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;

    var _s, _e;

    try {
      for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  // 解析字符串 的正则
  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*";
  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")");
  var startTagOpen = new RegExp("^<".concat(qnameCapture)); // 他匹配到的分组是一个 标签名  <xxx 匹配到的是开始 标签的名字

  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>")); // 匹配的是</xxxx>  最终匹配到的分组就是结束标签的名字

  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性
  // 第一个分组就是属性的key value 就是 分组3/分组4/分组五

  var startTagClose = /^\s*(\/?)>/; // <div> <br/>
  // 生成 ast 树

  function parseHTML(html) {
    // HTML 最开始肯定是一个 <div id="app">内容</div>
    var ELEMENT_TYPE = 1; // dom 元素类型

    var TEXT_TYPE = 3; // text 文本类型

    var stack = []; // 用于存储元素的

    var currentParent = null; // 指向栈中的最后一个( 当前元素 )

    var root = null; // ast树

    function createASTElement(tag, attrs) {
      return {
        tag: tag,
        // 标签名称
        type: ELEMENT_TYPE,
        // 当前的类型
        children: [],
        // 子元素的数组
        attrs: attrs,
        // 该标签的属性数组
        parent: null // 当前元素的父级元素

      };
    } // 开始标签
    // 利用栈型结构 构造出一课 ast 树


    function start(tagName, attrs) {
      var node = createASTElement(tagName, attrs);

      if (!root) {
        // 判断是否是空树
        root = node; // 如果为空则说明当前的元素是树的根节点
      }

      if (currentParent) {
        // 判断栈中最后的元素是否存在
        node.parent = currentParent; // 当前元素中的父级元素就是 栈中的最后一个元素 ( 因为当前的元素还没进栈 )

        currentParent.children.push(node); // 还需要把栈中最后一个元素的 子元素数组记录 当前元素
      } // 把栈中的最后一个元素记录完成之后, 我们就可以开始把当前元素追加到栈中 成为栈中最后的元素了


      stack.push(node);
      currentParent = node; // currentParent 栈中的最后一个元素
    } // 文本内容


    function chars(text) {
      // 文本直接放到当前指向的节点终
      text = text.replace(/\s/g, ' '); // 如果当前文本空格超过2个以上就替换成一个
      // 把当前内容追加到 栈中的最后一个的子元素数组中 ( children ), 类型为 3

      text && currentParent.children.push({
        type: TEXT_TYPE,
        text: text,
        parent: currentParent
      });
    }

    function end(tag) {
      var node = stack.pop(); // 如果走到end这个标签, 则说明已经遇到闭标签, 这个时候就可以把栈中最后一个弹出来了, 并且校验标签是否合法

      if (node.tag == tag) {
        currentParent = stack[stack.length - 1];
      } else {
        throw new Error('当前标签闭合有误');
      }
    } // 前进字符串 ( 去除已解析的字符串 )


    function advance(n) {
      html = html.substring(n);
    }

    function parseStartTag() {
      // 解析开始标签
      var start = html.match(startTagOpen); // 判断是否有开始标签

      if (start) {
        // 组合虚拟dom
        var match = {
          tagName: start[1],
          // 标签名
          attrs: [] // 该标签的属性值等

        }; // 前进字符

        advance(start[0].length); // 如果不是开始标签 就一直匹配下去 直至把 > 匹配到

        var attr, _end; // attr当前属性变量  end 开始标签的 闭字符


        while (!(_end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          advance(attr[0].length);
          match.attrs.push({
            name: attr[1],
            value: attr[3] || attr[4] || attr[5]
          });
        }

        if (_end) {
          advance(_end[0].length);
        }

        return match; // 返回开始标签
      }

      return false; // 不是开始标签
    }

    while (html) {
      // 如果textEnd 为 0 说明是一个开始标签 或者 结束标签
      // 如果textEnd > 0 说明就是文本的结束位置
      var textEnd = html.indexOf('<');

      if (textEnd == 0) {
        var startTagMatch = parseStartTag(); // 开始标签的匹配结果

        if (startTagMatch) {
          start(startTagMatch.tagName, startTagMatch.attrs);
          continue;
        } // 匹配结束标签


        var endTagMatch = html.match(endTag);

        if (endTagMatch) {
          advance(endTagMatch[0].length);
          end(endTagMatch[1]);
          continue;
        }
      }

      if (textEnd > 0) {
        var text = html.substring(0, textEnd); // 内容 {{ name }}</div>  拿到的值是这个 现在进行切割

        if (text) {
          chars(text);
          advance(text.length);
        }
      }
    }

    return root;
  }

  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // {{ asdsadsa }}  匹配到的内容就是我们表达式的变量
  // console.log(defaultTagRE.exec('{{name}} nihao ya '));

  function genProps(attrs) {
    var str = '';

    for (var i = 0; i < attrs.length; i++) {
      var attr = attrs[i];

      if (attr.name === 'style') {
        (function () {
          var obj = {};
          attr.value.split(';').forEach(function (item) {
            var _item$split = item.split(':'),
                _item$split2 = _slicedToArray(_item$split, 2),
                key = _item$split2[0],
                value = _item$split2[1];

            obj[key] = value;
          });
          attr.value = obj;
        })();
      }

      str += "".concat(attr.name, ":").concat(JSON.stringify(attr.value), ",");
    } // console.log(str.slice(0, -1));


    return "{".concat(str.slice(0, -1), "}"); // 去除尾部的 , 
  }

  function gen(node) {
    if (node.type === 1) {
      // 如果是dom元素的话, 需要递归转换代码
      return codegen(node);
    } else if (node.type === 3) {
      // 文本
      var text = node.text;

      if (!defaultTagRE.test(text)) {
        // 取反 获取纯文本( 就是没有该文本没有 {{ 这些 }} )
        return "_v(".concat(JSON.stringify(text), ")");
      } else {
        var tokens = [];
        var match = null;
        defaultTagRE.lastIndex = 0;
        var lastIndex = 0; // 匹配 字符串中所有的 {{}}

        while (match = defaultTagRE.exec(text)) {
          // exec 里面有一个index 属性, 第一次匹配他会匹配到第一个符合条件的字符串, 
          // 第二次匹配的话, 他会跳过第一个符合条件的字符串, 以此类推, 可以把它的匹配当成一个前进字符
          // console.log(match);
          var index = match.index; // 匹配到 {{}} 的位置

          if (index > lastIndex) {
            // 如果index 大于 lastIndex 的话, 就说明 {{变量}} 是在正常字符串的后面, 
            // 那么我们就需要把到 index 之前的字符串截取出来
            tokens.push(JSON.stringify(text.slice(lastIndex, index)));
          } // 上面已经把 {{}} 之前的正常字符串截取出来了, 那么后面就可以把变量也追加进去了


          tokens.push("_s(".concat(match[1].trim(), ")")); // 把当前的字符串索引请进到 {{}} 之后, 提供下次再一次请进

          lastIndex = index + match[0].length;
        } // console.log(tokens);


        return "_v(".concat(tokens.join('+'), ")");
      }
    }
  }

  function genChildren(children) {
    return children.map(function (child) {
      return gen(child);
    }).join(',');
  } // 生成代码


  function codegen(ast) {
    var children = genChildren(ast.children); // 递归 每一层都转义成方法结构

    var code = "_c('".concat(ast.tag, "', ").concat(ast.attrs.length > 0 ? genProps(ast.attrs) : null, " ").concat(ast.children.length ? ",".concat(children) : '', ")");
    return code;
  }

  function compileToFunction(template) {
    // 1. 将 template 转化成 ast 语法树
    var ast = parseHTML(template); // console.log(ast)
    // 2. 生成 render 方法 ( render方法执行后的返回的结果就是 虚拟dom )
    // 模板引擎的实现原理 就是 with ( 将当前的this 指向更改 ) + new Function ( 字符串转代码返回 )

    var code = codegen(ast);
    code = "with(this){ return ".concat(code, " }");
    var render = new Function(code); // 根据代码字符串 利用 Function 来生成代码
    // console.log(code);

    return render;
  }

  var id$1 = 0;

  var Dep = /*#__PURE__*/function () {
    function Dep() {
      _classCallCheck(this, Dep);

      this.id = id$1++;
      this.subs = []; // 这里存储着当前属性对应的watcher, (因为可能一个属性对应多个组价, 所以watcher 也会是多个)
    } // 交叉记录


    _createClass(Dep, [{
      key: "depend",
      value: function depend() {
        // 调用watcher 记录dep
        // 这里我们不希望放重复的watcher, 在addDep 这个方法里面, 已经加了一层拦截, 所以不会有重复的 dep watcher
        Dep.target.addDep(this); // dep 和 watcher 是一个多对多得关系 ( 一个属性可以再多个组件中使用 dep -> 多个watch  )
        // 一个组件中由多个属性组成 (  一个watcher 对应多个 dep )
      } // 在watcher.addDep 里面会有一个回调, 调用dep 里面的 addsub

    }, {
      key: "addSub",
      value: function addSub(watch) {
        this.subs.push(watch);
      } // 调用dep 里面的watcher 来循环更新

    }, {
      key: "notify",
      value: function notify() {
        this.subs.forEach(function (watcher) {
          return watcher.update(watcher);
        });
      }
    }]);

    return Dep;
  }(); // 该属性是 Dep 的原型链上的属性, 全局唯一性, 为的就是在Dep里面存储 watcher, 然后再利用 watcher 方法存储 Dep


  Dep.target = null;

  var id = 0;

  var Watcher = /*#__PURE__*/function () {
    function Watcher(vm, fn, options) {
      _classCallCheck(this, Watcher);

      this.renderWatcher = options; // 目前没用到

      this.getter = fn; // getter 意味着调用 _update(vm._render) 这个函数, 可以获取变量, 产生取值(也就是get)操作

      this.id = id++; // watcher 的唯一标识

      this.dep = []; // 用来存储dep ( 后续作用的话 是实现计算属性, 和一些清理工作, 具体慢慢来 目前我也不知道 )

      this.depId = new Set(); // 用来去重dep的

      this.get();
    }

    _createClass(Watcher, [{
      key: "get",
      value: function get() {
        Dep.target = this;
        this.getter();
        Dep.target = null;
      }
    }, {
      key: "addDep",
      value: function addDep(dep) {
        var id = dep.id;

        if (!this.depId.has(id)) {
          // Set 有一个 has( 判断是否有该属性 如果有返回 true, 没有则是 false)
          this.depId.add(id);
          this.dep.push(dep); // 记录 dep( 也就是属性 )

          dep.addSub(this); // 通过传过来的 dep(实例对象) 调用里面的原型方法, 让当前dep 存储记录 当前 watcher
        }
      } // 收集更新 ( vue里面的dom 更新是异步更新   )

    }, {
      key: "update",
      value: function update(watcher) {
        // 该 watcher 是从dep里面传来的, 而dep里面的 watcher 在之前记录属性的时候, 就已经做了交叉存储
        queueWatch(watcher);
      } // 更新

    }, {
      key: "run",
      value: function run() {
        this.get();
      }
    }]);

    return Watcher;
  }();

  var queue = []; // 监听队列

  var has = {}; // 做列表维护, 判断存放了哪些watcher,  去重, 为的是同个 watch 下, 不多次更新DOM, 只待留一次 进行一次性更新

  var pending = false; // 防抖

  function flushSchedulerQueue() {
    var flushQueue = queue.slice(0); // 获取存储的所有 watcher 队列

    queue = [];
    has = {};
    pending = false; // 循环 watcher 队列, 执行每个 watcher 里面的更新操作(run) 也就是更新

    flushQueue.forEach(function (w) {
      return w.run();
    });
  } // 记录watcher 进行批处理


  function queueWatch(watcher) {
    // 首先拿到id 处理节流阀
    var id = watcher.id; // 在has 里面没有该watch 的情况下 才进行存储 watch

    if (!has[id]) {
      queue.push(watcher); // 追加当前watcher 下, 利用宏任务微任务的特性, 在代码执行完成之后再更新( 也就是等data 里面的属性全部更改完成之后 再统一更新, 而不是更改一个属性 就更新一次dom )

      has[id] = true; // 不管我们的update 执行多少次, 但最终只执行一轮更新dom 操作

      if (!pending) {
        nextTick(flushSchedulerQueue);
      }
    }
  } // 这个批处理, 是为了不让用户 为了拿到 vue 更改之后的dom元素 而不乱开定时器, 进行的批处理


  var callbacks = []; // 异步更新队列, 用户如果调用的话, 谁先调用 谁的快

  var waiting = false; // nextTickk 的节流阀

  function flushCallbacks() {
    callbacks.forEach(function (cb) {
      return cb();
    });
  }

  function nextTick(cb) {
    callbacks.push(cb);

    if (!waiting) {
      Promise.resolve().then(flushCallbacks);
      waiting = true;
    }
  }

  function createElementVNode(vm, tag, data, ...children) {
    if (data == null) {
      data = {};
    }
    let key = data.key;
    if (key) {
      delete data.Key;
    }
    return vnode(vm, tag, key, data, children)
  }

  // _v() 使用到
  function createTextVNode(vm, text) {
    return vnode(vm, undefined, undefined, undefined, undefined, text)
  }

  // 这个 vnode 和 ast 一样吗?  ast做的是语法层面的转换, 它描述的是语法本身( 可以描述js css  html )
  // 我们的虚拟dom 是描述dom元素, 可以增加一些自定义属性 ( 描述 dom )
  function vnode(vm, tag, key, data, children, text) {
    return {
      vm,
      tag,
      key,
      data,
      children,
      text
    }
  }

  function createElm(vnode) {
    // console.log(vnode);
    var tag = vnode.tag;
        vnode.data;
        var children = vnode.children,
        text = vnode.text; // 判断 tag(标签名) 是否是字符串, 如果是代表着是dom元素, 如果不是 就是文本内容

    if (typeof tag === 'string') {
      // 这里将正式节点喝虚拟节点对于起来, 后续可以用到
      vnode.el = document.createElement(tag); // 循环当前children 来递归创建 dom

      children.forEach(function (child) {
        // 递归拿到创建的元素 或者 文本内容然后追加到父元素 然后一层一层进 一层一层出
        vnode.el.appendChild(createElm(child));
      });
    } else {
      vnode.el = document.createTextNode(text);
    }

    return vnode.el;
  } // oldVNode 是老vnode   vnode 是新vnode


  function patch(oldVNode, vnode) {
    // console.log(oldVNode);
    // 初始化
    var isRealElement = oldVNode.nodeType;
    console.log(isRealElement);

    if (isRealElement) {
      var elm = oldVNode; // 获取真实dom

      var parenElm = elm.parentNode; // 拿到父元素

      var newElm = createElm(vnode); // 创建真实dom

      parenElm.insertBefore(newElm, elm.nextSibling); // 将当前新的元素插入到 真实元素的下一个元素的前面

      parenElm.removeChild(elm);
      return newElm;
    }
  }

  function initLifeCycle(Vue) {
    Vue.prototype._update = function (vnode) {
      // 将 vnode 转换成真是dom
      var vm = this;
      var el = vm.$el; // patch 既有初始化真实dom功能, 也有更新功能

      vm.$el = patch(el, vnode);
    }; // 该方法是创建 描述 dom 元素的对象


    Vue.prototype._c = function () {
      // console.log(...arguments);
      return createElementVNode.apply(void 0, [this].concat(Array.prototype.slice.call(arguments)));
    }; // 该方法是把 字符串 和 变量拼接


    Vue.prototype._v = function () {
      // console.log(...arguments);
      return createTextVNode.apply(void 0, [this].concat(Array.prototype.slice.call(arguments)));
    }; // 该方法是获取 变量 转为字符串


    Vue.prototype._s = function (value) {
      if (_typeof(value) !== 'object') return value; // console.log(value);

      return JSON.stringify(value);
    };

    Vue.prototype._render = function () {
      // 当渲染的时候会去实例中取值, 我们就可以将属性喝视图绑定在一起( with 传入的this, 所以我们现在吧render的this指向 指向vue 就没人绑定 )
      // console.log( this.$options.render.call(this));
      return this.$options.render.call(this); // render 是ast树 转义后生成的方法
    };
  }
  function mountComponent(vm, el) {
    vm.$el = el; // 调用初始化  render 会返回描述dom的代码树型结构, _update 拿到描述dom的结构之后进行喜欢遍历生成真实dom

    var updateComponent = function updateComponent() {
      // console.log(vm._render());
      vm._update(vm._render());
    };

    new Watcher(vm, updateComponent, true); // updateComponent()
  }

  function isObject(val) {
    return _typeof(val) === 'object' && val !== null;
  }

  // 我们需要重写数组的某些方法( 如 push 改变原数组的方法 )
  var oldArrayProto = Array.prototype; // 获取原数组类型

  var newArrayProto = Object.create(oldArrayProto); // 创建新的数组原型

  var methods = [// 找到所有的变异方法
  'push', 'pop', 'shift', 'unshift', 'reverse', 'sort', 'splice']; // concat slice 都不会改变原数组

  methods.forEach(function (method) {
    // 重写所有的数组变异方法 ( 劫持 或者 装饰器 )
    newArrayProto[method] = function () {
      var _oldArrayProto$method;

      console.log('劫持', this); // 我需要调用数组的原有方法

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var res = (_oldArrayProto$method = oldArrayProto[method]).call.apply(_oldArrayProto$method, [this].concat(args));

      var inserted = null; // 判断改变数组的值 是否是对象, 如果是对象的情况下, 需要再一次进行对象观测监听

      switch (method) {
        case 'push':
        case 'unshift':
          // arr.unshift(1,2,3)
          inserted = args;
          break;

        case 'splice':
          // arr.splice(0,1,{a:1},{a:1})
          inserted = args.slice(2);
          break;
      }

      if (inserted) {
        // 对新增内容再次观测监听, 不需要判断, 在observe 会有判断的
        this.__ob__.observeArray(inserted);
      }

      return res;
    };
  });

  var Observer = /*#__PURE__*/function () {
    function Observer(data) {
      _classCallCheck(this, Observer);

      // 把当前对类 挂载到当前数据的原型链上
      // data.__ob__ = this // 如果直接链上赋值, 会导致死循环
      // 所以我们需要把该属性该为 不可遍历
      Object.defineProperty(data, '__ob__', {
        // 如果不设置不可枚举的话, 进入死循环 死循环的条件是 一直在循环这个 __ob__
        value: this,
        enumerable: false // 不可枚举 ( 不可循环 )

      }); // 判断如果是数组的话 就劫持改变该数组的方法

      if (Array.isArray(data)) {
        data.__proto__ = newArrayProto; // 观测数组
        // this.observeArray(data)
      } else {
        // 开始循环对象属性 劫持对象
        this.walk(data);
      }
    }

    _createClass(Observer, [{
      key: "walk",
      value: function walk(data) {
        Object.keys(data).forEach(function (key) {
          return defineReactive(data, key, data[key]);
        });
      } // 在数组里面如果是对象的话, 是需要进行再次监听的

    }, {
      key: "observeArray",
      value: function observeArray(data) {
        // 循环数组 进行观测监听
        data.forEach(function (item) {
          observe(item);
        });
      }
    }]);

    return Observer;
  }();

  function defineReactive(data, key, value) {
    // 再一次判断 观测监听
    observe(value); // 每个属性的 dep

    var dep = new Dep();
    Object.defineProperty(data, key, {
      get: function get() {
        // 取值的时候 会执行get
        console.log('get', key);
        console.log(Dep.target); // 如果target 有的情况下, 那么就说明 watcher

        if (Dep.target) {
          dep.depend();
        }

        return value;
      },
      set: function set(newV) {
        // 赋值时 执行
        console.log('set', key);
        if (newV === value) return;
        observe(newV);
        value = newV;
        dep.notify();
      }
    });
  } // 对data 继续观测

  function observe(data) {
    // 判断是否有__ob__ 如果有的情况下, 那么久意味着该数据是被观测过的, 就不需要再观测
    if (data.__ob__ instanceof Observer) {
      return;
    } // 对这个对象进行劫持


    if (!isObject(data)) {
      return;
    }

    return new Observer(data);
  }

  function initState(vm) {
    var opts = vm.$options; // 回去Vue 所有的选项

    if (opts.data) {
      // 判断是否有data, 如果有的再去初始化 代理 和 监听data里面的数据
      initData(vm);
    }
  }

  function proxy(vm, _data, key) {
    Object.defineProperty(vm, key, {
      get: function get() {
        return vm[_data][key];
      },
      set: function set(newV) {
        vm[_data][key] = newV;
      }
    });
  }

  function initData(vm) {
    var data = vm.$options.data; // data 可能也有可能是函数
    // 判断是否是函数, 如果是的话 就调用(默认会返回对象的), 再把该函数的this 指向 vm(也就是vue)

    data = vm._data = typeof data === 'function' ? data.call(vm) : data; // 对数据继续劫持 vue 里采用的是 object definePropety api 来对对象里面的每一个属性进行代理的 而不是对整个对象

    observe(data); // 数据代理( 使之可以直接使用 this 的实例访问 )

    for (var key in data) {
      if (Object.hasOwnProperty.call(data, key)) {
        proxy(vm, '_data', key);
      }
    }
  }

  function initMxin(vue) {
    vue.prototype._init = function (options) {
      // 就是给Vue 增加 _init 方法的
      var vm = this;
      vm.$options = options; // 1. 初始化状态
      //     a. 数据监听

      initState(vm); // 2. 生成虚拟dom

      if (options.el) {
        vm.$mount(options.el);
      }
    };

    vue.prototype.$mount = function (el) {
      var vm = this; // 获取dom元素

      el = document.querySelector(el);
      var opt = vm.$options; // 1 先判断有没有render函数

      if (!opt.render) {
        // 2 如果没有render函数的情况下, 再进行判断是否有template, 如果也没有的情况下 就 使用外部template 
        var template;

        if (!opt.template && el) {
          template = el.outerHTML;
        } else {
          if (el) {
            template = opt.template; // 如果有el 则采用模板内容
          }
        }

        if (template && el) {
          // 对模板进行编译
          var render = compileToFunction(template); // console.log(render);

          opt.render = render; // jsx 最终会编译成 h('xxx')
        } // console.log(opt);


        mountComponent(vm, el);
      }
    };
  }

  function Vue(options) {
    // options 是用户配置
    this._init(options); // 默认调用初始化函数

  }
  Vue.prototype.$nextTick = nextTick;
  initMxin(Vue);
  initLifeCycle(Vue);

  return Vue;

}));
//# sourceMappingURL=vue.js.map
