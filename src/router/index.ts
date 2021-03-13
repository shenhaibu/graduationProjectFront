import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'LogIn',
    component: () => import(/* webpackChunkName: "LogIn" */ '../views/LogIn.vue')
  },
]

const router = new VueRouter({
  routes
})

export default router
