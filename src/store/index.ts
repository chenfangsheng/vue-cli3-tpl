import Vue from 'vue'
import Vuex from 'vuex'

// modules
import Login from './module/login'
import Index from './module/index'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    //
  },
  mutations: {
    //
  },
  actions: {
    //
  },
  modules: {
    Login,
    Index
  }
})
