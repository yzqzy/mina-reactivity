import { Store } from '@minipro/reactivity';

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