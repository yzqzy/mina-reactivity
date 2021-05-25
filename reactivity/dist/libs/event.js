/**
 * @file 发布订阅
 * @module libs/event
 * @author 月落 <yangzhiqiang10142@duia.com>
 */
/**
 * @description 处理发布订阅等操作
 * @returns {object} 发布订阅函数集合
 */
class Event {
  constructor () {
    // 事件对象
    this.handers = new Map();
  }

  /**
   * @description 订阅事件
   * @param {string} sign 事件名称
   * @param {function} hander 触发订阅事件时的处理函数
   * @return {void}
   */
  subscrible (sign, hander) {
    this.handers.set(sign, hander)
  }

  /**
   * @description 单次订阅事件
   * @param {string} sign 事件名称
   * @param {function} hander 触发订阅事件时的处理函数
   * @return {void}
   */
  once (sign, hander) {
    const fn = (...args) => {
      hander.apply(this, args);
      this.off(sign);
    };
    this.subscrible(sign, fn);
  }

  /**
   * @description 发布事件
   * @param {object} sender 当前上下文环境
   * @param {string} sign 事件名称
   * @param {array} args 传递参数
   * @return {void}
   */
  fire (sender, sign, args) {
    this.handers.get(sign) && this.handers.get(sign)(sender, args);
  }

  /**
   * @description 发布所有事件
   * @param {object} sender 当前上下文环境
   * @param {any} args 传递参数
   * @return {void}
   */
  fireAll (sender, args) {
    this.handers.forEach((v, k) => v(sender, args));
  }

  /**
   * @description 删除指定事件
   * @param {string} sign 事件名称
   * @return {void}
   */
  off (sign) { 
    this.handers.delete(sign)
  }
}

// 导出发布订阅函数
export default Event;