import Vue from 'vue'
import Router from 'vue-router'
import routes from './router'
import { getToken } from '@/utils/common'

Vue.use(Router)

const router = new Router({
  routes,
  mode: 'history'
})

// 登陆页面路由 name
const LOGIN_PAGE_NAME = 'login'

// 跳转之前
router.beforeEach((to, from, next) => {
  const token = getToken()
  if (!token && to.name !== LOGIN_PAGE_NAME) {
    // 未登录且要跳转的页面不是登录页
    next({
      name: LOGIN_PAGE_NAME // 跳转到登录页
    })
  } else if (!token && to.name === LOGIN_PAGE_NAME) {
    // 未登陆且要跳转的页面是登录页
    next() // 跳转
  } else if (token && to.name === LOGIN_PAGE_NAME) {
    // 已登录且要跳转的页面是登录页
    next({
      name: 'index' // 跳转到 index 页
    })
  } else {
    if (token) {
      next() // 跳转
    } else {
      next({
        name: LOGIN_PAGE_NAME
      })
    }
  }
})


// 跳转之后
router.afterEach(to => {
  //
})

export default router