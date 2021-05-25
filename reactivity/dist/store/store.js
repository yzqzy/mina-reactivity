/**
 * @file 数据仓库
 * @description
 *  1. 已实现 getters、mutations、actions 功能
 *  2. 未实现 modules 功能
 * @module store
 * @author 月落 <yueluo.yang@qq.com>
 */

/**
 * @requires reactive/reactive - 代理类
 */
import { reactive } from '../reactive/reactive';

/**
 * @description 遍历对象 键
 * @param {object} obj - 目标对象 
 * @param {function} callback - 回调函数
 * @returns {void}
 */
const forEach = (obj, callback) => {
  Object.keys(obj).forEach(key => {
    callback(key, obj[key]);
  });
}

/**
 * @class Store
 * @classdesc 自定义 Store
 */
export default class Store {
  constructor (options) {
    this.state = reactive(options.state);
    this.getters = {};
    this.mutations = {};
    this.actions = {};

    const getters = options.getters || {};
    forEach(getters, (getterName, fn) => {
      Object.defineProperty(this.getters, getterName, {
        get: () => fn(this.state)
      });
    });

    const mutations = options.mutations || {};
    forEach(mutations, (mutationName, fn) => {
      this.mutations[mutationName] = (payload) => {
        fn.call(this, this.state, payload);
      }
    });

    const actions = options.actions || {};
    forEach(actions, (actionName, fn) => {
      this.actions[actionName] = (payload) => {
        fn.call(this, this, payload);
      }
    });

    const { dispatch, commit } = this;
    this.dispatch = (...args) => dispatch.call(this, ...args);
    this.commit = (...args) => commit.call(this, ...args);
  }

  /**
   * @description 异步提交数据
   * @returns {void}
   */
  dispatch (type, payload) {
    console.log('[store dispatch]', type, payload);
    Promise.resolve().then(this.actions[type](payload));
  }

  /**
   * @description 同步提交数据
   * @returns {void}
   */
  commit (type, payload) {
    console.log('[store commit]', type, payload);
    this.mutations[type](payload);
  }
}