const { createPage } = require('@minipro/reactivity');

createPage()({
  $data: (ctx) => {
    const state = ctx.$store.state;

    return {
      count: state.count
    }
  }
})