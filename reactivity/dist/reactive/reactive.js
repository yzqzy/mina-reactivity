/**
 * @file 响应式数据
 * @module reactive/reactive
 * @author 月落 <yueluo.yang@qq.com>
 */

 /**
  * @requires reactive/effect - 副作用
  * @requires libs/utils - 工具函数
  */
 import { track, trigger } from './effect';
 import { hasOwn, isObject, detectType } from '../libs/utils';

/**
 * @description 编译数组类型字符串
 * @param {string} type - 类型 
 * @param {string} val - 值
 * @returns {string}
 */
const compilerArrayText = (type, val) => type === 'array' && !isNaN(Number(val)) ? `[${val}]` : val;

/**
 * @constant {number} STATE_SIZE - state 字母长度
 * @constant {number} COMPILER_LIMIT - 字符串数据处理 边界条件
 * @constant {string} __EXP__
 * @constant {string} __PARENT__
 */
const STATE_SIZE = 6,
      COMPILER_LIMIT = 0,
      __EXP__ = '__exp__',
      __PARENT__ = '__parent__';
 
/**
 * @description 判断是否是无用字段
 * @param {string} key - 字符串 
 * @returns {boolean}
 */
const isUselessProperty = (key) => key === __EXP__ || key === __PARENT__;

/**
 * @description 过滤更新 KEY
 * @param {string} key - 键 
 * @returns {string}
 */
const filterUpdateKey = (key) => {
  const index = key.indexOf('state');  
  return !!~index ? key.substr(index + STATE_SIZE) : key; 
}

 /**
  * @constant {obejct} Handler
  */
const baseHandler = {
  get (target, key) {
    const result = Reflect.get(target, key);

    if (isUselessProperty(key)) {
      return result;
    };

    // 依赖收集
    track(target, key);
    // 递归解析
    // if (isObject(result)) {
    //   return reactive(
    //     result,
    //     [...target.__exp__, key],
    //     [...target.__parent__, detectType(target)]
    //   );
    // }
    return result;
  },
  set (target, key, value, receiver) {
    // 保存旧值
    const oldValue = target[key];
    // 处理新值
    const result = Reflect.set(target, key, value, receiver);

    if (isUselessProperty(key)) {
      return result;
    };
    
    if (hasOwn(target, key)) {
      const compilerExp = target.__exp__,
            compilerParent = target.__parent__;

      let updateKey = '';

      if (compilerExp.length > COMPILER_LIMIT) {
        updateKey = compilerExp.reduce((prev, item, index) => {
          const type = compilerParent[index];
          return `${prev}.${ compilerArrayText(type, item) }`;
        });

        updateKey = filterUpdateKey(updateKey);
        updateKey += `${ updateKey ? '.' : '' }${ compilerArrayText(detectType(target), key) }`;
      } else {
        updateKey = key;
      }

      trigger(target, key, oldValue, value, updateKey);
    } else {
      console.log('[reactive]：store is no this property');
    }

    return result;
  }
}

/**
* @description 响应式数据
* @param {object} data - 原始数据
* @returns {void} 
*/
export function reactive (target, __exp__ = [], __parent__ = []) {
  const observed = new Proxy(Object.assign(target, {
    __exp__,
    __parent__,
  }), baseHandler);
  return observed;
}