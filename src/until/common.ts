

export class When {
  private source: any

  private constructor (source: any) {
    this.source = source
  }

  public static check(source: any): When {
    return new When(source)
  }

  public is(key: any, cb?: () => void) {
    const flag = key === this.source
    flag && cb && cb()
    return flag
  }

  public within(allows: any[], cb?: () => void) {
    const flag = allows.includes(this.source)
    flag && cb && cb()
    return flag
  }
}

/**
 * 标准化数字格式检测（检测完整的数字格式）
 *
 * @export
 * @returns
 */
const NUMBER_REGEX = /[+-]?(?=\.\d|\d)(?:\d+)?(?:\.?\d*)(?:[eE][+-]?\d+)?/

export function NUMBER_REGEX_TAX_TEST(str:any): boolean {
  return new RegExp('^[+-]$|[+-]?\\d+\\.$|^[+-]?0+$|[+-]?\\d+\\.0*$|[+-]?\\d+\\.\\d*0+$', 'g').test(str)
}

/**
 * 格式化数字，保留指定位数
 *
 * @export
 * @param {(number | string)} num 需要格式化的数据
 * @param {number} [digits=2] 需要保留的小数位数
 * @returns 格式化后的数字
 */
export function trimNum(num: number | string, digits: number = 2): number {
  let n = 0

  if (typeof num === 'number') {
    n = num
  } else if (typeof num === 'string') {
    const parsed = num.replace(/,/g, '')

    // 检测形如'-1.2345'的标准数字格式
    if (NUMBER_REGEX.test(parsed)) {
      n = parseFloat(parsed)
      if (isNaN(n)) return 0
    } else {
      return 0
    }
  } else {
    return 0
  }

  const multi = Math.pow(10, digits)
  return Math.round(n * multi) / multi
}

/**
 * 检测指定字符串是否符合标准的数字格式
 *
 * @export
 * @param {string | number} input 需要检测的字符串
 * @returns {boolean} 检测结果
 */
export function isNumberAlike(input: string | number): boolean {
  const w = input.toString()
  const result = NUMBER_REGEX.exec(w)
  return result != null && result[0] === w
}

/**
 * 根据源对象及需要保留的属性名称，返回一个经过裁剪后的新对象
 *
 * @export
 * @param {{ [key: string]: any }} obj 需要裁剪的源对象
 * @param {string[]} keeps 需要保留的属性名称数组
 * @returns {{ [key: string]: any }} 裁剪过后的新对象
 */
export function prune(obj: { [key: string]: any }, keeps: string[]): { [key: string]: any } {
  return keeps.reduce((result, attr) => Object.assign(result, { [attr]: obj[attr] }), {})
}

/**
 * 简单深拷贝
 *
 * @export
 * @template T 对象类型
 * @param {T} data 能够被JSON化并还原的任意数据结构
 * @returns {T} 深拷贝对象
 */
export function deepclone<T>(data: T): T {
  return _deepclone(data)
}
function _deepclone2(obj:any) {
  return JSON.parse(JSON.stringify(obj))
}
// https://jsperf.com/deep-copy-vs-json-stringify-json-parse/5
function _deepclone(obj:any) : any{
  var clone:any, i;

  if (typeof obj !== 'object' || !obj)
    return obj;

  if ('[object Array]' === Object.prototype.toString.apply(obj)) {
    clone = [];
    var len = obj.length;
    for (i = 0; i < len; i++)
      clone[i] = _deepclone(obj[i]);
    return clone;
  }

  clone = {};
  for (i in obj)
    if (obj.hasOwnProperty(i))
      clone[i] = _deepclone(obj[i]);
  return clone;
}

/**
 * 查找并删除数组中的指定元素
 *
 * 注：该方法会更改传入的数组本身
 *
 * @export
 * @template T 数组元素类型
 * @param {T[]} array 需要操作的数组
 * @param {(value: T, index: number) => boolean} predicate 查找指定元素的断言
 */
export function findNdelete<T>(array: T[], predicate: (value: T, index: number) => boolean) {
  const index = array.findIndex(predicate)
  index !== -1 && array.splice(index, 1)
}

/**
 * 查找并替换数组中的指定元素
 *
 * 注：该方法会更改传入的数组本身
 *
 * @export
 * @template T 数组元素类型
 * @param {T[]} array 需要操作的数组
 * @param {T} source 用于替换的元素
 * @param {(value: T, index: number) => boolean} predicate 查找指定元素的断言
 */
export function findNreplace<T>(array: T[], source: T, predicate: (value: T, index: number) => boolean) {
  const index = array.findIndex(predicate)
  index !== -1 && array.splice(index, 1, source)
}

/**
 * 树节点描述接口
 *
 * @interface TreeNode
 * @template T 数据对象的类型
 */
interface TreeNode<T> {
  children?: T[]
}

/**
 * 树的深度优先递归迭代器
 *
 * @export
 * @template T 节点数据类型
 * @param {T} node 指定的节点
 */
