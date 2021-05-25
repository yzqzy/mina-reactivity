const { createPage, reactive } = require('@minipro/reactivity');

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
