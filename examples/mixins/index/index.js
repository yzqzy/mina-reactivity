const { createPage, reactive } = require('@minipro/reactivity');

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
