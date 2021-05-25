/**
 * @file Mixins 初始化
 * @module page/init/initData
 * @author 月落 <yueluo.yang@qq.com>
 */
 
/**
 * @requires pages/initData - 数据初始化
 * @requires libs/utils - 工具函数
 */
import { initData } from './initData';
import { isArray } from '../../libs/utils';

/**
 * @constant {string} MIXIN_DATA
 * @constant {string} MIXIN_METHOD
 */
const MIXIN_DATA = 'data',
      MIXIN_METHOD = 'methods';

/**
 * @description 初始化 Mixin
 * @returns {void} 
 */
export const initMixin = (ctx, mixins) => {
  if (isArray(mixins)) {
    mixins.forEach(mixin => {
      // 初始化数据
      initData(ctx, mixin[MIXIN_DATA]);
      // 初始化方法
      Object.assign(ctx, mixin[MIXIN_METHOD]);
    });
  }
}