export function* treeWalker<T extends TreeNode<T> = any>(node: any): any {
  yield node

  if (!Array.isArray(node.children)) return

  for (const n of node.children) {
    yield* treeWalker(n)
  }
}

/**
 * 将树平铺为数组
 *
 * 使用深度优先递归顺序展开
 *
 * @export
 * @template T 节点数据类型
 * @param {T} node 指定的节点
 * @returns {T[]} 展开后的数组
 */
export function flattenTree<T extends TreeNode<T> = any>(node: T): T[] {
  return Array.from(treeWalker(node))
}

/**
 * 在类树节点中查找值
 *
 * 使用深度优先递归查询
 *
 * @export
 * @template T 节点数据类型
 * @param {T[]} nodes 节点数组
 * @param {(node: T) => boolean} predicate 判断节点是否符合条件的断言
 * @param {string} [attr='children'] 子节点所在属性的名称
 * @returns {(T | undefined)} 第一个符合断言的节点，如果没有则返回undefined
 */
export function findInTree<T extends TreeNode<T> = any>(nodes: T[], predicate: (node: T) => boolean): T | undefined {
  for (const node of nodes) {
    if (predicate(node)) return node

    if (Array.isArray(node.children) && node.children.length !== 0) {
      const target = findInTree(node.children, predicate)
      if (target !== void 0) return target
    }
  }
}

/**
 * 生成指定位数的随机字母标识
 * @param {number} length 标识长度，默认8位
 * @returns {string} 生成结果
 */
export function idGen(length: number = 8): string {
  let s = ''
  while (length-- > 0) {
    const r = Math.floor(Math.random() * 26) + 97
    s = s + String.fromCharCode(r)
  }
  return s
}

/**
 * 简单版本的对象值覆写
 *
 * @export
 * @param {{}} source 需要被覆写的对象
 * @param {{}} target 覆写值所在的对象
 * @returns {{}} 处理后的源对象
 */
export function assign<T, U>(source: any, target: any): T & U {
  Object.keys(target).forEach((key:any) => {
    target[key] !== void 0 && (source[key] = target[key])
  })

  return source as T & U
}

/**
 * 根据指定字段将数组转成object map的简易方法
 *
 * @export
 * @template T 数组对象类型
 * @param {T[]} arr 需要转换的数组
 * @param {(item: T) => string} keyFn 生成map key的方法，根据遍历传入的数组对象返回生成到最终对象的字段内容
 * @returns {{[key: string]: T}} 生成的Map
 *
 * @example
 *    let a = [{name: 'foo', value: 1}];
 *
 *    let b = arr2map(a, item => item.name);
 *
 *    // b => { foo: { name: 'foo', value: 1 } }
 */
export function arr2map<T>(arr: T[], keyFn: (item: T) => string): { [key: string]: T } {
  return arr.reduce((obj, item) => Object.assign(obj, { [keyFn(item)]: item }), {})
}

/**
 * 将指定对象的值转换为数组
 *
 * @export
 * @template T 值的类型
 * @param {{ [key: string]: T }} obj 需要转换的对象
 * @returns {T[]} 值数组
 */
export function map2arr<T>(obj: { [key: string]: T }): T[] {
  return Object.keys(obj).map((key) => obj[key])
}

/**
 * 将指定对象转换成FormData
 * @param {Object} obj 需要转换的对象
 * @return {FormData} 转换后的FormData
 */
export function obj2FormData(obj: { [key: string]: any }): FormData {
  const fd = new FormData()

  for (const key in obj) {
    fd.append(key, obj[key])
  }

  return fd
}

/**
 * 通过指定字段路径获取对象上的某个值
 *
 * @export
 * @template T 值的类型
 * @param {{ [key: string]: any }} obj 源对象
 * @param {string} path 字段路径，形如"a.b"，返回obj.a.b
 * @returns {T} 返回值
 */
export function getByPath<T = any>(obj: { [key: string]: any }, path: string): any {
  if (path === '' || path === void 0) return void 0

  function recursiveGet<T>(obj: any, arr: string[]): any {
    if (obj === void 0) return void 0

    const child = obj[arr[0]] as T
    return arr.length !== 1
      ? recursiveGet(child, arr.slice(1))
      : child
  }

  const pathArr = path.split('.')
  return recursiveGet<T>(obj, pathArr)
}

/**
 * 从对象数组中获取某个字段的合计值
 *
 * @export
 * @template T 对象类型
 * @template any 默认类型
 * @param {T[]} arr 对象数组
 * @param {string} prop 字段路径
 * @param {number} [digits=2] 需要保留的小数位数
 * @returns {number} 合计值
 */
export function sum<T = any>(arr: T[], prop: string, digits: number = 2): number {
  return trimNum(arr.reduce((sum, item) => sum + trimNum(getByPath(item, prop), 8), 0), digits)
}

