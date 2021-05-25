/**
 * @file 响应式开发 
 * @module reactivity
 * @author 月落 <yueluo.yang@qq.com>
 */

/**
 * @requires store/store - 数据仓库
 * @requires page/page - Page 代理
 * @requires reactive/index - 响应式数据
 */
import Store from './store/store';
import { createPage } from './page/index';
import { reactive, effect } from './reactive/index';

// 导出功能API
export {
  Store,
  createPage,
  reactive,
  effect
}