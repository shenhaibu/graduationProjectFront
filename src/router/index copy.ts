import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
// import {getLogInfoHttp} from "@/axios/api"

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'LogIn',
    component: () => import(/* webpackChunkName: "LogIn" */ '../views/LogIn.vue')
  },
  {
    path: '/user',
    name: 'User',
    component: () => import(/* webpackChunkName: "user" */ '../components/MenuLeft.vue'),
    children: [
      {
        path: '/Subscribe',
        name: 'Subscribe',
        component: () => import(/* webpackChunkName: "Subscribe" */ '../components/user/Subscribe.vue'),
      },
      {
        path: '/MySubscribe',
        name: 'MySubscribe',
        component: () => import(/* webpackChunkName: "MySubscribe" */ '../components/user/MySubscribe.vue'),
      }
    ]
  },
  {
    path: '/provider',
    name: 'Provider',
    component: () => import(/* webpackChunkName: "user" */ '../components/MenuLeft.vue'),
    children: [
      {
        path: '/addStadium',
        name: 'AddStadium',
        component: () => import(/* webpackChunkName: "addStadium" */ '../components/provider/addStadium.vue'),
      },
      {
        path: '/ModifyPerInfor',
        name: 'ModifyPerInfor',
        component: () => import(/* webpackChunkName: "ModifyPerInfor" */ '../components/provider/ModifyPerInfor.vue'),
      }
    ]
  },
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (from.fullPath == "/") {
    if (!localStorage.doLogInfo) {

    }
  }
  console.log(from)
  console.log("router.beforeEach")
  next()
})

export default router
