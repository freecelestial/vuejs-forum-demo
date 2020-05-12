import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes'

Vue.use(Router)


const router = new Router({
    mode: 'history',
    routes
})

// 全局前置守衛
router.beforeEach((to, from, next) => {
    // $options 是用於當前 Vue 實例的初始化選項
    const auth = router.app.$options.store.state.auth
  
    if (auth && to.path.indexOf('/auth/') !== -1) {
        next('/')
    } else {
        next()
    }
})


export default router