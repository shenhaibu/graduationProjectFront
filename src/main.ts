import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import * as echarts from 'echarts'


import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false
Vue.prototype.$echarts = echarts
console.log("echarts main.ts  echarts" ,echarts)
Vue.use(ElementUI);
Vue.use(echarts);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
