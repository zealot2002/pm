
let lastClickTime = 0

/**
 * 检查是否快速点击
 * @param {number} delay - 间隔时间(ms)，默认300ms
 * @returns {boolean} - true表示快速点击，false表示可以执行
 */
export function isFastClick(delay = 3000) {
  const now = Date.now()
  const timeDistance = now - lastClickTime

  if (timeDistance < delay) {
    return true
  }

  lastClickTime = now
  return false
}

/**
 * 防抖函数装饰器
 * @param {Function} fn - 需要防抖的函数
 * @param {number} delay - 间隔时间(ms)，默认300ms
 * @returns {Function} - 包装后的函数
 */
export function withDebounce(fn, delay = 300) {
  return function(...args) {
    if (isFastClick(delay)) {
      console.warn('操作太频繁，请稍后再试')
      return
    }
    return fn.apply(this, args)
  }
}
