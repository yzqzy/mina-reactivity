/**
 * @file 工具函数
 * @module libs/utils
 * @author 月落 <yangzhiqiang10142@duia.com>
 */

/**
 * @description 判断是否为自身属性
 * @param {object} target - 目标对象 
 * @param {string} key - 属性名
 * @returns {boolean}
 */
const hasOwn = (target, key) => hasOwnProperty.call(target, key);

/**
 * @description 判断是否为函数
 * @param {any} val - 属性值
 * @returns {boolean} 
 */
const isFunction = (val) => typeof(val) === 'function';

/**
 * @description 判断是否为数组
 * @param {any} val - 属性值
 * @returns {boolean} 
 */
const isArray = (val) => Array.isArray(val);

/**
 * @description 判断是否为对象
 * @param {any} val - 属性值
 * @returns {boolean}
 */
const isObject = (val) => typeof val === 'object' && val != null;

/**
 * @description 数据类型检测
 * @param {any} val - 数据 
 * @returns {string}
 */
const detectType = (val) => {
  if (val === null) {
    return 'null';
  }

  if (typeof val === 'object') {
    return {
      '[object Array]': 'array',
      '[object Object]': 'object'
    }[Object.prototype.toString.call(val)]
  }

  return typeof val;
}

/**
 * @description 获取路由长度，作为页面ID
 * @returns {number}
 */
const getPageId = () => getCurrentPages().length;

export {
  hasOwn,
  isFunction,
  isArray,
  isObject,
  detectType,
  getPageId
}