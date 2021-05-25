const { createPage } = require('@minipro/reactivity');

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