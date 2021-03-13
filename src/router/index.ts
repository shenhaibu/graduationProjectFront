import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'LogIn',
    component: () => import(/* webpackChunkName: "LogIn" */ '../views/LogIn.vue')
  },
  {
    path: '/index',
    name: 'Index',
    component: () => import(/* webpackChunkName: "Index" */ '../components/MenuLeft.vue'),
    children: [
      {
        path: '/leftNav1',
        name: 'leftNav1',
        component: () => import(/* webpackChunkName: "leftNav1" */ '../components/leftNav1.vue'),
      }
    ]
  },
]

const router = new VueRouter({
  routes
})

export default router
