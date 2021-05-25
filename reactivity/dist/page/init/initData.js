/**
 * @file 数据初始化
 * @module page/init/initData
 * @author 月落 <yueluo.yang@qq.com>
 */

/**
 * @requires page/index - 解构 event 对象
 * @requires reactive/index - 响应式
 * @requires libs/utils - 工具函数
 */
import { event } from '../index';
import { effect } from '../../reactive/index';
import { isFunction, isArray, getPageId } from '../../libs/utils';

/**
 * @property {object} cache - 数据缓存池
 */
const cache = {
  mid: 0
};

/**
 * @constant {Reg} MATCH_ARRAY_REG - 匹配数组下标
 */
const MATCH_ARRAY_REG = /\[(.*?)\]/;

export const resetEventMid = () => {
  cache.mid = 0;
}

/**
 * @description 数据加载完毕
 * @returns {void}
 */
export const _loaded = () => {
  if (--cache.mid === 0) {
    console.log(`[page]： data rendering finished.`);
    event.fire(this, 'loaded');
  }
}

/**
 * @description 计算属性处理
 * @param {object} data - 数据对象
 * @returns {void}
 */
const initComputedData = (ctx, data) => {
  Object.keys(data).forEach(key => {
    const value = data[key];

    if (isFunction(value)) {
      effect(() => {
        if (ctx.id !== getPageId()) return;

        cache.mid++;

        ctx.setData({
          [key]: value()
        }, _loaded);
      }, { _pid: ctx.id, _render: true });
      delete data[key];
    }
  });
}

/**
 * @description 初始化数据
 * @returns {void}
 */ 
export const initData = (ctx, getter) => {
  if (!getter) return;

  const run = (getter) => {
    effect((key) => {
      if (ctx.id !== getPageId()) return;

      cache.mid++;

      const data = getter(ctx);

      // 只渲染当前修改值
      if (key) {
        const renderData = key.split('.').reduce((prev, item) => {
          if (MATCH_ARRAY_REG.test(item)) {
            item = item.replace(MATCH_ARRAY_REG, (node, key) => parseInt(key));
          }
          return prev[item];
        }, data);

        ctx.setData({
          [key]: renderData
        }, _loaded);
        return;
      }

      // 处理计算属性
      initComputedData(ctx, data);

      // 设置页面数据
      ctx.setData(data, _loaded);
    }, { _pid: ctx.id, _render: true });
  }

  // getter 执行
  if (isFunction(getter)) {
    run(getter);
  } else if (isArray(getter)) {
    getter.forEach(run);
  } else {
    throw new Error('the data is must be a function or array function.');
  }
}