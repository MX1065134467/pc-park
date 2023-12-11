import Vue from 'vue'
import Vuex from 'vuex'
import examples from './modules/examples'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    examples
  }
})

export default store
