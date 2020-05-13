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
    const articleId = to.params.articleId

    // 登入的情況下，網址有 auth，會跳轉到首頁
    if (
        (auth && to.path.indexOf('/auth/') !== -1) || 
        (!auth && to.meta.auth) || 
        // 有 articleId 且不能找到与其对应的文章时，跳转到首页
        (articleId && !store.getters.getArticleById(articleId))
    ) {
        next('/')
    } else {
        next()
    }
})


// 註冊全局後置鉤子
router.afterEach((to, from) => {
    const app = router.app
    const store = app.$options.store
    const showMsg = to.params.showMsg
  
    if (showMsg) {
        if (typeof showMsg === 'string') {
            app.$bvToast.toast(showMsg, {
                title:'訊息',
                toaster: 'b-toaster-bottom-right',
                autoHideDelay: 5000,
                appendToast: true
            })
        } else {
            app.$bvToast.toast('操作成功', {
                title:'訊息',
                toaster: 'b-toaster-bottom-right',
                autoHideDelay: 5000,
                appendToast: true
            })

        }
    }
})



export default router