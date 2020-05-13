import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes'

Vue.use(Router)


const router = new Router({
    mode: 'history',
    // 使 <router-view/> 路徑相同時，自動加入 class="active"
    linkExactActiveClass: 'active',
    routes
})

// 全局前置守衛
router.beforeEach((to, from, next) => {
    // $options 是用於當前 Vue 實例的初始化選項
    const app = router.app
    const store = app.$options.store
    const auth = store.state.auth

    // 登入的情況下，網址有 auth，會跳轉到首頁
    if (
        (auth && to.path.indexOf('/auth/') !== -1) ||
        (!auth && to.meta.auth)
    ) {
        next('/')
    } else {
        next()
    }
})


export default router