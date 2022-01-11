## 小程序状态管理

### 项目介绍

小程序状态管理解决方案。

目前已支持以下功能。

* 数据驱动
* mixins（混入）
* 状态管理（全局 store）
* effect（副作用）

### 安装

#### 1. NPM 安装

```js
npm i @mina/reactivity --save
```

安装完成后，使用小程序开发工具构建 **NPM** 即可。

#### 2. 复制文件

下载源码后，将 **reactivity/dist** 中文件复制到自己的项目中即可。

### 使用案例

#### 1. 数据驱动

```js
const { createPage, reactive } = require('@mina/reactivity');

const student = reactive({
  name: '张三'
});

createPage()({
  $data: () => {
    return {
      name: student.name
    }
  },

  onLoad: function () {
    setTimeout(() => {
      student.name = '李四';
    }, 3 * 1000)
  },
})

```

[代码片段](https://developers.weixin.qq.com/s/L65LMPmy74lT)

#### 2. mixins 

```js
const { createPage, reactive } = require('@mina/reactivity');

const student = reactive({
  name: '张三'
});

const commonMixin = {
  data: () => {
    return {
      name: student.name
    }
  },
  methods: {
    test () {
      console.log('test.');
    }
  }
}

createPage()({
  mixins: [
    commonMixin
  ],

  onLoad: function () {
    this.test();

    setTimeout(() => {
      student.name = '李四';
    }, 3 * 1000)
  },
})
```

[代码片段](https://developers.weixin.qq.com/s/Gp5hoPmI7plL)

#### 3. 状态管理

##### 1. 创建store

```js
import { Store } from '@mina/reactivity';

export default new Store({
  state: {
    student: {
      name: '张三'
    },
    count: 0
  },
  mutations: {
    changeState: (state, data) => {
      Object.keys(data).forEach(key => (state[key] = data[key]));
    }
  }
});
```

##### 2. 全局注册 store（app.js）

```js
import store from './store/index';

App({
  $store: store
})
```

##### 3. 页面使用

```js
const { createPage } = require('@mina/reactivity');

createPage()({
  $data: (ctx) => {
    const state = ctx.$store.state;

    return {
      student: state.student,
      count: state.count
    }
  },

  onLoad: function () {
    let timer = setInterval(() => {
      const count = this.data.count;

      if (count === 10) {
        return clearInterval(timer)
      };

      this.$store.commit('changeState', {
        count: count + 1
      })
    }, 1 * 1000);

    setTimeout(() => {
      this.$store.commit('changeState', {
        student: {
          name: '李四'
        }
      });
    }, 3 * 1000)
  },
})
```

[代码片段](https://developers.weixin.qq.com/s/qG8DYPmc7slV)

#### 4. 副作用函数

```js
const { createPage, reactive, effect } = require('@mina/reactivity');

const student = reactive({
  name: '张三'
});

createPage()({
  $data: () => {
    return {
      name: student.name
    }
  },

  onLoad: function () {
    effect(() => {
      console.log('effect：', student.name);
    });

    setTimeout(() => {
      student.name = '李四';
    }, 5 * 1000)
  },
})
```

[代码片段](https://developers.weixin.qq.com/s/xq97APmj7tlV)
