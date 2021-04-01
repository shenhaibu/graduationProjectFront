import Vue from 'vue'
import Vuex from 'vuex'
import { getLogInfoHttp } from "../axios/api"


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loginInfo: null
  },
  mutations: {
    getLog(state, loginInfo) {
      state.loginInfo = loginInfo
    }
  },
  actions: {
    getLogInfo(state, loginInfo) {
      this.commit("getLog", loginInfo)
    }
  },
  modules: {
  }
})
