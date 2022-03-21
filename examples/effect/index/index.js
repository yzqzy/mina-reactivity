const { createPage, reactive, effect } = require('mina-reactivity');

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