/**
 * 根据给定的条件返回经过过滤的数组
 *
 * 数组元素中可包含tuple[boolean, T]，若tuple[0]为真值，则tuple[1]会包含在结果数组中；
 * 若数组元素为T，则直接进入结果数组中；
 *
 * @export
 * @template T 数组元素的类型
 * @param {((T | [boolean, T])[])} items 需要被过滤的数组，元素类型可为T，或者为[boolean, T]的tuple
 * @returns {T[]} 经过过滤的仅包含类型T元素的数组
 */
export function filter(items: any): any[] {
  return items.reduce((results:any, item:any) => {
    if (!Array.isArray(item)) {
      return results.concat(item)
    } else if (item[0]) {
      return results.concat(item[1])
    } else {
      return results
    }
  }, [])
}

/**
 * 检测当前是否为移动端
 *
 * @export
 * @returns {boolean} 检测结果
 */
export function isMobile(): boolean {
  return /(iPhone|iPad|iPod|iOS|Android)/i.test(navigator.userAgent)
}


/**
 * @description diff两数组
 * @export
 * @template T
 * @param {Array<T>} arya
 * @param {Array<T>} aryb
 * @returns {T[]} diff结果
 */
export function arrayDiff<T>(arya: Array<T>, aryb: Array<T>): T[] {
  return arya.filter(function (i) { return aryb.indexOf(i) < 0; });
}

/**
 * @description 节流阀
 * @export
 * @template T
 * @param {function} fn
 * @param {*} wait
 * @returns 
 */
export function throttle<T>(fn:any, wait: number) {
  wait = wait || 0
  let timerId:any
  let lastTime: any = 0

  function throttled() {
    var currentTime = new Date()
    if (currentTime >= lastTime + wait) {
      fn();
      lastTime = currentTime
    } else {
      if (timerId) {
        clearTimeout(timerId)
        timerId = null
      }
      timerId = setTimeout(function () {
        fn()
      }, wait)
    }
  }
  return throttled


}


var toString = Object.prototype.toString;

function isFunction(obj: any) {
  return toString.call(obj) === '[object Function]'
}

export function eq(a: any, b: any, aStack?: any, bStack?: any) {

  // === 结果为 true 的区别出 +0 和 -0
  if (a === b) return a !== 0 || 1 / a === 1 / b;

  // typeof null 的结果为 object ，这里做判断，是为了让有 null 的情况尽早退出函数
  if (a == null || b == null) return false;

  // 判断 NaN
  if (a !== a) return b !== b;

  // 判断参数 a 类型，如果是基本类型，在这里可以直接返回 false
  var type = typeof a;
  if (type !== 'function' && type !== 'object' && typeof b != 'object') return false;

  // 更复杂的对象使用 deepEq 函数进行深度比较
  return deepEq(a, b, aStack, bStack);
};

function deepEq(a:any, b:any, aStack:any, bStack:any) {

  // a 和 b 的内部属性 [[class]] 相同时 返回 true
  var className = toString.call(a);
  if (className !== toString.call(b)) return false;

  switch (className) {
    case '[object RegExp]':
    case '[object String]':
      return '' + a === '' + b;
    case '[object Number]':
      if (+a !== +a) return +b !== +b;
      return +a === 0 ? 1 / +a === 1 / b : +a === +b;
    case '[object Date]':
    case '[object Boolean]':
      return +a === +b;
  }

  var areArrays = className === '[object Array]';
  // 不是数组
  if (!areArrays) {
    // 过滤掉两个函数的情况
    if (typeof a != 'object' || typeof b != 'object') return false;

    var aCtor = a.constructor,
      bCtor = b.constructor;
    // aCtor 和 bCtor 必须都存在并且都不是 Object 构造函数的情况下，aCtor 不等于 bCtor， 那这两个对象就真的不相等啦
    if (aCtor !== bCtor && !(isFunction(aCtor) && aCtor instanceof aCtor && isFunction(bCtor) && bCtor instanceof bCtor) && ('constructor' in a && 'constructor' in b)) {
      return false;
    }
  }


  aStack = aStack || [];
  bStack = bStack || [];
  var length = aStack.length;

  // 检查是否有循环引用的部分
  while (length--) {
    if (aStack[length] === a) {
      return bStack[length] === b;
    }
  }

  aStack.push(a);
  bStack.push(b);

  // 数组判断
  if (areArrays) {

    length = a.length;
    if (length !== b.length) return false;

    while (length--) {
      if (!eq(a[length], b[length], aStack, bStack)) return false;
    }
  }
  // 对象判断
  else {

    var keys = Object.keys(a),
      key;
    length = keys.length;

    if (Object.keys(b).length !== length) return false;
    while (length--) {

      key = keys[length];
      if (!(b.hasOwnProperty(key) && eq(a[key], b[key], aStack, bStack))) return false;
    }
  }

  aStack.pop();
  bStack.pop();
  return true;

}