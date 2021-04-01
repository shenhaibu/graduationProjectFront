import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import { getLogInfoHttp } from "@/axios/api"
import store from "@/store/index"

Vue.use(VueRouter)

const routes = [
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
        path: 'subscribe',
        name: 'Subscribe',
        component: () => import(/* webpackChunkName: "Subscribe" */ '../components/user/Subscribe.vue'),
      },
      {
        path: 'mySubscribe',
        name: 'MySubscribe',
        component: () => import(/* webpackChunkName: "MySubscribe" */ '../components/user/MySubscribe.vue'),
      },
      {
        path: 'subscribeDetail',
        name: 'SubscribeDetail',
        component: () => import(/* webpackChunkName: "SubscribeDetail" */ '../components/user/SubscribeDetail.vue'),
      },
      {
        path: 'userPerson',
        name: 'UserPerson',
        component: () => import(/* webpackChunkName: "UserPerson" */ '../components/user/UserPerson.vue'),
      }
    ]
  },
  {
    path: '/provider',
    name: 'Provider',
    component: () => import(/* webpackChunkName: "user" */ '../components/MenuLeft.vue'),
    children: [
      {
        path: 'addStadium',
        name: 'AddStadium',
        component: () => import(/* webpackChunkName: "addStadium" */ '../components/provider/AddStadium.vue'),
      },
      {
        path: 'modifyStadium',
        name: 'ModifyStadium',
        component: () => import(/* webpackChunkName: "modifyStadium" */ '../components/provider/ModifyStadium.vue'),
      },
      {
        path: 'modifyPerInfor',
        name: 'ModifyPerInfor',
        component: () => import(/* webpackChunkName: "ModifyPerInfor" */ '../components/provider/ModifyPerInfor.vue'),
      },
      {
        path: 'myUser',
        name: 'MyUser',
        component: () => import(/* webpackChunkName: "MyUser" */ '../components/provider/MyUser.vue'),
      },
      {
        path: 'statistical',
        name: 'statistical',
        component: () => import(/* webpackChunkName: "Statistical" */ '../components/provider/Statistical.vue'),
      }
    ]
  },
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  let loginId = localStorage.loginId
  if (!loginId && to.name !== "LogIn") {
    next({ name: "LogIn" })
  } else if (loginId && !store.state.loginInfo) {
    getLogInfoHttp(loginId).then(res => {
      store.dispatch("getLogInfo", res.data)
      next()
    })
  } else {
    next()
  }
})

export default router
