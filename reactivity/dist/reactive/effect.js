/**
 * @file 副作用
 * @module reactive/effect
 * @author 月落 <yueluo.yang@qq.com>
 */

/**
 * @property {array} effectStack - 副作用函数 栈
 * @property {function} activeEffect - 当前副作用函数
 */
let effectStack = [],
    activeEffect;

/**
 * @property {number} uid - 函数ID
 */
let uid = 0;

/**
 * @description 创建响应式函数
 * @param {function} fn - 函数
 * @param {object} options - 配置项
 * @returns {function}
 */
const createReactiveEffect = (fn, options) => {
  const effect = function (key) {
    if (effectStack.includes(effect)) {
      return;
    }
   
    try {
      effectStack.push(effect);
      activeEffect = effect;
      return fn(key);
    } finally {
      effectStack.pop();
      activeEffect = effectStack[effectStack.length - 1];
    }
  }

  effect.id = uid++;
  effect.deps = [];
  Object.assign(effect, options);

  return effect;
}

/**
 * @description 创建响应式函数
 * @param {function} fn - 函数
 * @param {object} options - 配置项
 * @returns {function}
 */
export const effect = (fn, options = {}) => {
  const effect = createReactiveEffect(fn, options);
  effect();
  return effect;
}

/**
 * @property {map} targetMap - 依赖关系
 */
const targetMap = new Map();

/**
 * @description 依赖收集
 * @param {object} target - 目标对象
 * @param {string} key - 属性名
 * @returns {void}
 */
export const track = (target, key) => {
  if (activeEffect === undefined) {
    return;
  }

  let depsMap = targetMap.get(target);

  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()));
  }

  let dep = depsMap.get(key);

  if (!dep) {
    depsMap.set(key, (dep = new Set()));
  }

  const isExist = () => {
    for (const { _render, _pid } of dep.values()) {
      if (_render&& _pid === activeEffect._pid) {
        return true;
      }
    }
  }
  
  if (!dep.has(activeEffect) && !isExist()) {
    dep.add(activeEffect);
    activeEffect.deps.push(dep)
  }
}

/**
 * @description 触发器
 * @param {object} target - 目标对象
 * @param {string} key - 属性名
 * @param {any} oldValue - 旧值
 * @param {any} value - 新值
 * @param {string} updateKey - 属性名
 * @returns {void}
 */
export const trigger = (target, key, oldValue, value, updateKey) => {
  const desMap = targetMap.get(target);

  if (!desMap) {
    return;
  }

  const effects = new Set();

  const add = (effectsToAdd) => {
    if (effectsToAdd) {
      effectsToAdd.forEach(effect => {
        effects.add(effect);
      });
    }
  }

  if (key != null) {
    add(desMap.get(key));
  }

  const run = (effect) => effect(updateKey);

  effects.forEach(run);
}

/**
 * @description 清除页面依赖
 * @param {number} pid - 页面ID
 * @returns {void} 
 */
export const clearEffect = (pid) => {
  targetMap.forEach(target => {
    target.forEach(effcts => {
      effcts.forEach(effect => {
        if (effect._pid === pid) {
          effcts.delete(effect);
        }
      });
    });
  });
}