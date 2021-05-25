/**
 * @file Page 代理类
 * @module page
 * @author 月落 <yueluo.yang@qq.com>
 */

/**
 * @requires libs/event - 发布订阅工具
 * @requires page/init - 初始化
 * @requires libs/utils - 工具函数
 */
import Event from '../libs/event';
import { init } from './init/index';
import { getPageId } from '../libs/utils'
import { clearEffect } from '../reactive/effect';

// 发布订阅工具
export const event = new Event();

/**
 * @description 空函数
 * @returns {number}
 */
const EMPTY_FN = () => {};

/**
 * @description Page 代理 
 * @param {object} $store - 数据源
 * @returns {function}
 */
export const createPage = () => {
  return function (options) {
    const { $store } = getApp();
 
    const load = options.onLoad || EMPTY_FN;
    options.onLoad = function (...args) {
      if (args.length > 1) return load.apply(this, args);

      this.id = getPageId();
      this.$store = $store;

      event.once('load', () => load.apply(this, args));
      event.subscrible('loaded', () => {
        event.fire(this, 'load');
        event.fire(this, 'showed');
      });
    }

    const show = options.onShow || EMPTY_FN;
    options.onShow = function (...args) {
      event.once('showed', () => show.apply(this, args));
      init(this);
    }

    options.setData = function (data, callback = EMPTY_FN) {
      this.__proto__.__proto__.setData.call(this, data, callback); 
    };

    const unload = options.onUnload || EMPTY_FN;
    options.onUnload = function (...args) {
      clearEffect(this.id);
      unload.apply(this, args);
    }

    Page.call(null, options);
  }
}