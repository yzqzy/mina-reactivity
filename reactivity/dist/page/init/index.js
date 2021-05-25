/**
 * @file 初始化函数
 * @module page/init
 * @author 月落 <yueluo.yang@qq.com>
 */

/**
 * @requires init/initData - 数据初始化
 * @requires init/initData - Mixins 初始化
 */
import { initData, resetEventMid } from './initData';
import { initMixin } from './initMixin';

/**
 * @description 初始化函数
 * @param {object} ctx - 上下文环境 
 * @returns {void}
 */
const init = (ctx) => {
  const { $data: getter, mixins } = ctx;
  console.log('[page]： data is rendering.');
  resetEventMid();
  initMixin(ctx, mixins);
  initData(ctx, getter);
}

export {
  init
}